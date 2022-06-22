import fastify, { FastifyInstance } from "fastify";
import { Static, Type } from "@sinclair/typebox";

const fastifyInstance = fastify({
  logger: {
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname",
      },
    },
  },
});

const HelloSchema = Type.Object({
  name: Type.String(),
});

type HelloSchemaType = Static<typeof HelloSchema>;

async function typedHello(fastify: FastifyInstance) {
  fastifyInstance.get<{ Querystring: HelloSchemaType }>(
    "/typedHello",
    { schema: { querystring: HelloSchema } },
    async (request, reply) => {
      const { name } = request.query;
      return "hello " + name;
    }
  );
}

fastifyInstance.register(typedHello);

const start = async () => {
  try {
    await fastifyInstance.listen({ port: 3005 });
  } catch (err) {
    fastifyInstance.log.error(err);
    process.exit(1);
  }
};

start();
