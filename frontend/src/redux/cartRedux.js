import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    products: [],
    quantity: 0,
    total: 0,
  },
  reducers: {
    addProduct: (state, action) => {
      const existing = state.products.find(
        (item) =>
          item._id === action.payload._id &&
          item.color === action.payload.color &&
          item.size === action.payload.size
      );

      if (existing) {
        existing.quantity += action.payload.quantity;
      } else {
        state.products.push(action.payload);
        state.quantity += 1;
      }

      state.total = state.products.reduce(
        (sum, p) => sum + p.price * p.quantity,
        0
      );
    },

    // 🔹 Egy termék törlése
    removeProduct: (state, action) => {
      const productId = action.payload;
      const productToRemove = state.products.find((p) => p._id === productId);
      if (productToRemove) {
        state.products = state.products.filter((p) => p._id !== productId);
        state.quantity -= 1;
        state.total -= productToRemove.price * productToRemove.quantity;
      }
    },

    // 🔹 Mennyiség növelése / csökkentése
    updateQuantity: (state, action) => {
      const { id, type } = action.payload;
      const product = state.products.find((p) => p._id === id);
      if (product) {
        if (type === "inc") product.quantity += 1;
        else if (type === "dec" && product.quantity > 1)
          product.quantity -= 1;
      }

      state.total = state.products.reduce(
        (sum, p) => sum + p.price * p.quantity,
        0
      );
    },

    clearCart: (state) => {
      state.quantity = 0;
      state.products = [];
      state.total = 0;
    },
  },
});

export const { addProduct, removeProduct, updateQuantity, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
