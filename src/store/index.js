import { createStore, applyMiddleware, compose } from "redux";
import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer } from "redux-persist";
import reducers from "./reducers";
import { thunk } from "redux-thunk";

// redux dev tool
const composeEnhancers =
  typeof window === "object" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
    : compose;

const enhancer = composeEnhancers(applyMiddleware(thunk));

const persistConfig = {
  key: "root",
  storage,
  textWhitelist: ["auth"],
};

const persistedReducer = persistReducer(persistConfig, reducers);

const store = createStore(persistedReducer, enhancer);

export const persistor = persistStore(store);
export const dispatchAction = store?.dispatch;

export default store;
