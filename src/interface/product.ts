import Client from "@/app/(platform)/clients/[id]/page";
import { User } from "lucide-react";

export interface IProduct {
    id: number;
    name: string;
    price: string;
    status: string;
    supplier: string;
    description?: string;
    cost_price: string;
    clientID?: number;
    product_code: string;

    createAt: string;
    updateAt: string;
}