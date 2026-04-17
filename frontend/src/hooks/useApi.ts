import { useContext } from "react";

import { Api } from "../api/api";
import { ApiContext } from "../contexts";

export function useApi(): Api {
  const api = useContext(ApiContext);
  return api;
}

