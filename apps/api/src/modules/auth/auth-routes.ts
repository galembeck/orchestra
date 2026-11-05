import { AUTH_BASE_PATH } from "@orchestra/shared/constants/auth";
import { fromNodeHeaders } from "better-auth/node";
import type { FastifyPluginCallback, FastifyRequest } from "fastify";
import type { Auth } from "./auth.js";

const AUTH_BODY_LIMIT_BYTES = 16 * 1024;
const CLIENT_IP_HEADER = "x-forwarded-for";
const SET_COOKIE_HEADER = "set-cookie";
const METHODS_WITHOUT_BODY = new Set(["GET", "HEAD"]);

export interface AuthRoutesOptions {
  auth: Auth;
  publicOrigin: string;
}

const toWebRequest = (request: FastifyRequest, publicOrigin: string) => {
  const headers = fromNodeHeaders(request.headers);
  headers.set(CLIENT_IP_HEADER, request.ip);

  const body =
    !METHODS_WITHOUT_BODY.has(request.method) &&
    typeof request.body === "string" &&
    request.body.length > 0
      ? request.body
      : undefined;

  return new Request(new URL(request.url, publicOrigin), {
    body,
    headers,
    method: request.method,
  });
};

export const authRoutes: FastifyPluginCallback<AuthRoutesOptions> = (
  app,
  { auth, publicOrigin },
  done
) => {
  app.removeAllContentTypeParsers();
  app.addContentTypeParser(
    "*",
    { parseAs: "string" },
    (_request, body, parsed) => {
      parsed(null, body);
    }
  );

  app.route({
    bodyLimit: AUTH_BODY_LIMIT_BYTES,
    handler: async (request, reply) => {
      const response = await auth.handler(toWebRequest(request, publicOrigin));

      reply.status(response.status);

      for (const [key, value] of response.headers) {
        if (key !== SET_COOKIE_HEADER) {
          reply.header(key, value);
        }
      }

      const cookies = response.headers.getSetCookie();

      if (cookies.length > 0) {
        reply.header(SET_COOKIE_HEADER, cookies);
      }

      const payload = response.body
        ? Buffer.from(await response.arrayBuffer())
        : null;

      return reply.send(payload);
    },
    method: ["GET", "POST"],
    url: `${AUTH_BASE_PATH}/*`,
  });

  done();
};
