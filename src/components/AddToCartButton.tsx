"use client";

import { useCartStore, CartItem } from "@/store/cartStore";
import { useState } from "react";
import { Check } from "lucide-react";

interface AddToCartButtonProps {
  product: Omit<CartItem, "quantity">;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <button 
      onClick={handleAdd}
      disabled={added}
      className={`font-bold py-4 px-8 rounded-full text-lg w-full md:w-auto transition-colors flex items-center justify-center gap-2 ${
        added 
          ? "bg-green-500 text-white hover:bg-green-600" 
          : "bg-[#F5C400] text-black hover:bg-yellow-500"
      }`}
    >
      {added ? (
        <>
          <Check size={24} />
          ADICIONADO
        </>
      ) : (
        "ADICIONAR AO ORÇAMENTO"
      )}
    </button>
  );
}
