import type { MiddlewareFunction } from "react-router";
import { redirect } from "react-router";
import { userContext, tokenContext } from "~/context";
import { getAuthenticatedUser } from "~/libs/get-authenticated-user";

export const authMiddleware: MiddlewareFunction = async ({ request, context }) => {
  const result = await getAuthenticatedUser(request);

  if (!result) {
    throw redirect("/panel/login");
  }

  context.set(userContext, result.user);
  context.set(tokenContext, result.token);
};