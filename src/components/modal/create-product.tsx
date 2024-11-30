import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  Modal,
  Alert,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
} from "react-native";
import { useStock } from "../../hooks/useStock";

export function ModalCreateProduct({
  modalCreateProductVisible,
  setModalCreateProductVisible,
}: {
  modalCreateProductVisible: boolean;
  setModalCreateProductVisible: (visible: boolean) => void;
}) {
  const { addProduct } = useStock();
  const [name, setName] = useState("");
  const [amount, setAmount] = useState<string>("");
  const [description, setDescription] = useState("");
  const [code, setCode] = useState("");

  const handleAmountChange = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    if (numericValue === "" || Number(numericValue) > 0) {
      setAmount(numericValue);
    }
  };

  const handleAddProduct = async () => {
    if (!name || !amount || Number(amount) <= 0) {
      Alert.alert(
        "Erro",
        "Nome e quantidade devem ser preenchidos. A quantidade precisa ser maior que 0."
      );
      return;
    }
    try {
      await addProduct(name, Number(amount), description, code);
      setName("");
      setAmount("");
      setDescription("");
      setCode("");
      setModalCreateProductVisible(false);
    } catch (error) {
      console.error("Erro ao adicionar produto:", error);
      Alert.alert("Erro", "Houve um problema ao adicionar o produto.");
    }
  };

  return (
    <Modal
      visible={modalCreateProductVisible}
      animationType="none"
      transparent={true}
      onRequestClose={() => setModalCreateProductVisible(false)}
    >
      <TouchableOpacity
        style={styles.overlay}
        onPress={() => setModalCreateProductVisible(false)}
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
              onChangeText={handleAmountChange}
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
            <Button title="Adicionar Produto" onPress={handleAddProduct} />
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
