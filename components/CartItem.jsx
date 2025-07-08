import { AntDesign } from '@expo/vector-icons';
import {
    Animated,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import useCartStore from '../stores/cartStore';

const CartItem = ({ item, onSwipe }) => {
  const updateQuantity = useCartStore(state => state.updateQuantity);
  const removeFromCart = useCartStore(state => state.removeFromCart);
  
  return (
    <Animated.View style={[styles.cartItemContainer, onSwipe && { transform: [{ translateX: onSwipe }] }]}>
      <View style={styles.cartItem}>
        <Image
          source={{ uri: item.image || 'https://via.placeholder.com/100' }} 
          style={styles.productImage}
          defaultSource={require('../assets/placeholder.png')}
        />
        
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productPrice}>฿{item.price.toLocaleString()}</Text>
        </View>
        
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            onPress={() => updateQuantity(item.id, item.quantity - 1)}
            style={styles.quantityButton}
          >
            <AntDesign name="minuscircle" size={24} color="#0891b2" />
          </TouchableOpacity>
          
          <Text style={styles.quantity}>{item.quantity}</Text>
          
          <TouchableOpacity
            onPress={() => updateQuantity(item.id, item.quantity + 1)}
            style={styles.quantityButton}
          >
            <AntDesign name="pluscircle" size={24} color="#0891b2" />
          </TouchableOpacity>
        </View>
      </View>
      
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => removeFromCart(item.id)}
      >
        <AntDesign name="delete" size={20} color="white" />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cartItemContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  cartItem: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 15,
    alignItems: 'center',
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 10,
    backgroundColor: '#f1f5f9',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1e293b',
  },
  productPrice: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 5,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 5,
  },
  quantityButton: {
    padding: 5,
  },
  quantity: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 8,
    minWidth: 20,
    textAlign: 'center',
  },
  deleteButton: {
    width: 70,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ef4444',
  },
});

export default CartItem;