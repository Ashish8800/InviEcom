import sum from "lodash/sum";
import uniqBy from "lodash/uniqBy";
import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from "../store";
// utils

// ----------------------------------------------------------------------

const initialState = {
  totalItems: 0,
  activeStep: 0,
  shippingAddress: null,
  billingAddress: null,
  total: 0,
  subtotal: 0,
  discount: 0,
  tax: 0,
  shipping: 0,
  products: [],
  paymentMode: "",
};

const slice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // CHECKOUT
    getCart(state, action) {
      const cart = action.payload;

      const totalItems = sum(cart.map((product) => product.quantity));
      const subtotal = sum(
        cart.map((product) => product.price * product.quantity)
      );
      state.products = cart;
      state.discount = state.discount || 0;
      state.shipping = state.shipping || 0;
      state.billing = state.billing || null;
      state.subtotal = subtotal;
      state.total = subtotal - state.discount;
      state.totalItems = totalItems;
    },

    addToCart(state, action) {
      const newProduct = action.payload;
      const isEmptyCart = !state.products.length;

      if (isEmptyCart) {
        state.products = [...state.products, newProduct];
      } else {
        state.products = state.products.map((product) => {
          const isExisted = product.id === newProduct.id;

          if (isExisted) {
            return {
              ...product,
              quantity: product.quantity + newProduct.quantity,
            };
          }

          return product;
        });
      }
      state.products = uniqBy([...state.products, newProduct], "id");
      state.totalItems = sum(state.products.map((product) => product.quantity));
      state.subtotal = sum(
        state.products.map((product) => product.quantity * product.price)
      );
      state.total = state.subtotal - state.discount + state.tax;
    },

    deleteCart(state, action) {
      const updateCart = state.products.filter(
        (product) => product.id !== action.payload
      );

      state.products = updateCart;
      state.totalItems = sum(state.products.map((product) => product.quantity));
      state.subtotal = sum(
        state.products.map((product) => product.quantity * product.price)
      );
      state.total = state.subtotal - state.discount + state.tax;
    },

    resetCart(state) {
      state.totalItems = 0;
      state.activeStep = 0;
      state.shippingAddress = null;
      state.billingAddress = null;
      state.total = 0;
      state.subtotal = 0;
      state.discount = 0;
      state.tax = 0;
      state.shipping = 0;
      state.products = [];
      state.paymentMode = "";
    },

    backStep(state) {
      state.activeStep -= 1;
    },

    nextStep(state) {
      state.activeStep += 1;
    },

    gotoStep(state, action) {
      const step = action.payload;
      state.activeStep = step;
    },

    increaseQuantity(state, action) {
      const productId = action.payload;

      const updateCart = state.products.map((product) => {
        if (product.id === productId) {
          return {
            ...product,
            quantity: product.quantity + 1,
          };
        }
        return product;
      });

      state.products = updateCart;
      state.totalItems = sum(state.products.map((product) => product.quantity));
      state.subtotal = sum(
        state.products.map((product) => product.quantity * product.price)
      );
      state.total = state.subtotal - state.discount + state.tax;
    },

    decreaseQuantity(state, action) {
      const productId = action.payload;
      const updateCart = state.products.map((product) => {
        if (product.id === productId) {
          return {
            ...product,
            quantity: product.quantity - 1,
          };
        }
        return product;
      });

      state.products = updateCart;
      state.totalItems = sum(state.products.map((product) => product.quantity));
      state.subtotal = sum(
        state.products.map((product) => product.quantity * product.price)
      );
      state.total = state.subtotal - state.discount + state.tax;
    },

    createBilling(state, action) {
      state.billingAddress = action.payload;
    },

    createShipping(state, action) {
      state.shippingAddress = action.payload;
    },

    applyDiscount(state, action) {
      const discount = action.payload;
      state.discount = discount;
      state.total = state.subtotal - discount;
    },

    applyShipping(state, action) {
      const shipping = action.payload;
      state.shipping = shipping;
      state.total = state.subtotal - state.discount + shipping;
    },
    paymentMode(state, action) {
      state.paymentMode = action.payload;
    },

    getCart(state, action) {
      return state;
    },
  },
});

// Reducer
export default slice.reducer;

// Actions
export const {
  getCart,
  addToCart,
  resetCart,
  gotoStep,
  backStep,
  nextStep,
  deleteCart,
  createBilling,
  createShipping,
  applyShipping,
  applyDiscount,
  increaseQuantity,
  decreaseQuantity,
  paymentMode,
} = slice.actions;
