import Fastify from "fastify";
import cors from "@fastify/cors";
import { routes } from "./routes";

const server = Fastify({ logger: true });

server.setErrorHandler((error, request, reply) => {
    reply.code(400).send({ message: error.message });
});

const start = async () => {
    await server.register(cors);
    await server.register(routes);

    try {
        await server.listen({ port: 3333 })
    } catch {
        process.exit(1)
    }
}

start();