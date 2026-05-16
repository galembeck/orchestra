import type { Database } from "@/db/index.js";
import type { JwtPayload } from "@/types/jwt.js";

declare module "fastify" {
	interface FastifyInstance {
		db: Database;
	}
}

declare module "@fastify/jwt" {
	interface FastifyJWT {
		payload: JwtPayload;
		user: JwtPayload;
	}
}
