import fastify from "fastify";
import * as user from "./modules/user/user.controller";
import { UserObject } from "./modules/user/user.schema";
import fastifySwagger, { FastifyDynamicSwaggerOptions } from "fastify-swagger";

const server = fastify({
  logger: true,
});

server.addSchema(UserObject);

// export interface FastifyDynamicSwaggerExtendedOptions
//   extends FastifyDynamicSwaggerOptions {
//   refResolver?: Object;
// }
const fastifySwaggerExtendedOptions: FastifyDynamicSwaggerOptions = {
  routePrefix: "/documentation",
  // refResolver: {
  //   buildLocalReference (json, baseUri, fragment, i) {
  //     return json.$id || `my-fragment-${i}`
  //   },
  // },
  openapi: {
    info: {
      title: "Test swagger",
      description: "testing the fastify swagger api",
      version: "0.1.0",
    },
    servers: [
      {
        url: "http://localhost:8000",
      },
    ],
  },
  uiConfig: {
    docExpansion: "full",
    deepLinking: false,
  },
  staticCSP: true,
  exposeRoute: true,
};

server.register(fastifySwagger, fastifySwaggerExtendedOptions);

server.get("/ping", async (request, reply) => {
  request.log.info("pong");
  return "pong\n";
});
server.register(user.setupRoutes);

server.listen(8000, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
