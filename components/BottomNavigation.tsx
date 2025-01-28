    // components/BottomNavigation.tsx
    import { HStack, IconButton, Icon } from 'native-base';
    import { MaterialIcons } from '@expo/vector-icons';
    import { useRouter } from 'expo-router';

    export const BottomNavigation = () => {
    const router = useRouter();

    return (
        <HStack 
        bg="white" 
        safeAreaBottom 
        shadow={6} 
        justifyContent="space-around" 
        alignItems="center" 
        py={3}
        borderTopWidth={1}
        borderTopColor="blue.100"
        >
        <IconButton
        icon={<Icon as={MaterialIcons} name="home" size="lg" color="blue.600" />}
        onPress={() => router.push('/')} // Перехід на головну
        />
        <IconButton
            icon={<Icon as={MaterialIcons} name="shopping-cart" size="lg" color="blue.600" />}
            onPress={() => router.push('/cart')}
        />
        <IconButton
            icon={<Icon as={MaterialIcons} name="account-circle" size="lg" color="blue.600" />}
            onPress={() => router.push('/user')}
        />
        </HStack>
    );
    };