// app/libs/get-authenticated-user.ts
import { getSession } from "~/sessions.server";
import { authMe } from "./auth.service";

export async function getAuthenticatedUser(
  request: Request,
): Promise<{ user: User; token: string } | null> {
  const session = await getSession(request.headers.get("Cookie"));
  const token = session.get("token");

  if (!token) return null;

  const res = await authMe(token)

  if (!res.ok) return null;

  const user: User = await res.json();
  return { user, token };
}