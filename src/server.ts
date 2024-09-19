import Fastify from "fastify";
import cors from "@fastify/cors";

const server = Fastify({ logger: true });

const start = async () => {
    try {
        await server.listen({ port: 3333 })
    } catch {
        process.exit(1)
    }
}