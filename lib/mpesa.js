"use client";

import { useState } from "react";
import Axios from "axios";

import Currency from "@/components/ui/currency";
import useCart from "@/hooks/use-cart";

function Mpesa() {
  const [phone, setPhone] = useState("");
  const items = useCart((state) => state.items);
  //const [amount, setAmount] = useState();
  const totalPrice = items.reduce((total, item) => {
    return total + Number(item.price)
  }, 0);

  const payHandler = (event) => {
    event.preventDefault();
    Axios.post("http://localhost:5000/token", {
      //amount,
      totalPrice,
      phone,
    })
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
       console.log(error);
      });
  };
  
  return (
    <div className="  mt-10 justify-center items-center  flex flex-col">
      <h1 className="text-2xl">
        Pay with <span className="text-green-600 font-bold">M-pesa</span>{" "}
      </h1>
      <form className="flex flex-col space-y-5">
        <input
          placeholder="Enter your phone no."
          onChange={(e) => setPhone(e.target.value)}
          className=" bg-slate-100 text-center rounded-xl"
        />
        <Currency value={totalPrice} />
        <button
          onClick={payHandler}
          className="bg-green-600 text-black px-2 py-1 rounded-2xl"
        >
          Pay Now
        </button>
      </form>
    </div>
  );
}

export default Mpesa;