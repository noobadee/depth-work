export default seedActiveTeamScenario;

import {
  user,
  account,
  workspaces,
  workspaceMembers,
  projects,
  projectMembers,
  tasks,
  focus_sessions,
  focus_session_tasks,
} from "@/db/schema/index.ts";
import {
  makeUsers,
  makeAccounts,
  makeWorkspace,
  makeWorkspaceMembers,
  makeProjects,
  makeProjectMembers,
  makeTasks,
  makeFocusSessions,
  makeFocusSessionTasks,
} from "../factories/index.ts";
import type { DB } from "@/db/index.ts";

/**
 * 1 workspace
 * 3 workspace members + 1 owner
 * 3 active projects
 * 6 active tasks
 * 2 focus session and session tasks
 * tasks
 */
async function seedActiveTeamScenario(db: DB) {
  console.log("🍃 Seeding database...");

  await db.transaction(async (tx) => {
    // Fill users table
    const [user1, user2, user3, user4] = await tx
      .insert(user)
      .values(
        makeUsers([
          { name: "Mark Mendez", email: "mark@example.com" },
          { name: "Leo Brimstone", email: "leo@example.com" },
          { name: "Vanessa Morgan", email: "vanessa@example.com" },
          { name: "Laila Mercedez", email: "laila@example.com" },
        ]),
      )
      .returning();
    console.log("✅ Users seeded");

    // Fill accounts table
    await tx.insert(account).values(
      await makeAccounts([
        { userId: user1?.id ?? "", password: "mark1234" },
        { userId: user2?.id ?? "", password: "leo12345" },
        { userId: user3?.id ?? "", password: "vanessa1" },
        { userId: user4?.id ?? "", password: "laila123" },
      ]),
    );
    console.log("✅ Accounts table seeded");

    // Fill workspaces table
    const [workspace] = await tx
      .insert(workspaces)
      .values(
        makeWorkspace({
          ownerId: user1?.id ?? "",
          name: "Bitcoin Research",
          type: "team",
        }),
      )
      .returning();
    console.log("✅ Workspaces seeded");

    // Fill workspace members
    const [owner, member1, member2, member3] = await tx
      .insert(workspaceMembers)
      .values(
        makeWorkspaceMembers([
          {
            workspaceId: workspace?.workspace_id ?? "",
            userId: user1?.id ?? "",
            role: "owner",
          },
          {
            workspaceId: workspace?.workspace_id ?? "",
            userId: user2?.id ?? "",
            role: "member",
          },
          {
            workspaceId: workspace?.workspace_id ?? "",
            userId: user3?.id ?? "",
            role: "member",
          },
          {
            workspaceId: workspace?.workspace_id ?? "",
            userId: user4?.id ?? "",
            role: "member",
          },
        ]),
      )
      .returning();
    console.log("✅ Workspace members seeded");

    // Fill projects
    const [project1, project2, project3] = await tx
      .insert(projects)
      .values(
        makeProjects([
          {
            workspaceId: workspace?.workspace_id ?? "",
            createdBy: user1?.id ?? "",
            title: "Gather relevant data",
            description: null,
            status: "in_progress",
            start_date: null,
            due_date: null,
            position: 0,
          },
          {
            workspaceId: workspace?.workspace_id ?? "",
            createdBy: user1?.id ?? "",
            title: "Define Functional and Non-functional Requirements",
            description: null,
            status: "in_progress",
            start_date: null,
            due_date: null,
            position: 1,
          },
          {
            workspaceId: workspace?.workspace_id ?? "",
            createdBy: user1?.id ?? "",
            title: "Create a low fidelity design",
            description: null,
            status: "in_progress",
            start_date: null,
            due_date: null,
            position: 2,
          },
        ]),
      )
      .returning();
    console.log("✅ Projects seeded");

    // Fill project members
    const [pMember1, pMember2, pMember3, pMember4] = await tx
      .insert(projectMembers)
      .values(
        makeProjectMembers([
          {
            projectId: project1?.project_id ?? "",
            userId: user2?.id ?? "",
          },
          {
            projectId: project2?.project_id ?? "",
            userId: user1?.id ?? "",
          },
          {
            projectId: project2?.project_id ?? "",
            userId: user3?.id ?? "",
          },
          {
            projectId: project3?.project_id ?? "",
            userId: user4?.id ?? "",
          },
        ]),
      )
      .returning();
    console.log("✅ Project members seeded");

    // Fill tasks
    const [task1, task2, task3, task4, task5] = await tx
      .insert(tasks)
      .values(
        makeTasks([
          {
            workspaceId: workspace?.workspace_id ?? "",
            projectId: project1?.project_id ?? "",
            createdBy: user2?.id ?? "",
            assignedTo: user2?.id ?? "",
            title: "Scrape data from website X",
            description: null,
            priority: "medium",
            status: "in_progress",
            position: 0,
            due_date: null,
            completed_at: null,
          },
          {
            workspaceId: workspace?.workspace_id ?? "",
            projectId: project2?.project_id ?? "",
            createdBy: user1?.id ?? "",
            assignedTo: user1?.id ?? "",
            title: "Define non-functional requirements",
            description: null,
            priority: "medium",
            status: "in_progress",
            position: 0,
            due_date: null,
            completed_at: null,
          },
          {
            workspaceId: workspace?.workspace_id ?? "",
            projectId: project2?.project_id ?? "",
            createdBy: user1?.id ?? "",
            assignedTo: user3?.id ?? "",
            title: "Define functional requirements",
            description: null,
            priority: "medium",
            status: "in_progress",
            position: 1,
            due_date: null,
            completed_at: null,
          },
          {
            workspaceId: workspace?.workspace_id ?? "",
            projectId: project3?.project_id ?? "",
            createdBy: user4?.id ?? "",
            assignedTo: user4?.id ?? "",
            title: "Browse related design",
            description: null,
            priority: "medium",
            status: "in_progress",
            position: 0,
            due_date: null,
            completed_at: null,
          },
          {
            workspaceId: workspace?.workspace_id ?? "",
            projectId: project3?.project_id ?? "",
            createdBy: user4?.id ?? "",
            assignedTo: user4?.id ?? "",
            title: "Sketch the home page",
            description: null,
            priority: "medium",
            status: "in_progress",
            position: 1,
            due_date: null,
            completed_at: null,
          },
        ]),
      )
      .returning();
    console.log("✅ Tasks seeded");

    const focusToday = Date.now();
    const oneHourEarly = new Date(focusToday - 60 * 60 * 1000);
    const thirtyMinutesEarly = new Date(focusToday - 30 * 60 * 1000);
    // Fill focus sessions
    const [fSession1, fSession2] = await tx
      .insert(focus_sessions)
      .values(
        makeFocusSessions([
          {
            userId: user2?.id ?? "",
            status: "completed",
            started_at: oneHourEarly,
            ended_at: thirtyMinutesEarly,
            duration_seconds: 30 * 60,
          },
          {
            userId: user2?.id ?? "",
            status: "active",
            started_at: new Date(focusToday),
            ended_at: null,
            duration_seconds: null,
          },
        ]),
      )
      .returning();
    console.log("✅ Focus sessions seeded");

    // Fill focus session tasks
    const [fSessionTask1, fSessionTask2] = await tx
      .insert(focus_session_tasks)
      .values(
        makeFocusSessionTasks([
          {
            focusId: fSession1?.focus_id ?? "",
            taskId: task1?.task_id ?? "",
            position: 0,
            completed_in_session: false,
            added_at: oneHourEarly,
          },
          {
            focusId: fSession1?.focus_id ?? "",
            taskId: task1?.task_id ?? "",
            position: 1,
            completed_in_session: true,
            added_at: new Date(focusToday),
          },
        ]),
      )
      .returning();
    console.log("✅ Focus session tasks seeded");

    console.log("🏆 Active Team scenario seeded.");
  });
}
