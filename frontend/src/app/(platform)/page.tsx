"use client";
import { FormEvent, useEffect, useRef, useState } from "react";
import { api } from "../services/api";
import { ICustomer } from "@/interface/customer";
import { IProduct } from "@/interface/product";

export default function Home() {
  const [customers, setCustomers] = useState<ICustomer[]>([]);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const productNameRef = useRef<HTMLInputElement>(null);
  const productPriceRef = useRef<HTMLInputElement>(null);
  const [product, setProduct] = useState<IProduct[]>([]);

  useEffect(() => {
    loadCustomers();
  }, []);

  async function loadCustomers() {
    const response = await api.get("/client");
    setCustomers(response.data);
  }

  function handleAddProduct() {
    if (!productNameRef.current || !productPriceRef.current) return;

    const newProduct: IProduct = {
      name: productNameRef.current.value,
      price: parseFloat(productPriceRef.current.value),
    };

    setProduct((prevProduct) => [...prevProduct, newProduct]);

    productNameRef.current.value = "";
    productPriceRef.current.value = "";
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!nameRef.current || !emailRef.current) return;

    const response = await api.post("/client", {
      name: nameRef.current.value,
      email: emailRef.current.value,
      phone: phoneRef.current?.value,
      product,
    });

    setCustomers((allCustomers) => [...allCustomers, response.data]);
    setProduct([]);
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

  console.log(customers.map((customer) => customer.product?.map((product) => product.name)));

  return (
    <div className="m-4">
      <div className="w-max p-4 bg-white text-black">
        {customers.map((customer) => (
          <div key={customer.id}>
            <h1>Nome do cliente: {customer.name}</h1>
            <p>Email do cliente: {customer.email}</p>
            <p>Telefone do cliente: {customer.phone}</p>
            <div className="bg-gray-600 text-white p-3">
              {customer.product?.length !== 0 ? <h2>Produtos:</h2> : <p>Cliente não possui produtos</p>}
              {customer.product?.map((product) => (
                <div key={product.id}>
                  {product.name ? <p>Nome: {product.name}</p> : <p>Nome: Não informado</p>}
                  {product.price ? <p>Preço: ${product.price}</p> : <p>Preço: Não informado</p>}
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
        ))}
      </div>
      <div className="mt-4">
        <form onSubmit={handleSubmit} className="flex flex-col w-min gap-4">
          <input ref={nameRef} type="text" className="placeholder-black text-black" placeholder="Nome" />
          <input ref={emailRef} type="email" className="placeholder-black text-black" placeholder="Email" />
          <input ref={phoneRef} type="text" className="placeholder-black text-black" placeholder="Telefone" />

          <div>
            <input ref={productNameRef} type="text" className="placeholder-black text-black" placeholder="Nome do produto" />
            <input ref={productPriceRef} type="number" className="placeholder-black text-black" step={0.01} placeholder="Preço do produto" />
            <button type="button" onClick={handleAddProduct}>Adicionar Produto</button>
          </div>

          <button type="submit">Submit</button>
        </form>

        <div>
          <h2>Produtos adicionados:</h2>
          {product.map((product, index) => (
            <p key={index}>{product.name} - ${product.price}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
