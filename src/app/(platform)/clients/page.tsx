"use client";
import { useEffect, useState } from "react";
import { ICustomer } from "@/interface/customer";
import { api } from "@/app/services/api";
import { Eye, Trash2 } from "lucide-react";
import { baseUrl } from "@/helpers/url";
import { useRouter } from "next/navigation";

export default function Clients() {
  const router = useRouter();
  const [customers, setCustomers] = useState<ICustomer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCustomers();
  }, []);

  async function loadCustomers() {
    try {
      const response = await api.get(`${baseUrl}/clients`);
      setCustomers(response.data);
    } catch (error) {
      console.error("Failed to load customers", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    try {
      const response = await api.delete(`${baseUrl}/client/${id}`);
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

  return (
    <div className="p-10 flex flex-col h-full justify-center items-center">
      <h1 className="text-xl">Clientes</h1>
      <div className="w-max p-4 bg-white text-black">
        {loading ? (
          <p>Carregando clientes...</p>
        ) : customers.length === 0 ? (
          <p>Nenhum cliente encontrado</p>
        ) : (
          customers.map((customer) => (
            <div key={customer.id} className="flex border p-10">
              <div>
                {customer.name ? <h1>Nome: {customer.name}</h1> : <h1>Nome: Não informado</h1>}
                {customer.email ? <p>Email: {customer.email}</p> : <p>Email: Não informado</p>}
                {customer.phone ? <p>Telefone: {customer.phone}</p> : <p>Telefone: Não informado</p>}
              </div>
              <div className="flex">
                <div
                  className="flex items-center h-full font-bold px-2 text-red-500 hover:text-red-700 cursor-pointer ease-linear transition-all"
                  
                >
                  <Trash2 size={18} onClick={() => handleDelete(customer.id)}/>
                </div>
                <div
                  className="flex items-center h-full font-bold px-2 text-blue-500 hover:text-blue-700 cursor-pointer ease-linear transition-all"
                >
                  <Eye size={18} onClick={() => router.push(`/clients/${customer.id}`)}/>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
