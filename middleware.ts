import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/auth/signin",
  },
});

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api/auth (auth endpoints)
     * - api/tasks (allow external access for heartbeat integration)
     * - api/activity (allow external access)
     * - auth (auth pages)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico
     */
    "/((?!api/auth|api/tasks|api/activity|auth|_next/static|_next/image|favicon.ico).*)",
  ],
};
