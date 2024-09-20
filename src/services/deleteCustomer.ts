import prismaClient from "../prisma";

interface IDeleteCustomer{
    id: string;
}

class DeleteCustomerService {
    async execute({id}: IDeleteCustomer){
        if(!id) {
            throw new Error("Invalid data from customer");
        }
        const findCustomer = await prismaClient.customer.findFirst({
            where: {
                id
            }
        });
        if(!findCustomer){
            throw new Error("Customer not found");
        }
        await prismaClient.customer.delete({
            where: {
                id: findCustomer.id
            }
        });
        return { message: "Customer deleted successfully" };
    }
} 

export { DeleteCustomerService };