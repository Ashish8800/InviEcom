import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

// slices
import mailReducer from "./slices/mail";
import chatReducer from "./slices/chat";
import productReducer from "./slices/product";
import calendarReducer from "./slices/calendar";
import kanbanReducer from "./slices/kanban";
import cartReducer from "./slices/cart";

// ----------------------------------------------------------------------

export const rootPersistConfig = {
  key: "root",
  storage,
  keyPrefix: "redux-",
  whitelist: [],
};

export const productPersistConfig = {
  key: "product",
  storage,
  keyPrefix: "redux-",
  whitelist: ["sortBy", "checkout"],
};

export const cartPersistConfig = {
  key: "cart",
  storage,
};

const rootReducer = combineReducers({
  mail: mailReducer,
  chat: chatReducer,
  calendar: calendarReducer,
  kanban: kanbanReducer,
  cart: persistReducer(cartPersistConfig, cartReducer),
  product: persistReducer(productPersistConfig, productReducer),
});

export default rootReducer;
