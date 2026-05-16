import fp from "fastify-plugin";
import { db } from "@/db/index.js";

export const dbPlugin = fp((app) => {
	app.decorate("db", db);
});
