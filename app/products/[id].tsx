// app/products/[id].tsx
import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { CartContext } from '@/AppProvider'; // імпорт контексту

interface Product {
  id: string;
  title: string;
  price: number;
}

export default function ProductDetailScreen() {
  const [product, setProduct] = useState<Product | null>(null);

  const params = useLocalSearchParams();
  const router = useRouter();

  // Дістаємо з контексту метод addToCart
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    async function fetchProduct() {
      if (!params.id || typeof params.id !== 'string') return;
      try {
        const docRef = doc(db, 'products', params.id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() } as Product);
        }
      } catch (error) {
        console.log('Error fetching product details:', error);
      }
    }
    fetchProduct();
  }, [params.id]);

  if (!product) {
    return (
      <View style={styles.container}>
        <Text>Завантаження...</Text>
      </View>
    );
  }

  const handleAddToCart = () => {
    addToCart(product);
    alert(`Товар "${product.title}" додано в кошик!`);
    router.push('/cart');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{product.title}</Text>
      <Text style={styles.price}>{product.price} грн</Text>
      <Button title="Додати в кошик" onPress={handleAddToCart} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: 'bold' },
  price: { marginVertical: 8, fontSize: 16 }
});
