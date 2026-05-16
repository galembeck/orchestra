import type { FastifyReply, FastifyRequest } from "fastify";

export async function authenticate(
	req: FastifyRequest,
	reply: FastifyReply,
): Promise<void> {
	try {
		await req.jwtVerify();
	} catch {
		reply.status(401).send({ message: "Unauthorized" });
	}
}
