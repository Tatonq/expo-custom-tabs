import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import CartSwitcher from '../../components/CartSwitcher';
import MerchantHeader from '../../components/MerchantHeader';
import Scanner from '../../components/Scanner';
import useCartStore from '../../stores/cartStore';
import useProductsStore from '../../stores/productsStore';
import useUserStore from '../../stores/userStore';

const ScanScreen = () => {
  const [lastScannedItem, setLastScannedItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recentProducts, setRecentProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  
  const router = useRouter();
  
  // ดึงข้อมูลร้านค้า
  const selectedMerchant = useUserStore(state => state.getSelectedMerchant());
  
  // ดึงข้อมูลและฟังก์ชันจาก cart store
  const { activeCartId, createCart, cartCount, addToCart } = useCartStore(state => ({
    activeCartId: state.activeCartId,
    createCart: state.createCart,
    cartCount: state.getCartCount(),
    addToCart: state.addToCart
  }));
  
  // ดึงข้อมูลสินค้า
  const { findProductByBarcode, getCategories, getProductsByCategory } = useProductsStore(state => ({
    findProductByBarcode: state.findProductByBarcode,
    getCategories: state.getCategories,
    getProductsByCategory: state.getProductsByCategory
  }));
  
  // ตะกร้าที่กำลังใช้งานอยู่
  const activeCart = useCartStore(state => state.getActiveCart());
  
  // หมวดหมู่สินค้า
  const categories = selectedMerchant ? getCategories(selectedMerchant.id) : [];
  
  // สินค้าในหมวดที่เลือก
  const categoryProducts = selectedMerchant && selectedCategory
    ? getProductsByCategory(selectedMerchant.id, selectedCategory)
    : [];
  
  // ตรวจสอบว่ามีตะกร้าที่ใช้งานอยู่หรือไม่ ถ้าไม่มีให้สร้างตะกร้าใหม่เมื่อเปิดหน้าสแกน
  useEffect(() => {
    if (selectedMerchant && cartCount === 0) {
      createCart(selectedMerchant.id, 'ตะกร้าใหม่');
    }
  }, [selectedMerchant, cartCount, createCart]);
  
  // จัดการเมื่อสแกนสินค้า
  const handleScanned = async (barcode) => {
    if (!selectedMerchant) {
      Alert.alert('ข้อผิดพลาด', 'กรุณาเลือกร้านค้าก่อน');
      return;
    }
    
    if (!activeCartId) {
      Alert.alert('ข้อผิดพลาด', 'กรุณาสร้างตะกร้าก่อน');
      return;
    }
    
    setLoading(true);
    
    try {
      // ค้นหาสินค้าจากรหัสบาร์โค้ด
      const product = findProductByBarcode(selectedMerchant.id, barcode);
      
      if (!product) {
        Alert.alert('ไม่พบสินค้า', `ไม่พบสินค้ารหัส ${barcode} ในระบบ`);
        return;
      }
      
      // เพิ่มสินค้าลงในตะกร้า
      addToCart(product);
      
      // เพิ่มสินค้าลงในรายการสินค้าที่สแกนล่าสุด
      setLastScannedItem(product);
      setRecentProducts(prev => {
        // ตรวจสอบว่ามีสินค้านี้อยู่แล้วหรือไม่
        const existingIndex = prev.findIndex(item => item.id === product.id);
        
        if (existingIndex >= 0) {
          // ถ้ามีอยู่แล้ว ย้ายไปไว้ด้านบนสุด
          const updated = [...prev];
          updated.splice(existingIndex, 1);
          return [product, ...updated].slice(0, 5); // เก็บแค่ 5 รายการล่าสุด
        }
        
        // ถ้ายังไม่มี เพิ่มใหม่แล้วตัดให้เหลือ 5 รายการ
        return [product, ...prev].slice(0, 5);
      });
      
    } catch (error) {
      Alert.alert('ข้อผิดพลาด', 'ไม่สามารถสแกนสินค้าได้');
    } finally {
      setLoading(false);
    }
  };
  
  // เลือกสินค้าจากรายการ
  const handleSelectProduct = (product) => {
    if (!activeCartId) {
      Alert.alert('ข้อผิดพลาด', 'กรุณาสร้างตะกร้าก่อน');
      return;
    }
    
    addToCart(product);
    setLastScannedItem(product);
    
    // อัปเดตรายการสินค้าล่าสุด
    setRecentProducts(prev => {
      const existingIndex = prev.findIndex(item => item.id === product.id);
      
      if (existingIndex >= 0) {
        const updated = [...prev];
updated.splice(existingIndex, 1);
        return [product, ...updated].slice(0, 5);
      }
      
      return [product, ...prev].slice(0, 5);
    });
  };
  
  // แสดงรายการสินค้าแต่ละรายการ
  const renderProductItem = ({ item }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => handleSelectProduct(item)}
    >
      <Image
        source={{ uri: item.image || 'https://via.placeholder.com/100' }}
        style={styles.productImage}
      />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>฿{item.price}</Text>
      </View>
    </TouchableOpacity>
  );
  
  // แสดงหมวดหมู่
  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryButton,
        selectedCategory === item && styles.selectedCategory
      ]}
      onPress={() => setSelectedCategory(item === selectedCategory ? null : item)}
    >
      <Text
        style={[
          styles.categoryText,
          selectedCategory === item && styles.selectedCategoryText
        ]}
      >
        {item}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <MerchantHeader title="สแกนสินค้า" />
      
      {/* ตัวสลับตะกร้า */}
      <CartSwitcher />
      
      <View style={styles.scannerSection}>
        <Text style={styles.sectionTitle}>สแกนสินค้า</Text>
        <View style={styles.scannerContainer}>
          <Scanner onScanned={handleScanned} />
        </View>
        
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0891b2" />
            <Text style={styles.loadingText}>กำลังประมวลผล...</Text>
          </View>
        ) : lastScannedItem ? (
          <View style={styles.lastScannedContainer}>
            <Text style={styles.scannedTitle}>สแกนล่าสุด</Text>
            <Text style={styles.productName}>{lastScannedItem.name}</Text>
            <Text style={styles.productPrice}>
              ฿{lastScannedItem.price.toLocaleString()}
            </Text>
            <Text style={styles.addedToCart}>
              เพิ่มลงใน {activeCart?.name || 'ตะกร้า'} แล้ว
            </Text>
          </View>
        ) : null}
      </View>
      
      <View style={styles.categoriesSection}>
        <Text style={styles.sectionTitle}>หมวดหมู่สินค้า</Text>
        <FlatList
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={item => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesList}
          contentContainerStyle={styles.categoriesContent}
        />
      </View>
      
      {selectedCategory ? (
        <View style={styles.productsSection}>
          <Text style={styles.sectionTitle}>
            สินค้าในหมวด {selectedCategory}
          </Text>
          <FlatList
            data={categoryProducts}
            renderItem={renderProductItem}
            keyExtractor={item => item.id}
            numColumns={2}
            contentContainerStyle={styles.productsGrid}
          />
        </View>
      ) : recentProducts.length > 0 ? (
        <View style={styles.productsSection}>
          <Text style={styles.sectionTitle}>สินค้าล่าสุด</Text>
          <FlatList
            data={recentProducts}
            renderItem={renderProductItem}
            keyExtractor={item => item.id}
            numColumns={2}
            contentContainerStyle={styles.productsGrid}
          />
        </View>
      ) : null}
      
      <TouchableOpacity 
        style={styles.viewCartButton}
        onPress={() => router.push('/(app)/cart')}
      >
        <FontAwesome5 name="shopping-cart" size={20} color="white" />
        {activeCart?.items.length > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{activeCart.items.length}</Text>
          </View>
        )}
        <Text style={styles.viewCartText}>ดูตะกร้า</Text>
        {activeCart?.total > 0 && (
<Text style={styles.cartTotal}>฿{activeCart.total.toLocaleString()}</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scannerSection: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  scannerContainer: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 15,
  },
  loadingContainer: {
    padding: 15,
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#64748b',
  },
  lastScannedContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  scannedTitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  productPrice: {
    fontSize: 20,
    color: '#0891b2',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  addedToCart: {
    fontSize: 14,
    color: '#10b981',
    fontStyle: 'italic',
  },
  categoriesSection: {
    padding: 15,
    paddingTop: 0,
  },
  categoriesList: {
    maxHeight: 50,
  },
  categoriesContent: {
    paddingRight: 10,
  },
  categoryButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: 'white',
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  selectedCategory: {
    backgroundColor: '#0891b2',
    borderColor: '#0891b2',
  },
  categoryText: {
    color: '#64748b',
    fontWeight: '500',
  },
  selectedCategoryText: {
    color: 'white',
  },
  productsSection: {
    flex: 1,
    padding: 15,
    paddingTop: 0,
  },
  productsGrid: {
    paddingBottom: 80, // เพิ่ม padding ด้านล่างเพื่อให้มีพื้นที่สำหรับปุ่มดูตะกร้า
  },
  productCard: {
    flex: 1,
    backgroundColor: 'white',
    margin: 5,
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginBottom: 8,
  },
  productInfo: {
    alignItems: 'center',
  },
  viewCartButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#0891b2',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  viewCartText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
    flex: 1,
  },
  cartTotal: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ScanScreen;