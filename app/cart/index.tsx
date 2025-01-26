// app/cart/index.tsx
import React, { useContext } from 'react';
import { Link } from 'expo-router';
import { CartContext } from '@/AppProvider';
import {
  Box,
  Heading,
  Text,
  Button,
  FlatList,
  HStack,
  VStack
} from 'native-base';

export default function CartScreen() {
  const { cartItems, clearCart } = useContext(CartContext);

  const handleCheckout = () => {
    alert('Замовлення оформлено!');
    clearCart();
  };

  return (
    <Box flex={1} p={4} bg="white">
      <Heading mb={4}>Кошик</Heading>
      <Link href="/" >
        <Button variant="outline" colorScheme="primary" mb={4}>
          На головну
        </Button>
      </Link>

      {cartItems.length === 0 ? (
        <Text>Кошик порожній...</Text>
      ) : (
        <FlatList
          data={cartItems}
          keyExtractor={(item, index) => item.id + index}
          renderItem={({ item }) => (
            <HStack
              justifyContent="space-between"
              p={3}
              mb={2}
              borderWidth={1}
              borderColor="gray.300"
              borderRadius={6}
            >
              <Text>{item.title}</Text>
              <Text>{item.price} грн</Text>
            </HStack>
          )}
        />
      )}

      <Button onPress={handleCheckout} mt={4}>
        Оформити замовлення
      </Button>
    </Box>
  );
}
