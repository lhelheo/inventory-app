"use client";
import { useEffect, useState } from "react";
import { api } from "@/app/services/api";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { baseUrl } from "@/helpers/url";
import { useRouter } from "next/navigation";
import { IClient } from "@/interface/interfaces";

export default function Clients() {
  const router = useRouter();
  const [customers, setCustomers] = useState<IClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

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

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 flex flex-col justify-center items-center min-h-screen bg-gray-100">
      <h1 className="text-xl font-semibold text-gray-800 mb-4">Clientes</h1>
      <div className="w-full max-w-4xl p-6 bg-white shadow-md rounded-lg">
        <div className="mb-4 w-full">
          <input
        type="text"
        placeholder="Pesquise o nome"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {loading ? (
          <p className="text-gray-600">Carregando clientes...</p>
        ) : filteredCustomers.length === 0 ? (
          <p className="text-gray-600">Nenhum cliente encontrado</p>
        ) : (
          <div className="overflow-x-auto">
        <table className="table-auto w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
          <th className="px-4 py-2 text-left">Nome</th>
          <th className="px-4 py-2 text-left">Email</th>
          <th className="px-4 py-2 text-left">Telefone</th>
          <th className="px-4 py-2 text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((customer) => (
          <tr key={customer.id} className="border-t border-gray-200">
            <td className="px-4 py-2">{customer.name || 'Não informado'}</td>
            <td className="px-4 py-2">{customer.email || 'Não informado'}</td>
            <td className="px-4 py-2">{customer.phone || 'Não informado'}</td>
            <td className="px-4 py-2 flex">
              <div
            className="flex items-center font-bold text-red-500 hover:text-red-700 cursor-pointer ease-linear transition-all mr-2"
            onClick={() => handleDelete(customer.id)}
              >
            <Trash2 size={18} />
              </div>
              <div
            className="flex items-center font-bold text-blue-500 hover:text-blue-700 cursor-pointer ease-linear transition-all mr-2"
            onClick={() => router.push(`/clients/${customer.id}`)}
              >
            <Eye size={18} />
              </div>
              <div
            className="flex items-center font-bold text-yellow-500 hover:text-yellow-700 cursor-pointer ease-linear transition-all"
            onClick={() => router.push(`/clients/${customer.id}/edit`)}
              >
            <Pencil size={18} />
              </div>
            </td>
          </tr>
            ))}
          </tbody>
        </table>
          </div>
        )}
      </div>
    </div>
  );
}