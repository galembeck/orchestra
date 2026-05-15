import swagger from "@fastify/swagger";
import scalar from "@scalar/fastify-api-reference";
import fp from "fastify-plugin";
import { jsonSchemaTransform } from "fastify-type-provider-zod";

export const swaggerPlugin = fp(async (app) => {
	await app.register(swagger, {
		transform: jsonSchemaTransform,
		openapi: {
			info: {
				title: "Orchestra API",
				description: "Orchestra platform REST API",
				version: "1.0.0",
			},
			servers: [
				{
					url: "http://localhost:5005",
					description: "Local development",
				},
			],
			components: {
				securitySchemes: {
					cookieAuth: {
						type: "apiKey",
						in: "cookie",
						name: "access_token",
					},
				},
			},
		},
	});

	app.get("/openapi/json", { schema: { hide: true } }, () => app.swagger());

	await app.register(scalar, {
		routePrefix: "/docs",
		configuration: { spec: { url: "/openapi/json" } },
	});
});
