// app/middleware/guest.ts
import { redirect, type MiddlewareFunction } from "react-router";
import { getAuthenticatedUser } from "~/libs/get-authenticated-user";

export const guestMiddleware: MiddlewareFunction = async ({ request }) => {
  const result = await getAuthenticatedUser(request);

  if (result) {
    throw redirect("/panel/home");
  }
};