import { createContext } from "react";

export const CategoryContext = createContext({
  categories: [],
  status: "loading",
  source: null,
  isOffline: false,
  retry: () => {},
});
