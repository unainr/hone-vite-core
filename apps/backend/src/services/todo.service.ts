// src/services/todo.service.ts
import type { Db } from '../db'

import { eq, and,desc } from 'drizzle-orm'
import { todos } from '../db/schema';

export class TodoService {
  constructor(private db: Db) {}

  async list(userId: string) {
    return this. db.select().from(todos).where(eq(todos.userId, userId)).orderBy(desc(todos.createdAt));

  }

  async create(userId: string, data: { title: string; dueDate?: Date }) {
    const [row] = await this.db
      .insert(todos)
      .values({

        userId,
        title: data.title,
        dueDate: data.dueDate,
      })
      .returning()
    return row
  }

async toggle(id: string, userId: string, done: boolean) {
	const [row] = await this.db
		.update(todos)
		.set({ done })
		.where(and(eq(todos.id, id), eq(todos.userId, userId)))
		.returning();
	return row ?? null;
}

}   