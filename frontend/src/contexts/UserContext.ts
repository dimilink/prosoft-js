import { createContext } from "react";

import { User } from "../api/api";

export type CurrentUser =
  { user: User, isAuthenticated: true } |
  { user: null, isAuthenticated: false};

export const UserContext = createContext<CurrentUser>({ user: null, isAuthenticated: false });

