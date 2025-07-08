import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert,
  Switch,
  ScrollView,
  Image
} from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import useUserStore from '../../stores/userStore';
import useCartStore from '../../stores/cartStore';
import MerchantHeader from '../../components/MerchantHeader';

export default function ProfileScreen() {
  const router = useRouter();
  
  // ดึงข้อมูลและฟังก์ชันจาก User Store
  const { 
    employeeId, 
    employeeName, 
    selectedMerchant, 
    accessibleMerchants, 
    resetUserData 
  } = useUserStore(state => ({
    employeeId: state.employeeId,
    employeeName: state.employeeName,
    selectedMerchant: state.getSelectedMerchant(),
    accessibleMerchants: state.accessibleMerchants,
    resetUserData: state.resetUserData
  }));
  
  // ดึงฟังก์ชันจาก Cart Store
  const resetAll = useCartStore(state => state.resetAll);
  
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);

  const handleLogout = () => {
    Alert.alert(
      'ยืนยันการออกจากระบบ',
      'คุณต้องการออกจากระบบหรือไม่?',
      [
        { text: 'ยกเลิก' },
        { 
          text: 'ออกจากระบบ', 
          style: 'destructive',
          onPress: () => {
            // ล้างข้อมูลทั้งหมด
            resetAll();
            resetUserData();
            // นำทางกลับไปยังหน้า login
            router.replace('/(auth)/login');
          } 
        }
      ]
    );
  };
  
  const handleChangeMerchant = () => {
    router.push('/(auth)/select-merchant');
  };

  return (
    <View style={styles.container}>
      <MerchantHeader title="โปรไฟล์" />
      
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.profileHeader}>
          <View style={styles.profileContainer}>
            <View style={styles.avatar}>
              <FontAwesome5 name="user-circle" size={60} color="#0891b2" />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.name}>{employeeName || 'พนักงาน'}</Text>
              <Text style={styles.employeeId}>รหัสพนักงาน: {employeeId || 'N/A'}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ร้านค้าที่เข้าถึงได้</Text>
          
          {accessibleMerchants.map(merchant => (
            <TouchableOpacity
              key={merchant.id}
              style={[
                styles.merchantItem,
                selectedMerchant?.id === merchant.id && styles.selectedMerchantItem
              ]}
              onPress={() => {
                if (selectedMerchant?.id !== merchant.id) {
                  Alert.alert(
                    'เปลี่ยนร้านค้า',
                    คุณต้องการเปลี่ยนไปยังร้าน ${merchant.name} หรือไม่?,
                    [
                      { text: 'ยกเลิก' },
                      { text: 'เปลี่ยน', onPress: handleChangeMerchant }
                    ]
                  );
                }
              }}
            >
              <Image 
                source={{ uri: merchant.logo }}
                style={styles.merchantLogo}
              />
              <View style={styles.merchantInfo}>
                <Text style={styles.merchantName}>{merchant.name}</Text>
                <Text style={styles.merchantDesc}>{merchant.description}</Text>
              </View>
              {selectedMerchant?.id === merchant.id && (
                <MaterialIcons name="check-circle" size={24} color="#10b981" />
              )}
            </TouchableOpacity>
          ))}
          
          <TouchableOpacity 
            style={styles.changeMerchantButton}
            onPress={handleChangeMerchant}
          >
            <MaterialIcons name="store" size={20} color="white" />
            <Text style={styles.changeMerchantText}>เปลี่ยนร้านค้า</Text>
</TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>การตั้งค่าแอปพลิเคชัน</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <MaterialIcons name="brightness-4" size={24} color="#64748b" />
              <Text style={styles.settingLabel}>โหมดกลางคืน</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: "#cbd5e1", true: "#0891b2" }}
              thumbColor="#ffffff"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <MaterialIcons name="notifications" size={24} color="#64748b" />
              <Text style={styles.settingLabel}>การแจ้งเตือน</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: "#cbd5e1", true: "#0891b2" }}
              thumbColor="#ffffff"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <MaterialIcons name="volume-up" size={24} color="#64748b" />
              <Text style={styles.settingLabel}>เสียงเอฟเฟกต์</Text>
            </View>
            <Switch
              value={soundEffects}
              onValueChange={setSoundEffects}
              trackColor={{ false: "#cbd5e1", true: "#0891b2" }}
              thumbColor="#ffffff"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ช่วยเหลือ</Text>
          
          <TouchableOpacity style={styles.menuItem}>
            <MaterialIcons name="help-outline" size={24} color="#64748b" />
            <Text style={styles.menuLabel}>คู่มือการใช้งาน</Text>
            <MaterialIcons name="chevron-right" size={24} color="#cbd5e1" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <MaterialIcons name="headset-mic" size={24} color="#64748b" />
            <Text style={styles.menuLabel}>ติดต่อฝ่ายสนับสนุน</Text>
            <MaterialIcons name="chevron-right" size={24} color="#cbd5e1" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem}>
            <MaterialIcons name="bug-report" size={24} color="#64748b" />
            <Text style={styles.menuLabel}>รายงานปัญหา</Text>
            <MaterialIcons name="chevron-right" size={24} color="#cbd5e1" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>บัญชี</Text>
          
          <TouchableOpacity style={styles.menuItem}>
            <MaterialIcons name="lock-outline" size={24} color="#64748b" />
            <Text style={styles.menuLabel}>เปลี่ยนรหัสผ่าน</Text>
            <MaterialIcons name="chevron-right" size={24} color="#cbd5e1" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.menuItem, styles.logoutItem]} 
            onPress={handleLogout}
          >
            <MaterialIcons name="logout" size={24} color="#ef4444" />
            <Text style={styles.logoutLabel}>ออกจากระบบ</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.version}>เวอร์ชัน 1.0.0</Text>
          <Text style={styles.copyright}>© 2025 Tatonq Company</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flex: 1,
  },
  profileHeader: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 15,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    marginRight: 15,
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    fontSize: 22,
fontWeight: 'bold',
    color: '#1e293b',
  },
  employeeId: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 5,
  },
  section: {
    backgroundColor: 'white',
    marginBottom: 15,
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748b',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  merchantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  selectedMerchantItem: {
    backgroundColor: '#f0f9ff',
  },
  merchantLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 15,
  },
  merchantInfo: {
    flex: 1,
  },
  merchantName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1e293b',
  },
  merchantDesc: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 2,
  },
  changeMerchantButton: {
    flexDirection: 'row',
    backgroundColor: '#0891b2',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 15,
    marginVertical: 10,
    paddingVertical: 12,
    borderRadius: 8,
  },
  changeMerchantText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 16,
    marginLeft: 15,
    color: '#1e293b',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  menuLabel: {
    fontSize: 16,
    marginLeft: 15,
    flex: 1,
    color: '#1e293b',
  },
  logoutItem: {
    borderBottomWidth: 0,
  },
  logoutLabel: {
    fontSize: 16,
    marginLeft: 15,
    flex: 1,
    color: '#ef4444',
    fontWeight: '500',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  version: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 5,
  },
  copyright: {
    fontSize: 12,
    color: '#94a3b8',
  },
});