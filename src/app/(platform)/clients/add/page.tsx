"use client";
import React, { useState } from 'react';
import axios from 'axios';

interface ClientFormData {
  name: string;
  email: string;
  phone: string;
  productName?: string;
  productPrice?: number;
  productCode?: string;
}

export default function CreateClient() {
  const [formData, setFormData] = useState<ClientFormData>({
    name: '',
    email: '',
    phone: '',
    productName: '',
    productPrice: undefined,
    productCode: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "productPrice" ? Number(value) : value, // Converte para número se for productPrice
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Obtendo o token do localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      alert('Usuário não autenticado.');
      return;
    }

    // Decodificando o token para obter o userID
    let userID: number | undefined;
    try {
      const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decodifica o payload do token
      userID = decodedToken.id; // Altere conforme a estrutura do seu token
    } catch (error) {
      console.error('Erro ao decodificar o token:', error);
      alert('Erro ao processar o token de autenticação.');
      return;
    }

    if (userID === undefined) {
      alert('ID de usuário não encontrado no token.');
      return;
    }

    try {
      const response = await axios.post('https://userlist-testing.vercel.app/client', {
        ...formData,
        userID, // Inclui o userID no corpo da requisição
      });
      console.log(response.data);
      alert('Cliente criado com sucesso!');
      clearForm();  // Limpa o formulário após a criação
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      alert('Falha ao criar cliente. Verifique os dados e tente novamente.');
    }
  };

  const clearForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      productName: '',
      productPrice: undefined,
      productCode: '',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4">
      <label htmlFor="name">Nome:</label>
      <input
        type="text"
        id="name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
        className="border border-gray-300 rounded-lg p-2"
      />

      <label htmlFor="email">Email:</label>
      <input
        type="email"
        id="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        required
        className="border border-gray-300 rounded-lg p-2"
      />

      <label htmlFor="phone">Telefone:</label>
      <input
        type="tel"
        id="phone"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        required
        className="border border-gray-300 rounded-lg p-2"
      />

      <label htmlFor="productName">Nome do Produto:</label>
      <input
        type="text"
        id="productName"
        name="productName"
        value={formData.productName}
        onChange={handleChange}
        className="border border-gray-300 rounded-lg p-2"
      />

      <label htmlFor="productPrice">Preço do Produto:</label>
      <input
        type="number"
        id="productPrice"
        name="productPrice"
        value={formData.productPrice !== undefined ? formData.productPrice : ''}
        onChange={handleChange}
        className="border border-gray-300 rounded-lg p-2"
      />

      <label htmlFor="productCode">Código do Produto:</label>
      <input
        type="text"
        id="productCode"
        name="productCode"
        value={formData.productCode}
        onChange={handleChange}
        className="border border-gray-300 rounded-lg p-2"
      />

      <button type="submit" className="bg-blue-600 text-white rounded-lg py-2 mt-4 hover:bg-blue-500 transition-all">
        Criar Cliente
      </button>
    </form>
  );
}
