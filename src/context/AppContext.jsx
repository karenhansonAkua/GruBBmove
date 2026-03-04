import { createContext, useReducer, useContext } from "react";

const AppContext = createContext();
const initialState = { user: null, orders: [], toast: null, toastType: "success" };

function appReducer(state, action) {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload };
    case "ADD_ORDER":
      return { ...state, orders: [action.payload, ...state.orders] };
    case "SET_TOAST":
      return { ...state, toast: action.payload.msg, toastType: action.payload.type };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  return useContext(AppContext);
}
