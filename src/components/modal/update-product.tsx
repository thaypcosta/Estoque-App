import { useStock } from "@/src/hooks/useStock";
import { useState, useEffect } from "react";
import {
  Modal,
  View,
  TextInput,
  Button,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
} from "react-native";

type ProductType = {
  id: string;
  name: string;
  amount: number;
  description?: string;
  code?: string;
};

interface ModalUpdateProductProps {
  modalUpdateProductVisible: boolean;
  setModalUpdateProductVisible: React.Dispatch<React.SetStateAction<boolean>>;
  productToUpdate: ProductType | null;
}

export function ModalUpdateProduct({
  modalUpdateProductVisible,
  setModalUpdateProductVisible,
  productToUpdate,
}: ModalUpdateProductProps) {
  const { updateProduct } = useStock();
  const [name, setName] = useState(productToUpdate?.name || "");
  const [amount, setAmount] = useState(
    productToUpdate?.amount.toString() || ""
  );
  const [description, setDescription] = useState(
    productToUpdate?.description || ""
  );
  const [code, setCode] = useState(productToUpdate?.code || "");

  useEffect(() => {
    if (productToUpdate) {
      setName(productToUpdate.name);
      setAmount(productToUpdate.amount.toString());
      setDescription(productToUpdate.description || "");
      setCode(productToUpdate.code || "");
    }
  }, [productToUpdate]);

  const handleUpdateProduct = async () => {
    if (!name || !amount) {
      alert("Nome e quantidade são obrigatórios.");
      return;
    }

    const updatedProduct: ProductType = {
      id: productToUpdate!.id,
      name,
      amount: Number(amount),
      description,
      code,
    };

    await updateProduct(updatedProduct.id, updatedProduct);
    setModalUpdateProductVisible(false);
  };

  return (
    <Modal
      visible={modalUpdateProductVisible}
      animationType="none"
      transparent={true}
      onRequestClose={() => setModalUpdateProductVisible(false)}
    >
      <TouchableOpacity
        style={styles.overlay}
        onPress={() => setModalUpdateProductVisible(false)}
        activeOpacity={1}
      >
        <TouchableWithoutFeedback>
          <View style={styles.modalContainer}>
            <TextInput
              placeholder="Nome do Produto"
              value={name}
              onChangeText={setName}
              style={styles.input}
            />
            <TextInput
              placeholder="Quantidade"
              value={amount}
              keyboardType="numeric"
              onChangeText={setAmount}
              style={styles.input}
            />
            <TextInput
              placeholder="Descrição (opcional)"
              value={description}
              onChangeText={setDescription}
              style={styles.input}
            />
            <TextInput
              placeholder="Código (opcional)"
              value={code}
              onChangeText={setCode}
              style={styles.input}
            />
            <Button title="Atualizar Produto" onPress={handleUpdateProduct} />
          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "#FFF",
    borderRadius: 8,
    padding: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    padding: 12,
    fontSize: 14, // text-lg
    color: "#000", // text-black
    marginBottom: 16,
  },
});
