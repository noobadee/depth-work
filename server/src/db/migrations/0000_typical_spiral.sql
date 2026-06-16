CREATE TYPE "public"."workspace_type" AS ENUM('personal', 'team');--> statement-breakpoint
CREATE TYPE "public"."workspace_role" AS ENUM('owner', 'admin', 'member', 'viewer');--> statement-breakpoint
CREATE TYPE "public"."project_status" AS ENUM('pending', 'in_progress', 'completed', 'archived');--> statement-breakpoint
CREATE TYPE "public"."task_priority" AS ENUM('low', 'medium', 'high');--> statement-breakpoint
CREATE TYPE "public"."task_status" AS ENUM('pending', 'in_progress', 'completed');--> statement-breakpoint
CREATE TYPE "public"."focus_status" AS ENUM('active', 'paused', 'completed');--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"token" text NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refreshToken" text,
	"id_token" text,
	"access_token_expires_at" timestamp with time zone,
	"refresh_token_expires_at" timestamp with time zone,
	"scope" text,
	"password" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workspaces" (
	"workspace_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"type" "workspace_type" DEFAULT 'personal' NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "uq_workspace_name_per_owner" UNIQUE("name","user_id"),
	CONSTRAINT "chk_workspace_name_length" CHECK (length("workspaces"."name") BETWEEN 1 AND 100)
);
--> statement-breakpoint
CREATE TABLE "workspace_members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"user_id" text NOT NULL,
	"role" "workspace_role" DEFAULT 'member' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "uq_workspace_member" UNIQUE("workspace_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"project_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"user_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"status" "project_status" DEFAULT 'pending' NOT NULL,
	"start_date" date,
	"due_date" date,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "chk_project_title_length" CHECK (length("projects"."title") BETWEEN 1 AND 255),
	CONSTRAINT "chk_project_dates" CHECK ("projects"."start_date" IS NULL OR "projects"."due_date" IS NULL OR "projects"."due_date" >= "projects"."start_date")
);
--> statement-breakpoint
CREATE TABLE "tasks" (
	"task_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" uuid NOT NULL,
	"project_id" uuid,
	"created_by" text,
	"assigned_to" text,
	"title" text NOT NULL,
	"description" text,
	"priority" "task_priority" DEFAULT 'medium' NOT NULL,
	"status" "task_status" DEFAULT 'pending' NOT NULL,
	"due_date" date,
	"completed_at" timestamp with time zone,
	"position" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "chk_task_title_length" CHECK (length("tasks"."title") BETWEEN 1 AND 255),
	CONSTRAINT "chk_task_completed_at" CHECK (("tasks"."status" = 'completed' AND "tasks"."completed_at" IS NOT NULL)
      OR ("tasks"."status" != 'completed' AND "tasks"."completed_at" IS NULL))
);
--> statement-breakpoint
CREATE TABLE "focus_sessions" (
	"focus_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"title" text DEFAULT to_char(now(), 'Mon DD, YYYY HH12:MI AM') NOT NULL,
	"status" "focus_status" DEFAULT 'active' NOT NULL,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"ended_at" timestamp with time zone,
	"duration_seconds" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "chk_session_ended_at" CHECK ("focus_sessions"."ended_at" IS NULL OR "focus_sessions"."ended_at" >= "focus_sessions"."started_at"),
	CONSTRAINT "chk_session_duration" CHECK (("focus_sessions"."ended_at" IS NULL AND "focus_sessions"."duration_seconds" IS NULL)
      OR ("focus_sessions"."ended_at" IS NOT NULL AND "focus_sessions"."duration_seconds" IS NOT NULL AND "focus_sessions"."duration_seconds" >= 0)),
	CONSTRAINT "chk_session_status_consistency" CHECK (("focus_sessions"."status" = 'completed' AND "focus_sessions"."ended_at" IS NOT NULL AND "focus_sessions"."duration_seconds" IS NOT NULL)
      OR ("focus_sessions"."status" != 'completed' AND "focus_sessions"."ended_at" IS NULL AND "focus_sessions"."duration_seconds" IS NULL)
      OR ("focus_sessions"."status" = 'paused' AND "focus_sessions"."ended_at" IS NULL))
);
--> statement-breakpoint
CREATE TABLE "focus_session_tasks" (
	"focus_task_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"focus_id" uuid NOT NULL,
	"task_id" uuid NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"completed_session" boolean DEFAULT false NOT NULL,
	"added_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspaces" ADD CONSTRAINT "workspaces_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspace_members" ADD CONSTRAINT "workspace_members_workspace_id_workspaces_workspace_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("workspace_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspace_members" ADD CONSTRAINT "workspace_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_workspace_id_workspaces_workspace_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("workspace_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_workspace_id_workspaces_workspace_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspaces"("workspace_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_project_id_projects_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("project_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_assigned_to_users_id_fk" FOREIGN KEY ("assigned_to") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "focus_sessions" ADD CONSTRAINT "focus_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "focus_session_tasks" ADD CONSTRAINT "focus_session_tasks_focus_id_focus_sessions_focus_id_fk" FOREIGN KEY ("focus_id") REFERENCES "public"."focus_sessions"("focus_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "focus_session_tasks" ADD CONSTRAINT "focus_session_tasks_task_id_tasks_task_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."tasks"("task_id") ON DELETE cascade ON UPDATE no action;