// app/cart/index.tsx
import React, { useContext } from 'react';
import { CartContext } from '@/AppProvider';
import { Product } from '@/types';
import {
  Box,
  Heading,
  Text,
  Button,
  FlatList,
  HStack,
  VStack,
  Icon,
  Badge,
  useToast
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';

export default function CartScreen() {
  const { cartItems, clearCart, removeFromCart } = useContext(CartContext);
  const toast = useToast();

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    toast.show({
      title: "Замовлення оформлено!",
      variant: "solid",
      bg: "green.500",
      placement: "top"
    });
    clearCart();
  };

  const handleRemoveItem = (itemId: string) => {
    removeFromCart(itemId);
    toast.show({
      title: "Товар видалено",
      variant: "solid",
      bg: "orange.500",
      placement: "top"
    });
  };

  return (
    <Box flex={1} bg="coolGray.50">
      <Box px={4} pt={4} bg="white" shadow={2} borderBottomWidth={1} borderColor="coolGray.200">
        <Heading size="xl" color="primary.600" mb={4}>
          Кошик
        </Heading>
      </Box>

      {cartItems.length === 0 ? (
        <VStack flex={1} justifyContent="center" alignItems="center" space={4}>
          <Icon
            as={MaterialIcons}
            name="remove-shopping-cart"
            size={20}
            color="coolGray.400"
          />
          <Text fontSize="lg" color="coolGray.500">
            Ваш кошик порожній
          </Text>
          <Button
            variant="solid"
            bg="primary.600"
            _pressed={{ bg: 'primary.700' }}
            onPress={() => (window.location.href = '/')}
          >
            Перейти до покупок
          </Button>
        </VStack>
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: 16 }}
            renderItem={({ item }) => (
              <Box bg="white" borderRadius="lg" p={4} mb={3} shadow={1}>
                <HStack space={4} alignItems="center">
                  <Badge
                    colorScheme="primary"
                    rounded="full"
                    alignSelf="flex-start"
                    variant="solid"
                  >
                    {item.quantity}
                  </Badge>
                  <VStack flex={1}>
                    <Text fontSize="md" fontWeight="medium" color="coolGray.800">
                      {item.title}
                    </Text>
                    {item.category && (
                      <Text fontSize="sm" color="coolGray.500">
                        {item.category}
                      </Text>
                    )}
                  </VStack>
                  <VStack alignItems="flex-end">
                    <Text fontSize="lg" fontWeight="bold" color="primary.600">
                      {(item.price * item.quantity).toLocaleString('uk-UA')} грн
                    </Text>
                    <Button
                      variant="ghost"
                      colorScheme="red"
                      size="sm"
                      px={2}
                      onPress={() => handleRemoveItem(item.id)}
                    >
                      Видалити
                    </Button>
                  </VStack>
                </HStack>
              </Box>
            )}
          />

          <Box borderTopWidth={1} borderColor="coolGray.200" bg="white" p={4} shadow={6}>
            <HStack justifyContent="space-between" mb={4}>
              <Text fontSize="lg" fontWeight="medium">
                Сума замовлення:
              </Text>
              <Text fontSize="xl" fontWeight="bold" color="primary.600">
                {totalAmount.toLocaleString('uk-UA')} грн
              </Text>
            </HStack>

            <Button
              size="lg"
              bg="primary.600"
              _text={{ fontWeight: 'bold' }}
              _pressed={{ bg: 'primary.700' }}
              onPress={handleCheckout}
              endIcon={
                <Icon as={MaterialIcons} name="check-circle" size="sm" color="white" />
              }
            >
              Оформити замовлення
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
}