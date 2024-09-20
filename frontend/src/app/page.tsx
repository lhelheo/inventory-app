"use client";
import { FormEvent, useEffect, useRef, useState } from "react";
import { api } from "./services/api";

interface ICustomer {
  id: number;
  name: string;
  email: string;
}

export default function Home() {
  const [customers, setCustomers] = useState<ICustomer[]>([]);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadCustomers();
  }, []);

  async function loadCustomers() {
    const response = await api.get("/customer");
    setCustomers(response.data);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if(!nameRef.current || !emailRef.current) return;
    
    const response = await api.post("/customer", {
      name: nameRef.current.value,
      email: emailRef.current.value,
    });

    setCustomers(allCustomers => [...allCustomers, response.data]);
  }

  async function handleDelete(id: number) {
    try{
      await api.delete("/customer", {
        params: {
          id: id,
        }
      })
      const allCustomers = customers.filter(customer => customer.id !== id);
      setCustomers(allCustomers);
    }
    catch(err){
      console.log(err);
    }
  }

  return (
    <div className="m-4">
      <div className="w-min p-4 bg-white text-black border border-red-500">
        {
          customers.map((customer) => (
            <div key={customer.id}>
              <h1>{customer.name}</h1>
              <p>{customer.email}</p>
              <button onClick={() => handleDelete(customer.id)}>Delete</button>
              <hr />
            </div>
          ))
        }
      </div>
      <div className="mt-4">
        <form onSubmit={handleSubmit} className="flex flex-col w-min gap-4">
          <input ref={nameRef} type="text" placeholder="Name" />
          <input ref={emailRef} type="email" placeholder="Email" />
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}
