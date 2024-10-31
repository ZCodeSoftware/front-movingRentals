import { mockCategories } from "../../mocks/Categories";
import { ICategories } from "./models/categories.interface";

export const fetchCategories = async (): Promise<ICategories[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockCategories);
      }, 1000);
    });
  };