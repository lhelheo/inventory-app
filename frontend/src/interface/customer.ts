import { IProduct } from "./product";

export interface ICustomer {
    id: number;
    name: string;
    email: string;
    phone?: string;
    product?: IProduct[];
}