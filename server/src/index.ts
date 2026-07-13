import { env } from "@/config/env.ts";
import createApp from "./app.ts";

const app = createApp();

// ──── START ────────────────────────────────────────────────────────────────────────────

app.listen(env.PORT, () =>
  console.log(`Server running on http://localhost:${env.PORT}`),
);
