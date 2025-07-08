import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    Image,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import useUserStore from '../stores/userStore';

const MerchantHeader = ({ title, showBackButton = false }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const router = useRouter();
  
  const selectedMerchantId = useUserStore(state => state.selectedMerchantId);
  const accessibleMerchants = useUserStore(state => state.accessibleMerchants);
  const employeeName = useUserStore(state => state.employeeName);
  
  // หาร้านค้าที่เลือกจาก id
  const selectedMerchant = accessibleMerchants.find(
    merchant => merchant.id === selectedMerchantId
  );
  
  if (!selectedMerchant) {
    return (
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{title || 'ไม่ได้เลือกร้านค้า'}</Text>
      </View>
    );
  }
  
  // ฟังก์ชันเปลี่ยนร้านค้า
  const handleChangeMerchant = () => {
    setMenuVisible(false);
    router.replace('/(auth)/select-merchant');
  };
  
  // ฟังก์ชันออกจากระบบ
  const handleLogout = () => {
    Alert.alert(
      'ยืนยันการออกจากระบบ',
      'คุณต้องการออกจากระบบหรือไม่?',
      [
        { text: 'ยกเลิก', style: 'cancel' },
        { 
          text: 'ออกจากระบบ', 
          style: 'destructive',
          onPress: () => {
            router.replace('/(auth)/login');
          }
        }
      ]
    );
  };

  return (
    <>
      <View style={styles.header}>
        {showBackButton && (
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <MaterialIcons name="arrow-back" size={24} color="#0f172a" />
          </TouchableOpacity>
        )}
        
        <View style={styles.titleContainer}>
          <Text style={styles.headerTitle}>{title || selectedMerchant.name}</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.merchantButton}
          onPress={() => setMenuVisible(true)}
        >
          <Image 
            source={{ uri: selectedMerchant.logo }}
            style={styles.merchantLogo}
          />
        </TouchableOpacity>
      </View>
      
      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.menuContainer}>
            <View style={styles.menuHeader}>
              <Image 
                source={{ uri: selectedMerchant.logo }}
                style={styles.menuLogo}
              />
              <View style={styles.menuInfo}>
                <Text style={styles.menuMerchantName}>{selectedMerchant.name}</Text>
                <Text style={styles.menuEmployeeName}>{employeeName}</Text>
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={handleChangeMerchant}
            >
              <MaterialIcons name="store" size={24} color="#0891b2" />
              <Text style={styles.menuItemText}>เปลี่ยนร้านค้า</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={handleLogout}
            >
              <MaterialIcons name="logout" size={24} color="#ef4444" />
              <Text style={[styles.menuItemText, { color: '#ef4444' }]}>ออกจากระบบ</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    height: 60,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  backButton: {
    padding: 8,
    marginRight: 5,
  },
  titleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
color: '#0f172a',
  },
  merchantButton: {
    padding: 5,
  },
  merchantLogo: {
    width: 35,
    height: 35,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  menuContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  menuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  menuLogo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  menuInfo: {
    flex: 1,
  },
  menuMerchantName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  menuEmployeeName: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 15,
    color: '#0f172a',
  },
});

export default MerchantHeader;