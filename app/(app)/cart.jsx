import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Alert,
  ActivityIndicator,
  PanResponder,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import useCartStore from '../../stores/cartStore';
import useUserStore from '../../stores/userStore';
import CartSwitcher from '../../components/CartSwitcher';
import CartItem from '../../components/CartItem';
import MerchantHeader from '../../components/MerchantHeader';

const CartScreen = () => {
  // ดึงข้อมูลผู้ใช้และร้านค้า
  const selectedMerchant = useUserStore(state => state.getSelectedMerchant());
  const employeeId = useUserStore(state => state.employeeId);
  
  // ดึงข้อมูลและฟังก์ชันจาก Zustand store
  const { 
    activeCartId,
    clearCart, 
    checkoutCart, 
    createCart 
  } = useCartStore(state => ({
    activeCartId: state.activeCartId,
    clearCart: state.clearCart,
    checkoutCart: state.checkoutCart,
    createCart: state.createCart
  }));
  
  // ตะกร้าที่กำลังใช้งาน
  const activeCart = useCartStore(state => state.getActiveCart());
  
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  // State สำหรับการเลื่อนลบรายการ
  const [swipedItemId, setSwipedItemId] = useState(null);
  const swipeAnim = useRef(new Animated.Value(0)).current;

  // ฟังก์ชันสำหรับชำระเงิน
  const handleCheckout = () => {
    if (!selectedMerchant) {
      Alert.alert('ข้อผิดพลาด', 'กรุณาเลือกร้านค้าก่อน');
      return;
    }
    
    if (!activeCart || activeCart.items.length === 0) {
      Alert.alert('ไม่สามารถชำระเงินได้', 'กรุณาเพิ่มสินค้าในตะกร้าก่อน');
      return;
    }

    Alert.alert(
      'ยืนยันการชำระเงิน',
      ร้านค้า: ${selectedMerchant.name}\nตะกร้า: ${activeCart.name}\nรายการทั้งหมด: ${activeCart.items.length} รายการ\nยอดรวมทั้งสิ้น: ${activeCart.total.toLocaleString()} บาท,
      [
        { text: 'ยกเลิก' },
        { 
          text: 'ยืนยัน',
          onPress: processCheckout
        }
      ]
    );
  };

  // ฟังก์ชันประมวลผลการชำระเงิน
  const processCheckout = async () => {
    try {
      setLoading(true);
      
      // สมมติว่านี่เป็นการส่งข้อมูลไปยัง API
      // await api.createOrder({ 
      //   items: activeCart.items, 
      //   cartId: activeCart.id,
      //   employeeId,
      //   merchantId: selectedMerchant.id,
      //   total: activeCart.total,
      //   note: activeCart.note 
      // });
      
      // จำลองการส่งข้อมูล
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // เมื่อ checkout สำเร็จ ลบตะกร้าเดิมและสร้างตะกร้าใหม่
      checkoutCart();
      
      // สร้างตะกร้าใหม่หลังจาก checkout
      createCart(selectedMerchant.id, 'ตะกร้าใหม่');
      
      Alert.alert(
        'ทำรายการสำเร็จ',
        'บันทึกการขายเรียบร้อยแล้ว',
        [{ text: 'ตกลง', onPress: () => router.replace('/(app)/') }]
      );
    } catch (error) {
      Alert.alert('เกิดข้อผิดพลาด', error.message || 'ไม่สามารถทำรายการได้');
    } finally {
      setLoading(false);
    }
  };

  // ฟังก์ชันจัดการ swipe เพื่อลบ
  const handleSwipeDelete = (itemId) => {
    if (swipedItemId === itemId) {
      setSwipedItemId(null);
      swipeAnim.setValue(0);
    } else {
      setSwipedItemId(itemId);
      Animated.timing(swipeAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  // Render รายการสินค้าในตะกร้า
  const renderItem = ({ item }) => {
    const isBeingSwiped = swipedItemId === item.id;
    const swipeValue = isBeingSwiped ? swipeAnim : new Animated.Value(0);
    
    return (
      <CartItem 
        item={item} 
        onSwipe={isBeingSwiped ? swipeValue : null}
        onSwipeStart={() => handleSwipeDelete(item.id)}
      />
    );
  };

  // ถ้าไม่มีร้านค้าที่เลือก แสดงข้อความ
  if (!selectedMerchant) {
    return (
      <View style={[styles.container, styles.centeredContainer]}>
        <Text style={styles.noMerchantText}>กรุณาเลือกร้านค้าก่อน</Text>
        <TouchableOpacity 
          style={styles.selectMerchantButton}
          onPress={() => router.push('/(auth)/select-merchant')}
        >
          <Text style={styles.selectMerchantText}>เลือกร้านค้า</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MerchantHeader title="ตะกร้าสินค้า" />

      {/* ตัวสลับตะกร้า */}
      <CartSwitcher />

      {activeCart && activeCart.note ? (
        <View style={styles.noteCard}>
          <Text style={styles.noteLabel}>บันทึก:</Text>
          <Text style={styles.noteText}>{activeCart.note}</Text>
        </View>
      ) : null}

      {activeCart && activeCart.items.length > 0 ? (
        <FlatList
          data={activeCart.items}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.cartList}
        />
      ) : (
        <View style={styles.emptyCart}>
          <AntDesign name="shoppingcart" size={80} color="#d1d5db" />
          <Text style={styles.emptyCartText}>ไม่มีสินค้าในตะกร้า</Text>
          <TouchableOpacity 
            style={styles.scanButton}
            onPress={() => router.push('/(app)/scan')}
          >
            <Text style={styles.scanButtonText}>ไปยังหน้าสแกนสินค้า</Text>
          </TouchableOpacity>
        </View>
      )}

      {activeCart && activeCart.items.length > 0 && (
        <View style={styles.footer}>
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>ยอดรวม:</Text>
            <Text style={styles.totalAmount}>
              ฿{activeCart.total.toLocaleString()}
            </Text>
          </View>
          
          <TouchableOpacity
            style={[
              styles.checkoutButton,
              (loading  !activeCart  activeCart.items.length === 0) && styles.disabledButton
            ]}
            onPress={handleCheckout}
            disabled={loading  !activeCart  activeCart.items.length === 0}
          >
            {loading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <>
                <MaterialIcons name="payment" size={24} color="white" />
                <Text style={styles.checkoutButtonText}>ชำระเงิน</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centeredContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noMerchantText: {
    fontSize: 18,
    color: '#64748b',
    marginBottom: 20,
    textAlign: 'center',
  },
  selectMerchantButton: {
    backgroundColor: '#0891b2',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  selectMerchantText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  clearCartText: {
    color: '#ef4444',
    fontWeight: '500',
  },
  noteCard: {
    backgroundColor: '#fffbeb', // สีเหลืองอ่อน
    marginHorizontal: 15,
    marginTop: 10,
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  noteLabel: {
    fontWeight: 'bold',
    color: '#92400e',
    marginBottom: 4,
  },
  noteText: {
    color: '#78350f',
  },
  cartList: {
    padding: 15,
  },
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 50,
  },
  emptyCartText: {
    marginTop: 20,
    fontSize: 18,
    color: '#64748b',
    marginBottom: 20,
  },
  scanButton: {
    backgroundColor: '#0891b2',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  scanButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  footer: {
    backgroundColor: 'white',
    padding: 20,
    borderTopWidth: 1,
    borderColor: '#e5e7eb',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  totalLabel: {
    fontSize: 18,
    color: '#64748b',
  },
  totalAmount: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  checkoutButton: {
    backgroundColor: '#0891b2',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: '#93c5fd',
  },
  checkoutButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default CartScreen;