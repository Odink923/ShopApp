// app/index.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router'; // дозволяє переходити між маршрутами
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';

interface Product {
  id: string;
  title: string;
  price: number;
}

export default function HomeScreen() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const items: Product[] = [];
      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as Product);
      });
      setProducts(items);
    }
    fetchProducts();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Головна</Text>
      <Link href="/auth" style={styles.link}>
        Перейти до Авторизації
      </Link>
      <Link href="/cart" style={styles.link}>
        Перейти до Кошика
      </Link>
      <Link href="/user" style={styles.link}>Мій профіль</Link>


      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onPress={() => {/* Навігувати */}}>
            {/* У Expo Router – можна Link використати */}
            <Link href={`/products/${item.id}`} style={styles.itemTitle}>
              {item.title} – {item.price} грн
            </Link>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, marginBottom: 16 },
  link: { color: 'blue', marginVertical: 4 },
  item: { marginBottom: 8, padding: 8, backgroundColor: '#fff', borderRadius: 4 },
  itemTitle: { color: '#000' },
});
