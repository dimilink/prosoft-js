import { useContext } from "react";

import { CurrentUser, UserContext } from "../contexts";

export function useCurrentUser(): CurrentUser {
  const currentUser = useContext(UserContext);
  return currentUser;
}

