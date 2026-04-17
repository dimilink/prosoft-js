import { createContext } from "react";
import { Api } from "../api/api";

export const ApiContext = createContext<Api>(new Api());


