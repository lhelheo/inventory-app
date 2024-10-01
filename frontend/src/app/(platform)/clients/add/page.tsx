"use client"

import { api } from "@/app/services/api";
import { ICustomer } from "@/interface/customer";
import { IProduct } from "@/interface/product";
import { FormEvent, useRef, useState } from "react";

export const AddClientForm = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [customers, setCustomers] = useState<ICustomer[]>([]);
    const nameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const phoneRef = useRef<HTMLInputElement>(null);
    const productNameRef = useRef<HTMLInputElement>(null);
    const productPriceRef = useRef<HTMLInputElement>(null);
    const [product, setProduct] = useState<IProduct[]>([]);
    
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
    return (
        <div className="mt-4">
        <form onSubmit={handleSubmit} className="flex flex-col w-min gap-4">
          <input ref={nameRef} type="text" className="placeholder-black text-black" placeholder="Nome" />
          <input ref={emailRef} type="email" className="placeholder-black text-black" placeholder="Email" />
          <input ref={phoneRef} type="text" className="placeholder-black text-black" placeholder="Telefone" />

          <div className="flex flex-col gap-4">
            <input ref={productNameRef} type="text" className="placeholder-black text-black" placeholder="Nome do produto" />
            <input ref={productPriceRef} type="number" className="placeholder-black text-black" step={0.01} placeholder="Preço do produto" />
            <button type="submit" onClick={handleAddProduct}>Adicionar Produto</button>
          </div>
        </form>
      </div>
    )
}

export default AddClientForm;