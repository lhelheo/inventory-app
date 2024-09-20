import prismaClient from "../prisma";

interface ICreateCustomerService {
    name: string;
    email: string;
}

class CreateCustomerService {
  async execute({ name, email }: ICreateCustomerService) {
    
    if (!email || !name) {
        throw new Error("Invalid data from customer");
    }

    const customer = await prismaClient.customer.create({
        data: {
            name,
            email,
            status: true
        }
    });
    return customer;
    }
}

export { CreateCustomerService };