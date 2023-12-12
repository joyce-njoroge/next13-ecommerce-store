// Summary.jsx
import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import Button from "@/components/ui/button";
import Currency from "@/components/ui/currency";
import useCart from "@/hooks/use-cart";
import { toast } from "react-hot-toast";

import Mpesa from "@/lib/mpesa";

const Summary = () => {
  const searchParams = useSearchParams();
  const items = useCart((state) => state.items);
  const removeAll = useCart((state) => state.removeAll);

  const [mpesaPaymentConfirmed, setMpesaPaymentConfirmed] = useState(false);

  useEffect(() => {
    if (searchParams.get('success')) {
      toast.success('Payment completed.');
      setMpesaPaymentConfirmed(true);
      removeAll();
    }

    if (searchParams.get('canceled')) {
      toast.error('Something went wrong.');
    }
  }, [searchParams, removeAll]);

  const totalPrice = items.reduce((total, item) => total + Number(item.price), 0);

  const onCheckout = async () => {
    try {
      if (!mpesaPaymentConfirmed) {
        // Display a message or handle the case where MPesa payment is not confirmed
        toast.error('Please complete MPesa payment first.');
        return;
      }

      // Proceed with the checkout
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/checkout`, {
        productIds: items.map((item) => item.id)
      });

      // Redirect to success page or handle the response accordingly
      window.location = response.data.url;
    } catch (error) {
      // Handle errors
      console.error('Error during checkout:', error);
      toast.error('Something went wrong');
    }
  };

  return (
    <div className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
      <h2 className="text-lg font-medium text-gray-900">Order summary</h2>
      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <div className="text-base font-medium text-gray-900">Order total</div>
          <Currency value={totalPrice} />
        </div>
        <Mpesa />
      </div>
      <Button onClick={onCheckout} disabled={items.length === 0} className="w-full mt-6">
        Checkout
      </Button>
    </div>
  );
};

export default Summary;
