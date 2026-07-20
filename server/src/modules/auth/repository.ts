import { eq } from "drizzle-orm";
import { db } from "@/db/index.ts";
import { user } from "@/db/schema/index.ts";

export class UserRepository {
  async findByEmail(email: string) {
    const [result] = await db
      .select()
      .from(user)
      .where(eq(user.email, email))
      .limit(1);
    return result ?? null;
  }
}
