import { fastifySession } from "@fastify/session";
import { fastifyCookie } from "@fastify/cookie";

declare module "fastify" {
    interface Session {
        login: string;
        isAuthenticated: boolean;
    }
}

