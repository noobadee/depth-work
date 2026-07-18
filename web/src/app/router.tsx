import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen.ts";
import { queryClient } from "./providers/query-client.tsx";

export const router = createRouter({
  routeTree,
  context: {
    queryClient,
    // session: undefined!, // populated by root beforeLoad; placeholder to satisfy types
  },
  defaultPreload: "intent",
});

// Register for full type-safety across the app
// declare module "@tanstack/react-router" {
//   interface Register {
//     router: typeof router;
//   }
// }
