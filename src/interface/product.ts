export interface IProduct {
    id: number;
    name: string;
    price: string;
    status: "Disponivel" | "Vendido" | "Em Processamento";
    supplier: string;
    description?: string;
    cost_price: string;
    clientID?: number;
    product_code: string;

    createAt: string;
    updateAt: string;
}