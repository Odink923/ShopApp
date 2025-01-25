// app/cart/index.tsx
import React, { useContext } from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { CartContext } from '@/AppProvider'; // імпорт контексту

export default function CartScreen() {
  const { cartItems, clearCart } = useContext(CartContext);

  const handleCheckout = () => {
    alert('Замовлення оформлено!');
    clearCart();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Кошик</Text>
      <Link href="/" style={{ marginBottom: 12, color: 'blue' }}>
        На головну
      </Link>

      {cartItems.length === 0 ? (
        <Text>Кошик порожній...</Text>
      ) : (
        <FlatList
          data={cartItems}
          keyExtractor={(item, index) => item.id + index}
          renderItem={({ item }) => (
            <View style={styles.cartItem}>
              <Text>{item.title}</Text>
              <Text>{item.price} грн</Text>
            </View>
          )}
        />
      )}

      <Button title="Оформити замовлення" onPress={handleCheckout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, marginBottom: 16 },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    borderWidth: 1,
    marginBottom: 8,
    borderRadius: 4
  }
});
