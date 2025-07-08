import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import useCartStore from '../../stores/cartStore';
import useUserStore from '../../stores/userStore';
import MerchantHeader from '../../components/MerchantHeader';

export default function HomeScreen() {
  const router = useRouter();
  
  // ดึงข้อมูลผู้ใช้และร้านค้า
  const selectedMerchant = useUserStore(state => state.getSelectedMerchant());
  
  // ดึงข้อมูลตะกร้า
  const { 
    cartCount, 
    getOldestCarts, 
    switchCart, 
    createCart
  } = useCartStore(state => ({
    cartCount: state.getCartCount(),
    getOldestCarts: state.getOldestCarts,
    switchCart: state.switchCart,
    createCart: state.createCart
  }));
  
  // ถ้าไม่มีร้านค้าที่เลือก ให้กลับไปหน้าเลือกร้านค้า
  useEffect(() => {
    if (!selectedMerchant) {
      router.replace('/(auth)/select-merchant');
    }
  }, [selectedMerchant]);
  
  // ดึงตะกร้าที่เก่าที่สุด 3 ใบแรก
  const oldestCarts = getOldestCarts(3);
  
  const handleCreateCart = () => {
    if (!selectedMerchant) {
      Alert.alert('ข้อผิดพลาด', 'กรุณาเลือกร้านค้าก่อน');
      return;
    }
    
    createCart(selectedMerchant.id, 'ตะกร้าใหม่');
    router.push('/(app)/scan');
  };

  // แสดงสถานะเวลาของตะกร้า
  const getCartStatusLabel = (createdAt) => {
    const now = new Date();
    const cartTime = new Date(createdAt);
    const diffMinutes = Math.floor((now - cartTime) / (1000 * 60));
    
    if (diffMinutes < 5) return 'เมื่อสักครู่';
    if (diffMinutes < 60) return ${diffMinutes} นาทีที่แล้ว;
    if (diffMinutes < 1440) return ${Math.floor(diffMinutes/60)} ชั่วโมงที่แล้ว;
    return ${Math.floor(diffMinutes/1440)} วันที่แล้ว;
  };
  
  // แสดงไอคอนตามประเภทตะกร้า
  const getCartTypeIcon = (type) => {
    switch (type) {
      case 'inStore': return <FontAwesome5 name="store" size={16} color="#0891b2" />;
      case 'takeAway': return <MaterialIcons name="delivery-dining" size={18} color="#10b981" />;
      case 'reserved': return <MaterialIcons name="event" size={18} color="#8b5cf6" />;
      default: return <FontAwesome5 name="shopping-basket" size={16} color="#64748b" />;
    }
  };
  
  // ถ้าไม่มีร้านค้าที่เลือก แสดงหน้าโหลด
  if (!selectedMerchant) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text>กำลังโหลด...</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <MerchantHeader />
      
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.merchantInfoCard}>
          <Image 
            source={{ uri: selectedMerchant.logo }}
            style={styles.merchantImage}
          />
          <Text style={styles.merchantName}>{selectedMerchant.name}</Text>
          <Text style={styles.merchantDescription}>{selectedMerchant.description}</Text>
        </View>
        
        <View style={styles.statsContainer}>
          <TouchableOpacity 
            style={styles.statsCard}
            onPress={() => router.push('/(app)/cart')}
          >
            <View style={styles.statsIconContainer}>
              <FontAwesome5 name="shopping-basket" size={24} color="#0891b2" />
            </View>
            <Text style={styles.statsValue}>{cartCount}</Text>
            <Text style={styles.statsLabel}>ตะกร้าที่ยังไม่ได้ชำระ</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleCreateCart}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#0891b2' }]}>
              <MaterialIcons name="add-shopping-cart" size={24} color="white" />
            </View>
            <Text style={styles.actionText}>สร้างตะกร้าใหม่</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
onPress={() => router.push('/(app)/scan')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#10b981' }]}>
              <FontAwesome5 name="barcode" size={24} color="white" />
            </View>
            <Text style={styles.actionText}>สแกนสินค้า</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={styles.sectionTitle}>ตะกร้าที่ยังไม่ได้ชำระ</Text>
        
        {oldestCarts.length > 0 ? (
          <View style={styles.cartsContainer}>
            {oldestCarts.map(cart => (
              <TouchableOpacity 
                key={cart.id} 
                style={styles.cartCard}
                onPress={() => {
                  switchCart(cart.id);
                  router.push('/(app)/cart');
                }}
              >
                <View style={styles.cartHeader}>
                  {getCartTypeIcon(cart.type)}
                  <Text style={styles.cartName}>{cart.name}</Text>
                  <Text style={styles.cartTime}>{getCartStatusLabel(cart.createdAt)}</Text>
                </View>
                
                <Text style={styles.itemCount}>{cart.items.length} รายการ</Text>
                <Text style={styles.cartTotal}>฿{cart.total.toLocaleString()}</Text>
                
                {cart.note ? (
                  <View style={styles.noteTag}>
                    <MaterialIcons name="note" size={12} color="#f59e0b" />
                    <Text style={styles.noteText} numberOfLines={1}>{cart.note}</Text>
                  </View>
                ) : null}
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>ยังไม่มีตะกร้าที่รอชำระเงิน</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    flex: 1,
  },
  merchantInfoCard: {
    backgroundColor: 'white',
    padding: 20,
    margin: 15,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
merchantImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  merchantName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  merchantDescription: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 15,
    justifyContent: 'center',
  },
  statsCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statsIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e0f2fe',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  statsValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0891b2',
  },
  statsLabel: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 5,
  },
  actionsContainer: {
    flexDirection: 'row',
    padding: 15,
    justifyContent: 'space-around',
  },
  actionButton: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '45%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1e293b',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    padding: 15,
    paddingBottom: 5,
  },
  cartsContainer: {
    padding: 15,
  },
  cartCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  cartName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginLeft: 10,
    flex: 1,
  },
  cartTime: {
    fontSize: 12,
    color: '#64748b',
  },
  itemCount: {
    fontSize: 14,
    color: '#64748b',
  },
  cartTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0891b2',
    marginTop: 5,
  },
  noteTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fffbeb',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  noteText: {
    fontSize: 12,
    color: '#92400e',
    marginLeft: 4,
    maxWidth: 250,
  },
  emptyState: {
    padding: 30,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#64748b',
  },
});