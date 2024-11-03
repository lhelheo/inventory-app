/* eslint-disable no-use-before-define */
export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export interface IClient {
  id: number
  name: string
  phone?: string
  email?: string
  userID: number
  user: IUser
  product: IProduct[]
  updateAt: Date
  createAt: Date
}

export interface IProduct {
  id: number
  name: string
  status: 'Disponivel' | 'Vendido' | 'Em Processamento'
  supplier: string
  description?: string
  product_code?: string
  price: number
  cost_price: number
  clientID: number
  client: IClient
  userID: number
  user: IUser
  updateAt: Date
  createAt: Date
}

export interface IUser {
  id: number
  username: string
  password: string
  role: Role
  clients: IClient[]
  products: IProduct[]
  updateAt: Date
  createAt: Date
}
