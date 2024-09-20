import { FastifyReply, FastifyRequest } from "fastify";
import { ListCustomersService } from "../services/listCustomers";

class ListCustomersController {
    async handle(request: FastifyRequest, reply: FastifyReply) {
        const listCostumerService = new ListCustomersService();
        const customers = await listCostumerService.execute();
        reply.send(customers);
    }
}

export { ListCustomersController };