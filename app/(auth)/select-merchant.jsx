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
import useCartStore from '../../stores/cartStore';
import useUserStore from '../../stores/userStore';

export default function SelectMerchantScreen() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  const { accessibleMerchants, setSelectedMerchant, employeeName } = useUserStore(state => ({
    accessibleMerchants: state.accessibleMerchants,
    setSelectedMerchant: state.setSelectedMerchant,
    employeeName: state.employeeName
  }));
  
  const resetMerchantCarts = useCartStore(state => state.resetMerchantCarts);
  
  // ตรวจสอบว่ามีร้านค้าให้เข้าถึงหรือไม่
  useEffect(() => {
    if (accessibleMerchants.length === 0) {
      Alert.alert(
        'ไม่พบสิทธิ์การเข้าถึง', 
        'คุณไม่มีสิทธิ์เข้าถึงร้านค้าใดๆ โปรดติดต่อผู้ดูแลระบบ',
        [{ text: 'กลับไปหน้าเข้าสู่ระบบ', onPress: () => router.replace('/(auth)/login') }]
      );
    }
  }, [accessibleMerchants]);
  
  // ฟังก์ชันเลือกร้านค้า
  const handleSelectMerchant = async (merchant) => {
    setLoading(true);
    
    try {
      // บันทึกร้านค้าที่เลือก
      setSelectedMerchant(merchant.id);
      
      // ล้างตะกร้าเก่าทั้งหมด (หรือไม่ก็ได้ ขึ้นอยู่กับความต้องการ)
      // resetMerchantCarts(merchant.id);
      
      // จำลองการโหลดข้อมูล
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // นำทางไปยังหน้าหลัก
      router.replace('/(app)/');
    } catch (error) {
      Alert.alert('ข้อผิดพลาด', 'ไม่สามารถเข้าสู่ร้านค้าได้');
    } finally {
      setLoading(false);
    }
  };
  
  const renderMerchantItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.merchantCard, { borderLeftColor: item.color }]} 
      onPress={() => handleSelectMerchant(item)}
      disabled={loading}
    >
      <Image 
        source={{ uri: item.logo }} 
        style={styles.merchantLogo}
      />
      <View style={styles.merchantInfo}>
        <Text style={styles.merchantName}>{item.name}</Text>
        <Text style={styles.merchantDesc}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>สวัสดี,</Text>
        <Text style={styles.employeeName}>{employeeName || 'พนักงาน'}</Text>
      </View>
      
      <Text style={styles.title}>เลือกร้านค้าที่ต้องการเข้าทำงาน</Text>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0891b2" />
          <Text style={styles.loadingText}>กำลังเข้าสู่ร้านค้า...</Text>
        </View>
      ) : (
        <FlatList
          data={accessibleMerchants}
          renderItem={renderMerchantItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.merchantList}
        />
      )}
      
      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={() => {
          Alert.alert(
            'ออกจากระบบ',
            'คุณต้องการออกจากระบบหรือไม่?',
            [
              { text: 'ยกเลิก' },
              { 
                text: 'ออกจากระบบ', 
                style: 'destructive',
                onPress: () => router.replace('/(auth)/login') 
              }
            ]
          );
        }}
      >
        <Text style={styles.logoutText}>ออกจากระบบ</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  header: {
    marginBottom: 40,
    marginTop: 40,
  },
  welcomeText: {
    fontSize: 18,
    color: '#64748b',
  },
  employeeName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 20,
  },
  merchantList: {
    paddingBottom: 20,
  },
  merchantCard: {
backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  merchantLogo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  merchantInfo: {
    flex: 1,
  },
  merchantName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 6,
  },
  merchantDesc: {
    fontSize: 14,
    color: '#64748b',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748b',
  },
  logoutButton: {
    padding: 15,
    alignItems: 'center',
    marginTop: 'auto',
  },
  logoutText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '500',
  },
});