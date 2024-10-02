"use client";
import { useEffect, useState } from "react";
import { ICustomer } from "@/interface/customer";
import { api } from "@/app/services/api";

export default function Home() {
  const [customers, setCustomers] = useState<ICustomer[]>([]);

  useEffect(() => {
    loadCustomers();
  }, []);

  async function loadCustomers() {
    const response = await api.get("/client");
    setCustomers(response.data);
  }

  async function handleDelete(id: number) {
    try {
      const response = await api.delete(`/client/${id}`);
      if (response.status === 200) {
        alert("Client deleted successfully!");

        const allCustomers = customers.filter((customer) => customer.id !== id);
        setCustomers(allCustomers);
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (err.response && err.response.status === 404) {
        alert("Client not found");
      } else {
        console.error(err);
        alert("An error occurred while deleting the client");
      }
    }
  }

  console.log(customers.map((customer) => customer.product));

  return (
    <div className="p-10 flex h-full justify-center items-center">
      <div className="w-max p-4 bg-white text-black">
        {customers.length === 0 ? (
          <p>Nenhum cliente encontrado</p>
        ) : (
          customers.map((customer) => (
        <div key={customer.id}>
          {customer.name ? <h1>Nome do cliente: {customer.name}</h1> : <h1>Nome do cliente: Não informado</h1>}
          {customer.email ? <p>Email do cliente: {customer.email}</p> : <p>Email do cliente: Não informado</p>}
          {customer.phone ? <p>Telefone do cliente: {customer.phone}</p> : <p>Telefone do cliente: Não informado</p>}
          <div className="bg-gray-300 text-black p-3">
            {customer.product?.length !== 0 ? <h2>Produtos:</h2> : <p>Cliente não possui produtos</p>}
            {customer.product?.map((product) => (
          <div key={product.id}>
            {product.name ? <p>Nome: {product.name}</p> : <p>Nome: Não informado</p>}
            {product.price ? <p>Preço: ${product.price}</p> : <p>Preço: Não informado</p>}
            {product.product_code ? <p>Código do produto: {product.product_code}</p> : <p>Código do produto: Não informado</p>}
          </div>
            ))}
          </div>
          <button
            className="font-bold text-red-500 hover:text-red-700 cursor-pointer ease-linear transition-all"
            onClick={() => handleDelete(customer.id)}
          >
            Delete
          </button>
          <hr />
        </div>
          ))
        )}
      </div>
    </div>
  );
}
