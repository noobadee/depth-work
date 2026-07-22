import { eq } from "drizzle-orm";
import { db } from "@/db/index.ts";
import { user } from "@/db/schema/index.ts";
import type { IUserRepository, User } from "@/modules/auth/types.ts";

export class UserRepository implements IUserRepository {
  async findById(id: string): Promise<User | null> {
    const [result] = await db
      .select()
      .from(user)
      .where(eq(user.id, id))
      .limit(1);
    return result ?? null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const [result] = await db
      .select()
      .from(user)
      .where(eq(user.email, email))
      .limit(1);
    return result ?? null;
  }
}
