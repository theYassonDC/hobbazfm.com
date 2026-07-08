import { createContext } from "react-router";

export const userContext = createContext<User | null>(null)
export const tokenContext = createContext<string | null>(null)