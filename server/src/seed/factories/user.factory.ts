export { makeUser, makeUsers, makeAccount, makeAccounts };

import { randomUUID } from "node:crypto";
import { hash } from "bcryptjs";
import type { NewAccount, NewUser } from "@/db/schema/index.ts";

const USER_ATTRIBUTES = {
  emailVerified: true,
  image: null,
} as const;

const ACCOUNT_ATTRIBUTES = {
  providerId: "credential",
  accessToken: null,
  refreshToken: null,
  idToken: null,
  accessTokenExpiresAt: null,
  refreshTokenExpiresAt: null,
  scope: null,
} as const;

interface MakeUser {
  name: string;
  email: string;
}

interface MakeAccount {
  userId: string;
  password: string;
}

function makeUser({ name, email }: MakeUser): NewUser {
  return {
    id: randomUUID(),
    name,
    email,
    emailVerified: true,
    image: null,
  };
}

function makeUsers(users: MakeUser[]): NewUser[] {
  const newUsers = users.map((user) => ({
    ...USER_ATTRIBUTES,
    id: randomUUID(),
    name: user.name,
    email: user.email,
  }));

  return newUsers;
}

async function makeAccount({
  userId,
  password,
}: MakeAccount): Promise<NewAccount> {
  return {
    id: randomUUID(),
    accountId: userId,
    providerId: "credential",
    userId: userId,
    accessToken: null,
    refreshToken: null,
    idToken: null,
    accessTokenExpiresAt: null,
    refreshTokenExpiresAt: null,
    scope: null,
    password: await hashPassword(password),
  };
}

async function makeAccounts(accounts: MakeAccount[]): Promise<NewAccount[]> {
  const newAccounts = await Promise.all(
    accounts.map(async (account) => ({
      ...ACCOUNT_ATTRIBUTES,
      id: randomUUID(),
      accountId: account.userId,
      userId: account.userId,
      password: await hashPassword(account.password),
    })),
  );

  return newAccounts;
}

async function hashPassword(plain: string): Promise<string> {
  return await hash(plain, 10);
}
