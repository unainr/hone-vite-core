import { relations } from "drizzle-orm";
import {
	pgTable,
	text,
	timestamp,
	boolean,
	index,
	pgEnum,
	jsonb,
	uniqueIndex,
	integer,
} from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

export const user = pgTable("user", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	emailVerified: boolean("email_verified").default(false).notNull(),
	image: text("image"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at")
		.defaultNow()
		.$onUpdate(() => /* @__PURE__ */ new Date())
		.notNull(),
});

export const session = pgTable(
	"session",
	{
		id: text("id").primaryKey(),
		expiresAt: timestamp("expires_at").notNull(),
		token: text("token").notNull().unique(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),
		ipAddress: text("ip_address"),
		userAgent: text("user_agent"),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
	},
	(table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
	"account",
	{
		id: text("id").primaryKey(),
		accountId: text("account_id").notNull(),
		providerId: text("provider_id").notNull(),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		accessToken: text("access_token"),
		refreshToken: text("refresh_token"),
		idToken: text("id_token"),
		accessTokenExpiresAt: timestamp("access_token_expires_at"),
		refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
		scope: text("scope"),
		password: text("password"),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),
	},
	(table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
	"verification",
	{
		id: text("id").primaryKey(),
		identifier: text("identifier").notNull(),
		value: text("value").notNull(),
		expiresAt: timestamp("expires_at").notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),
	},
	(table) => [index("verification_identifier_idx").on(table.identifier)],
);

// ---------- app schema---------------------


const id = () =>
	text("id")
		.primaryKey()
		.$defaultFn(() => nanoid());

export const projectStatus = pgEnum("project_status", [
	"planning",
	"building",
	"ready",
	"failed",
]);

// Added "system" role for LLM context instructions
export const messageRole = pgEnum("message_role", ["system", "user", "assistant"]);

export const projects = pgTable(
	"projects",
	{
		id: id(),
		ownerId: text("owner_id").notNull(), // Clerk userId
		title: text("title").notNull(),
		prompt: text("prompt").notNull(), // the first idea
		status: projectStatus("status").notNull().default("building"),
		plan: jsonb("plan"), // screens, theme (Phase 4)
		snackSdkVersion: text("snack_sdk_version").notNull(),
		
		// ADDED: Required to load the iframe mockup in the browser and generate the Expo Go QR code
		snackId: text("snack_id"), 
		
		createdAt: timestamp("created_at").notNull().defaultNow(),
		// FIXED: Added $onUpdate so this automatically changes when the project is edited
		updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()), 
	},
	(t) => [index("projects_owner_idx").on(t.ownerId)],
);

// ADDED: The chat history for the left-side panel
export const messages = pgTable(
	"messages",
	{
		id: id(),
		projectId: text("project_id")
			.notNull()
			.references(() => projects.id, { onDelete: "cascade" }),
		role: messageRole("role").notNull(),
		content: text("content").notNull(),
		metadata: jsonb("metadata"), // Optional: Store tool calls, code block references, or AI reasoning
		createdAt: timestamp("created_at").notNull().defaultNow(),
	},
	(t) => [index("messages_project_idx").on(t.projectId, t.createdAt)],
);

// current version of every file in a project
export const projectFiles = pgTable(
	"project_files",
	{
		id: id(),
		projectId: text("project_id")
			.notNull()
			.references(() => projects.id, { onDelete: "cascade" }),
		path: text("path").notNull(), // "App.js", "screens/Home.js"
		content: text("content").notNull(),
		// FIXED: Added $onUpdate
		updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
	},
	(t) => [uniqueIndex("project_files_unique").on(t.projectId, t.path)],
);

// ── Phase 5: version history ───────────────────────────
export const projectVersions = pgTable(
	"project_versions",
	{
		id: id(),
		projectId: text("project_id")
			.notNull()
			.references(() => projects.id, { onDelete: "cascade" }),
		label: text("label").notNull(), // "Added settings screen"
		files: jsonb("files").notNull(), // { "App.js": "...", ... } snapshot
		createdAt: timestamp("created_at").notNull().defaultNow(),
	},
	(t) => [index("versions_project_idx").on(t.projectId, t.createdAt)],
);

// ── Phase 6: credits ───────────────────────────────────
export const userCredits = pgTable("user_credits", {
	userId: text("user_id").primaryKey(), // Clerk userId
	credits: integer("credits").notNull().default(100),
});

export const creditTransactions = pgTable(
	"credit_transactions",
	{
		id: id(),
		userId: text("user_id").notNull(),
		amount: integer("amount").notNull(), // negative = spent, positive = refund/top-up
		reason: text("reason").notNull(), // "build", "edit", "refund"
		reference: text("reference").notNull(), // unique, makes refunds idempotent
		createdAt: timestamp("created_at").notNull().defaultNow(),
	},
	(t) => [
        uniqueIndex("credit_tx_reference").on(t.reference),
        // ADDED: Crucial for fast fetching of a user's billing history
        index("credit_tx_user_idx").on(t.userId, t.createdAt) 
    ],
);