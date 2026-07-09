import bcrypt from "bcryptjs";
import { randomUUID } from "node:crypto";
import { env } from "../config/env.ts";
import { db } from "../db/index.ts";
import {
  user,
  session,
  account,
  verification,
  workspaces,
  workspaceMembers,
  projects,
  tasks,
  focus_sessions,
  focus_session_tasks,
} from "../db/schema/index.ts";
import type {
  NewWorkspace,
  NewWorkspaceMember,
  NewProject,
  NewTask,
  NewFocusSession,
  NewFocusSessionTask,
} from "../db/schema/index.ts";

if (env.NODE_ENV === "production") {
  console.error("❌ Seed script is not allowed to run in production");
  process.exit(1);
}

async function main() {
  const args = process.argv.slice(2);

  try {
    if (args.includes("--reset")) {
      await clearAllTables();
      return;
    }
    await seed();
  } catch (err) {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

async function seed() {
  console.log("🍃 Seeding database...");

  // USERS

  const userId1 = randomUUID();
  const userId2 = randomUUID();
  const userId3 = randomUUID();

  const users = [
    {
      id: userId1,
      name: "Mark Mendez",
      email: "mark@example.com",
      emailVerified: true,
      image: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: userId2,
      name: "Leo Brimstone",
      email: "leo@example.com",
      emailVerified: true,
      image: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: userId3,
      name: "Vanessa Morgan",
      email: "vanessa@example.com",
      emailVerified: false,
      image: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  await db.insert(user).values(users);
  console.log("✅ Users seeded");

  // ACCOUNTS

  const accounts = [
    {
      id: randomUUID(),
      accountId: userId1,
      providerId: "credential",
      userId: userId1,
      accessToken: null,
      refreshToken: null,
      idToken: null,
      accessTokenExpiresAt: null,
      refreshTokenExpiresAt: null,
      scope: null,
      password: await hashPassword("mark1234"),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: randomUUID(),
      accountId: userId2,
      providerId: "credential",
      userId: userId2,
      accessToken: null,
      refreshToken: null,
      idToken: null,
      accessTokenExpiresAt: null,
      refreshTokenExpiresAt: null,
      scope: null,
      password: await hashPassword("leo12345"),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: randomUUID(),
      accountId: userId3,
      providerId: "credential",
      userId: userId3,
      accessToken: null,
      refreshToken: null,
      idToken: null,
      accessTokenExpiresAt: null,
      refreshTokenExpiresAt: null,
      scope: null,
      password: await hashPassword("vanessa1"),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  await db.insert(account).values(accounts);
  console.log("✅ Accounts seeded");

  // WORKSPACES

  // User 1: two (2) workspaces (personal, team)
  // User 2: one (1) workspace (personal)
  const workspaceId1User1 = randomUUID();
  const workspaceId2User1 = randomUUID();
  const workspaceId3User2 = randomUUID();
  const workspaceSeeds: NewWorkspace[] = [
    {
      workspace_id: workspaceId1User1,
      name: "Mark Team Workspace",
      type: "team",
      ownerId: userId1,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      workspace_id: workspaceId2User1,
      name: "Mark Personal Workspace",
      type: "personal",
      ownerId: userId1,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      workspace_id: workspaceId3User2,
      name: "Leo Personal Workspace",
      type: "team",
      ownerId: userId2,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ];

  await db.insert(workspaces).values(workspaceSeeds);
  console.log("✅ Workspaces seeded");

  // WORKSPACE MEMBERS

  // Three (3) workspace member instances (user 1 and 2)
  const workspaceMemberId1 = randomUUID();
  const workspaceMemberId2 = randomUUID();
  const workspaceMemberId3 = randomUUID();
  const workspaceMemberSeeds: NewWorkspaceMember[] = [
    {
      id: workspaceMemberId1,
      workspaceId: workspaceId1User1,
      userId: userId1,
      role: "owner",
      joined_at: new Date(),
    },
    {
      id: workspaceMemberId2,
      workspaceId: workspaceId2User1,
      userId: userId1,
      role: "owner",
      joined_at: new Date(),
    },
    {
      id: workspaceMemberId3,
      workspaceId: workspaceId3User2,
      userId: userId1,
      role: "owner",
      joined_at: new Date(),
    },
  ];

  await db.insert(workspaceMembers).values(workspaceMemberSeeds);
  console.log("✅ Workspace members seeded");

  // PROJECTS

  // User 1: two (2) projects under personal and team
  // User 2: one (1) personal
  const projectId1UserId1 = randomUUID();
  const projectId2UserId1 = randomUUID();
  const projectId3UserId2 = randomUUID();
  const projectSeeds: NewProject[] = [
    {
      project_id: projectId1UserId1,
      workspaceId: workspaceId1User1,
      createdBy: userId1,
      title: "Extract raw data",
      description: "Generate meaningful data from survey",
      status: "pending",
      start_date: null,
      due_date: null,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      project_id: projectId2UserId1,
      workspaceId: workspaceId2User1,
      createdBy: userId1,
      title: "Brainstorm topic for my blog",
      description: null,
      status: "completed",
      start_date: null,
      due_date: null,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      project_id: projectId3UserId2,
      workspaceId: workspaceId3User2,
      createdBy: userId2,
      title: "Interview candidate",
      description: "Conduct a technical interview with four (4) candidates",
      status: "in_progress",
      start_date: null,
      due_date: null,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ];

  await db.insert(projects).values(projectSeeds);
  console.log("✅ Projects seeded");

  // TASKS

  // User 1:
  //    - two (2) tasks under team project
  //    - no task under personal project
  // User 2:
  //    - four (4) tasks under personal
  const taskId1UserId1 = randomUUID();
  const taskId2UserId1 = randomUUID();
  const taskId3UserId2 = randomUUID();
  const taskId4UserId2 = randomUUID();
  const taskId5UserId2 = randomUUID();
  const taskId6UserId2 = randomUUID();
  const taskSeeds: NewTask[] = [
    {
      task_id: taskId1UserId1,
      workspace_id: workspaceId1User1,
      projectId: projectId1UserId1,
      createdBy: userId1,
      assignedTo: null,
      title: "Get the data from the website",
      description: null,
      priority: "medium",
      status: "pending",
      due_date: null,
      completed_at: null,
      position: 0,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      task_id: taskId2UserId1,
      workspace_id: workspaceId1User1,
      projectId: projectId1UserId1,
      createdBy: userId1,
      assignedTo: null,
      title: "Use a formula to generate meaningful data",
      description: null,
      priority: "medium",
      status: "pending",
      due_date: null,
      completed_at: null,
      position: 1,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      task_id: taskId3UserId2,
      workspace_id: workspaceId3User2,
      projectId: projectId3UserId2,
      createdBy: userId2,
      assignedTo: null,
      title: "Interview candidate 1",
      description: null,
      priority: "medium",
      status: "completed",
      due_date: null,
      completed_at: new Date(),
      position: 0,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      task_id: taskId4UserId2,
      workspace_id: workspaceId3User2,
      projectId: projectId3UserId2,
      createdBy: userId2,
      assignedTo: null,
      title: "Interview candidate 2",
      description: null,
      priority: "medium",
      status: "completed",
      due_date: null,
      completed_at: new Date(),
      position: 1,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      task_id: taskId5UserId2,
      workspace_id: workspaceId3User2,
      projectId: projectId3UserId2,
      createdBy: userId2,
      assignedTo: null,
      title: "Interview candidate 3",
      description: null,
      priority: "medium",
      status: "pending",
      due_date: null,
      completed_at: null,
      position: 2,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      task_id: taskId6UserId2,
      workspace_id: workspaceId3User2,
      projectId: projectId3UserId2,
      createdBy: userId2,
      assignedTo: null,
      title: "Interview candidate 4",
      description: null,
      priority: "medium",
      status: "pending",
      due_date: null,
      completed_at: null,
      position: 3,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ];

  await db.insert(tasks).values(taskSeeds);
  console.log("✅ Tasks seeded");

  // FOCUS SESSIONS and FOCUS SESSION TASKS

  // User 1: two (2) sessions
  const focusSessionId1UserId1 = randomUUID();
  const focusSessionId2UserId1 = randomUUID();
  const focusToday = Date.now();
  const thirtyMinutesEarly = new Date(focusToday - 30 * 60 * 1000);
  const focusSessionSeeds: NewFocusSession[] = [
    {
      focus_id: focusSessionId1UserId1,
      userId: userId1,
      status: "completed",
      started_at: thirtyMinutesEarly,
      ended_at: new Date(focusToday),
      duration_seconds: 30 * 60,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      focus_id: focusSessionId2UserId1,
      userId: userId1,
      status: "paused",
      started_at: thirtyMinutesEarly,
      ended_at: null,
      duration_seconds: null,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ];

  const focusSessionTaskSeeds: NewFocusSessionTask[] = [
    {
      focus_task_id: randomUUID(),
      focusId: focusSessionId1UserId1,
      taskId: taskId1UserId1,
      position: 1,
      completed_in_session: true,
      added_at: thirtyMinutesEarly,
    },
    {
      focus_task_id: randomUUID(),
      focusId: focusSessionId2UserId1,
      taskId: taskId2UserId1,
      position: 0,
      completed_in_session: false,
      added_at: thirtyMinutesEarly,
    },
  ];

  await db.transaction(async (t) => {
    await t.insert(focus_sessions).values(focusSessionSeeds);
    await t.insert(focus_session_tasks).values(focusSessionTaskSeeds);
    console.log("✅ Focus sessions seeded");
    console.log("✅ Focus session tasks seeded");
  });
}

async function clearAllTables() {
  console.log("🧹 Clearing existing data...");

  await db.delete(focus_session_tasks);
  await db.delete(focus_sessions);
  await db.delete(tasks);
  await db.delete(projects);
  await db.delete(workspaceMembers);
  await db.delete(workspaces);
  await db.delete(verification);
  await db.delete(session);
  await db.delete(account);
  await db.delete(user);

  console.log("✅ All tables are cleared!");
}

async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10);
}

main();
