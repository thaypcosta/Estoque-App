import { Stack } from "expo-router";
import { StockProvider } from "../hooks/useStock";
import "react-native-get-random-values";

export default function RootLayout() {
  return (
    <StockProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
    </StockProvider>
  );
}
