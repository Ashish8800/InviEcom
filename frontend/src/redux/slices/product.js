import sum from "lodash/sum";
import uniq from "lodash/uniq";
import uniqBy from "lodash/uniqBy";
import { createSlice } from "@reduxjs/toolkit";
// utils
import axios from "../../utils/axios";

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: null,
  products: [],
  product: null,
  checkout: {
    activeStep: 0,
    cart: [],
    subtotal: 0,
    total: 0,
    discount: 0,
    shipping: 0,
    billing: null,
    totalItems: 0,
  },
};

const slice = createSlice({
  name: "product",
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // GET PRODUCTS
    getProductsSuccess(state, action) {
      state.isLoading = false;
      state.products = action.payload;
    },

    // GET PRODUCT
    getProductSuccess(state, action) {
      state.isLoading = false;
      state.product = action.payload;
    },

    // CHECKOUT
    getCart(state, action) {
      const cart = action.payload;

      const totalItems = sum(cart.map((product) => product.quantity));
      const subtotal = sum(
        cart.map((product) => product.price * product.quantity)
      );
      state.checkout.cart = cart;
      state.checkout.discount = state.checkout.discount || 0;
      state.checkout.shipping = state.checkout.shipping || 0;
      state.checkout.billing = state.checkout.billing || null;
      state.checkout.subtotal = subtotal;
      state.checkout.total = subtotal - state.checkout.discount;
      state.checkout.totalItems = totalItems;
    },

    addToCart(state, action) {
      const newProduct = action.payload;
      console.log(newProduct);
      const isEmptyCart = !state.checkout.cart.length;

      if (isEmptyCart) {
        state.checkout.cart = [...state.checkout.cart, newProduct];
      } else {
        state.checkout.cart = state.checkout.cart.map((product) => {
          const isExisted = product.id === newProduct.id;

          if (isExisted) {
            return {
              ...product,
              quantity: product.quantity + 1,
            };
          }

          return product;
        });
      }
      state.checkout.cart = uniqBy([...state.checkout.cart, newProduct], "id");
      state.checkout.totalItems = sum(
        state.checkout.cart.map((product) => product.quantity)
      );
    },

    deleteCart(state, action) {
      const updateCart = state.checkout.cart.filter(
        (product) => product.id !== action.payload
      );

      state.checkout.cart = updateCart;
    },

    resetCart(state) {
      state.checkout.cart = [];
      state.checkout.billing = null;
      state.checkout.activeStep = 0;
      state.checkout.total = 0;
      state.checkout.subtotal = 0;
      state.checkout.discount = 0;
      state.checkout.shipping = 0;
      state.checkout.totalItems = 0;
    },

    backStep(state) {
      state.checkout.activeStep -= 1;
    },

    nextStep(state) {
      state.checkout.activeStep += 1;
    },

    gotoStep(state, action) {
      const step = action.payload;
      state.checkout.activeStep = step;
    },

    increaseQuantity(state, action) {
      const productId = action.payload;

      const updateCart = state.checkout.cart.map((product) => {
        if (product.id === productId) {
          return {
            ...product,
            quantity: product.quantity + 1,
          };
        }
        return product;
      });

      state.checkout.cart = updateCart;
    },

    decreaseQuantity(state, action) {
      const productId = action.payload;
      const updateCart = state.checkout.cart.map((product) => {
        if (product.id === productId) {
          return {
            ...product,
            quantity: product.quantity - 1,
          };
        }
        return product;
      });

      state.checkout.cart = updateCart;
    },

    createBilling(state, action) {
      state.checkout.billing = action.payload;
    },

    applyDiscount(state, action) {
      const discount = action.payload;
      state.checkout.discount = discount;
      state.checkout.total = state.checkout.subtotal - discount;
    },

    applyShipping(state, action) {
      const shipping = action.payload;
      state.checkout.shipping = shipping;
      state.checkout.total =
        state.checkout.subtotal - state.checkout.discount + shipping;
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
  applyShipping,
  applyDiscount,
  increaseQuantity,
  decreaseQuantity,
} = slice.actions;

// ----------------------------------------------------------------------

export function getProducts() {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get("/api/products");
      dispatch(slice.actions.getProductsSuccess(response.data.products));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getProduct(name) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());

    let product = {
      id: "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1",
      cover:
        "https://api-prod-minimal-v4.vercel.app/assets/images/products/product_1.jpg",
      images: [
        "https://api-prod-minimal-v4.vercel.app/assets/images/products/product_1.jpg",
        "https://api-prod-minimal-v4.vercel.app/assets/images/products/product_2.jpg",
        "https://api-prod-minimal-v4.vercel.app/assets/images/products/product_3.jpg",
        "https://api-prod-minimal-v4.vercel.app/assets/images/products/product_4.jpg",
        "https://api-prod-minimal-v4.vercel.app/assets/images/products/product_5.jpg",
        "https://api-prod-minimal-v4.vercel.app/assets/images/products/product_6.jpg",
        "https://api-prod-minimal-v4.vercel.app/assets/images/products/product_7.jpg",
        "https://api-prod-minimal-v4.vercel.app/assets/images/products/product_8.jpg",
      ],
      name: "Nike Air Force 1 NDESTRUKT",
      code: "38BEE270",
      sku: "WW75K5210YW/SV",
      tags: [
        "Dangal",
        "The Sting",
        "2001: A Space Odyssey",
        "Singin' in the Rain",
      ],
      price: 16.19,
      priceSale: 16.19,
      totalRating: 2.5,
      totalReview: 8535,
      ratings: [
        { name: "1 Star", starCount: 5973, reviewCount: 9067 },
        { name: "2 Star", starCount: 4638, reviewCount: 4941 },
        { name: "3 Star", starCount: 1206, reviewCount: 2035 },
        { name: "4 Star", starCount: 8222, reviewCount: 4883 },
        { name: "5 Star", starCount: 7467, reviewCount: 25 },
      ],
      reviews: [
        {
          id: "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b1",
          name: "Jayvion Simon",
          avatarUrl:
            "https://api-prod-minimal-v4.vercel.app/assets/images/avatars/avatar_1.jpg",
          comment: "Assumenda nam repudiandae rerum fugiat vel maxime.",
          rating: 2.5,
          isPurchased: true,
          helpful: 1886,
          postedAt: "2023-05-11T09:34:25.073Z",
        },
        {
          id: "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b2",
          name: "Lucian Obrien",
          avatarUrl:
            "https://api-prod-minimal-v4.vercel.app/assets/images/avatars/avatar_2.jpg",
          comment: "Quis veniam aut saepe aliquid nulla.",
          rating: 2,
          isPurchased: true,
          helpful: 509,
          postedAt: "2023-05-10T08:34:25.073Z",
        },
        {
          id: "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b3",
          name: "Deja Brady",
          avatarUrl:
            "https://api-prod-minimal-v4.vercel.app/assets/images/avatars/avatar_3.jpg",
          comment: "Reprehenderit ut voluptas sapiente ratione nostrum est.",
          rating: 4.9,
          isPurchased: true,
          helpful: 4120,
          postedAt: "2023-05-09T07:34:25.073Z",
        },
        {
          id: "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b4",
          name: "Harrison Stein",
          avatarUrl:
            "https://api-prod-minimal-v4.vercel.app/assets/images/avatars/avatar_4.jpg",
          comment: "Error ut sit vel molestias velit.",
          rating: 2,
          isPurchased: false,
          helpful: 159,
          postedAt: "2023-05-08T06:34:25.073Z",
        },
        {
          id: "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b5",
          name: "Reece Chung",
          avatarUrl:
            "https://api-prod-minimal-v4.vercel.app/assets/images/avatars/avatar_5.jpg",
          comment: "Quo quia sit nihil nemo doloremque et.",
          rating: 4,
          isPurchased: false,
          helpful: 4725,
          postedAt: "2023-05-07T05:34:25.073Z",
        },
        {
          id: "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b6",
          name: "Lainey Davidson",
          avatarUrl:
            "https://api-prod-minimal-v4.vercel.app/assets/images/avatars/avatar_6.jpg",
          comment: "Autem doloribus harum vero laborum.",
          rating: 5,
          isPurchased: true,
          helpful: 950,
          postedAt: "2023-05-06T04:34:25.073Z",
        },
        {
          id: "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b7",
          name: "Cristopher Cardenas",
          avatarUrl:
            "https://api-prod-minimal-v4.vercel.app/assets/images/avatars/avatar_7.jpg",
          comment:
            "Tempora officiis consequuntur architecto nostrum autem nam adipisci.",
          rating: 4.9,
          isPurchased: false,
          helpful: 5935,
          postedAt: "2023-05-05T03:34:25.073Z",
        },
        {
          id: "e99f09a7-dd88-49d5-b1c8-1daf80c2d7b8",
          name: "Melanie Noble",
          avatarUrl:
            "https://api-prod-minimal-v4.vercel.app/assets/images/avatars/avatar_8.jpg",
          comment: "Voluptas sunt magni adipisci praesentium saepe.",
          rating: 5,
          isPurchased: false,
          helpful: 3574,
          postedAt: "2023-05-04T02:34:25.073Z",
        },
      ],
      status: "sale",
      inventoryType: "low_stock",
      sizes: [
        "6",
        "7",
        "8",
        "8.5",
        "9",
        "9.5",
        "10",
        "10.5",
        "11",
        "11.5",
        "12",
        "13",
      ],
      available: 63,
      description:
        "\n<p><strong><small> SPECIFICATION</small></strong></p>\n<p>Leather panels. Laces. Rounded toe. Rubber sole.\n<br /><br />\n<p><strong><small> MATERIAL AND WASHING INSTRUCTIONS</small></strong></p>\n<p>Shoeupper: 54% bovine leather,46% polyurethane. Lining: 65% polyester,35% cotton. Insole: 100% polyurethane. Sole: 100% thermoplastic. Fixing sole: 100% glued.</p>\n",
      sold: 105,
      createdAt: "2023-05-11T09:34:25.073Z",
      category: "Accessories",
      gender: "Men",
      colors: ["#00AB55", "#000000"],
    };

    dispatch(slice.actions.getProductSuccess(product));
  };
}
