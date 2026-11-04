import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_main")({
	component: () => (
		<div className="flex min-h-screen flex-col">
			navbar dahsobard
			<main className="flex-1">
				<Outlet />
			</main>
		</div>
	),
});
