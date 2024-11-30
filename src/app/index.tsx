import React, { useState } from "react";
import {
  Text,
  TouchableOpacity,
  SafeAreaView,
  View,
  FlatList,
  StatusBar,
  Alert,
  StyleSheet,
} from "react-native";
import { useStock } from "../hooks/useStock";
import { ModalCreateProduct } from "../components/modal/create-product";
import { ModalUpdateProduct } from "../components/modal/update-product";
import Icon from "react-native-vector-icons/MaterialIcons";

type ProductType = {
  id: string;
  name: string;
  amount: number;
  description?: string;
  code?: string;
};

export default function Index() {
  const [modalCreateProductVisible, setModalCreateProductVisible] =
    useState(false);
  const [modalUpdateProductVisible, setModalUpdateProductVisible] =
    useState(false);
  const [productToUpdate, setProductToUpdate] = useState<ProductType | null>(
    null
  );
  const { stockList, removeProduct } = useStock();
  const handleEditProduct = (product: ProductType) => {
    setProductToUpdate(product);
    setModalUpdateProductVisible(true);
  };
  const handleRemoveProduct = (id: string) => {
    removeProduct(id);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Estoque de produtos</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalCreateProductVisible(true)}
        >
          <Text style={styles.addButtonText}>Adicionar Produto</Text>
        </TouchableOpacity>
      </View>
      <ModalCreateProduct
        modalCreateProductVisible={modalCreateProductVisible}
        setModalCreateProductVisible={setModalCreateProductVisible}
      />
      <ModalUpdateProduct
        modalUpdateProductVisible={modalUpdateProductVisible}
        setModalUpdateProductVisible={setModalUpdateProductVisible}
        productToUpdate={productToUpdate}
      />
      <FlatList
        data={stockList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.productItem}>
            <View style={styles.productDetails}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productInfo}>Quantidade: {item.amount}</Text>
              <Text style={styles.productInfo}>
                Código: {item.code || "N/A"}
              </Text>
              <Text style={styles.productInfo}>
                {item.description || "Sem descrição"}
              </Text>
            </View>
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => handleEditProduct(item)}
              >
                <Icon name="edit" size={20} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() =>
                  Alert.alert(
                    "Excluir produto",
                    `Você tem certeza que deseja excluir o produto ${item.name} da lista ?`,
                    [
                      {
                        text: "Não",
                        onPress: () => {},
                      },
                      {
                        text: "Sim",
                        onPress: () => handleRemoveProduct(item.id),
                      },
                    ],
                    { cancelable: true }
                  )
                }
              >
                <Icon name="delete" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyMessage}>Nenhum produto disponível</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 24,
    backgroundColor: "#F9FAFB",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2D3748",
  },
  addButton: {
    marginLeft: "auto",
    padding: 12,
    borderRadius: 50,
    backgroundColor: "#D946EF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "500",
  },
  productItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 8,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.5,
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#2D3748",
  },
  productInfo: {
    fontSize: 10,
    color: "#6B7280",
  },
  buttonsContainer: {
    flexDirection: "row",
    gap: 6,
  },
  editButton: {
    padding: 10,
    backgroundColor: "#3B82F6",
    borderRadius: 50,
  },
  deleteButton: {
    padding: 10,
    backgroundColor: "#EF4444",
    borderRadius: 50,
  },
  emptyMessage: {
    textAlign: "center",
    color: "#6B7280",
    marginTop: 32,
  },
});
