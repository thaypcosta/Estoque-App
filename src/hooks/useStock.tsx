import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import uuid from "react-native-uuid";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface StockProviderProps {
  children: ReactNode;
}

type ProductType = {
  id: string;
  name: string;
  amount: number;
  description?: string;
  code?: string;
};

interface StockContextData {
  stockList: ProductType[];
  addProduct: (
    name: string,
    amount: number,
    description?: string,
    code?: string
  ) => Promise<void>;
  removeProduct: (id: string) => Promise<void>;
  updateProduct: (id: string, update_product: ProductType) => Promise<void>;
}

const StockContext = createContext<StockContextData>({} as StockContextData);

export function StockProvider({ children }: StockProviderProps): JSX.Element {
  const [stockList, setStockList] = useState<ProductType[]>([]);

  const getStockCountFromLocalStorage = async () => {
    try {
      const storagedStock = await AsyncStorage.getItem(
        "@MyApp:stock-native-app"
      );
      if (storagedStock !== null) {
        setStockList(JSON.parse(storagedStock));
      }
    } catch {
      return [];
    }
  };
  useEffect(() => {
    (async () => {
      try {
        console.log("Carregando estoque do AsyncStorage...");
        await getStockCountFromLocalStorage();
        console.log("Estoque carregado com sucesso!");
      } catch (error) {
        console.error("Erro ao carregar estoque:", error);
      }
    })();
  }, []);

  const addProduct = async (
    name: string,
    amount: number,
    description?: string,
    code?: string
  ) => {
    var copyStockList = [...stockList];
    const newProduct: ProductType = {
      id: uuid.v4(),
      name: name,
      amount: amount,
      description: description ? description : undefined,
      code: code ? code : undefined,
    };
    copyStockList.push(newProduct);
    setStockList(copyStockList);
    try {
      const jsonValue = JSON.stringify(copyStockList);
      await AsyncStorage.setItem("@MyApp:stock-native-app", jsonValue);
    } catch (e) {
      console.error(e);
    }
  };
  const removeProduct = async (id: string) => {
    var copyStockList = [...stockList];
    const findProductIndex = copyStockList.findIndex(
      (product) => product.id === id
    );
    if (findProductIndex === -1) {
      console.error(`Produto com o ID ${id} não encontrado no estoque.`);
      return;
    }
    copyStockList.splice(findProductIndex, 1);
    setStockList(copyStockList);
    try {
      const jsonValue = JSON.stringify(copyStockList);
      await AsyncStorage.setItem("@MyApp:stock-native-app", jsonValue);
    } catch (e) {
      console.error(e);
    }
  };
  const updateProduct = async (id: string, update_product: ProductType) => {
    var copyStockList = [...stockList];
    const findProductIndex = copyStockList.findIndex(
      (product) => product.id === id
    );
    if (findProductIndex === -1) {
      console.error(`Produto com o ID ${id} não encontrado no estoque.`);
      return;
    }
    const { id: _discardedId, ...fieldsToUpdate } = update_product;
    const updated_product = {
      ...copyStockList[findProductIndex],
      ...fieldsToUpdate,
    };
    copyStockList[findProductIndex] = updated_product;
    setStockList(copyStockList);
    try {
      const jsonValue = JSON.stringify(copyStockList);
      await AsyncStorage.setItem("@MyApp:stock-native-app", jsonValue);
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <StockContext.Provider
      value={{
        stockList: stockList,
        addProduct: addProduct,
        removeProduct: removeProduct,
        updateProduct: updateProduct,
      }}
    >
      {children}
    </StockContext.Provider>
  );
}

export function useStock(): StockContextData {
  const context = useContext(StockContext);
  return context;
}
