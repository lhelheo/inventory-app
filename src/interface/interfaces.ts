export enum Role {
    USER = 'USER',
    ADMIN = 'ADMIN', 
}
  
export interface IUser {
    id: number;
    username: string;
    password: string;
    role: Role;
    clients: IClient[]; 
    products: IProduct[]; 
}
  
export interface IClient {
    id: number;
    name: string;
    phone?: string; 
    email?: string; 
    userID: number; 
    user: IUser; 
    products: IProduct[]; 
}
  
export interface IProduct {
    id: number;
    name: string;
    status: "Disponivel" | "Vendido" | "Em Processamento";
    supplier: string;
    description?: string; 
    product_code?: string; 
    price: number;
    cost_price: number;
    clientID: number; 
    client: IClient; 
    userID: number; 
    user: IUser; 
    updateAt: Date;
    createAt: Date;
}