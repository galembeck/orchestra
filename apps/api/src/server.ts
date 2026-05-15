import { fastifyCors } from "@fastify/cors";
import { fastify } from "fastify";
import {
	serializerCompiler,
	validatorCompiler,
	type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { routes } from "@/http/routes/index.js";
import { env } from "@/lib/env.js";
import { authPlugin } from "@/plugins/auth.js";
import { dbPlugin } from "@/plugins/db.js";
import { swaggerPlugin } from "@/plugins/swagger.js";

const app = fastify({ logger: true }).withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

await app.register(fastifyCors, {
	origin: env.NODE_ENV === "production" ? false : true,
	methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
	credentials: true,
});

await app.register(swaggerPlugin);
await app.register(dbPlugin);
await app.register(authPlugin);
await app.register(routes);

app.listen({ port: env.PORT, host: "0.0.0.0" });
