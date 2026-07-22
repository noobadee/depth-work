import { user } from "@/db/schema/index.ts";

export type User = typeof user.$inferSelect;

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
}
