import { createContext, useContext, useState } from "react";

const BagContext = createContext();

export const BagProvider = ({ children }) => {
  const [bagItems, setBagItems] = useState([]);

  const addToBag = (product) => {
    setBagItems((prev) => {
      const existing = prev.find((item) => item._id === product._id);

      if (existing) {
        return prev.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const decreaseQty = (id) => {
    setBagItems((prev) =>
      prev
        .map((item) =>
          item._id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromBag = (id) => {
    setBagItems((prev) => prev.filter((item) => item._id !== id));
  };

  return (
    <BagContext.Provider
      value={{ bagItems, addToBag, decreaseQty, removeFromBag }}
    >
      {children}
    </BagContext.Provider>
  );
};

export const useBag = () => useContext(BagContext);
