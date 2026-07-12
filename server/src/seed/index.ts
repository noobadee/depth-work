import { env } from "@/config/env.ts";
import { db } from "@/db/index.ts";
import resetDB from "./utils/reset.ts";
import seedActiveTeamScenario from "./scenarios/scenario.active-team.ts";

if (env.NODE_ENV === "production") {
  console.error("❌ Seed script is not allowed to run in production");
  process.exit(1);
}

// const SCENARIOS = {
//   soloUser: "Solo",
//   activeTeam: seedActiveTeamScenario,
//   overdueTasks: "Due",
//   emptyOrg: "Empty",
// };

async function main() {
  const args = process.argv.slice(2);

  try {
    if (args.includes("--reset")) {
      await resetDB(db);
      return;
    }

    const only = args.join("");
    const scenario = seedActiveTeamScenario;
    if (scenario) {
      await scenario(db);
    }
  } catch (err) {
    console.error("Seed failed:", err);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

main();
