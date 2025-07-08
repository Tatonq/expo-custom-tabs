import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import useProductsStore from '../../stores/productsStore';
import useUserStore from '../../stores/userStore';
import { mockCheckEmployeeAccess } from '../../utils/mockData';

export default function LoginScreen() {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  const router = useRouter();
  const { setEmployeeInfo, setAccessibleMerchants } = useUserStore();
  const initMockData = useProductsStore(state => state.initMockData);
  
  const handleLogin = async () => {
    if (!employeeId) {
      Alert.alert('ข้อผิดพลาด', 'กรุณากรอกรหัสพนักงาน');
      return;
    }
    
    setLoading(true);
    
    try {
      // จำลองการเรียก API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // ตรวจสอบว่าพนักงานมีสิทธิ์เข้าถึงร้านค้าใดบ้าง
      const accessibleMerchants = mockCheckEmployeeAccess(employeeId);
      
      if (accessibleMerchants.length === 0) {
        Alert.alert('ข้อผิดพลาด', 'ไม่พบสิทธิ์การเข้าถึงร้านค้า โปรดติดต่อผู้ดูแลระบบ');
        setLoading(false);
        return;
      }
      
      // บันทึกข้อมูลพนักงานลงใน store
      setEmployeeInfo(employeeId, `พนักงาน ${employeeId}`);
      
      // บันทึกรายการร้านค้าที่เข้าถึงได้
      setAccessibleMerchants(accessibleMerchants);
      
      // สร้างข้อมูล mock สำหรับสินค้า
      initMockData();
      
      // นำทางไปยังหน้าเลือกร้านค้า
      router.replace('/(auth)/select-merchant');
      
    } catch (error) {
      Alert.alert('ข้อผิดพลาด', error.message || 'ไม่สามารถเข้าสู่ระบบได้');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../assets/logo.png')} 
            style={styles.logo}
            defaultSource={require('../../assets/logo-placeholder.png')}
          />
          <Text style={styles.appName}>Multi-merchant POS</Text>
        </View>
        
        <Text style={styles.loginTitle}>เข้าสู่ระบบ</Text>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>รหัสพนักงาน</Text>
          <TextInput 
            style={styles.input}
            placeholder="กรอกรหัสพนักงาน เช่น emp1234"
            value={employeeId}
            onChangeText={setEmployeeId}
            autoCapitalize="none"
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>รหัสผ่าน</Text>
          <View style={styles.passwordContainer}>
            <TextInput 
              style={styles.passwordInput}
              placeholder="กรอกรหัสผ่าน (เวอร์ชันทดลองไม่ต้องกรอก)"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity 
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Text>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.checkboxRow}>
          <TouchableOpacity 
            style={styles.checkbox}
            onPress={() => setRememberMe(!rememberMe)}
          >
            <View style={[
              styles.checkboxBox, 
              rememberMe && styles.checkboxChecked
            ]}>
              {rememberMe && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.checkboxLabel}>จดจำรหัสพนักงาน</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={[styles.loginButton, loading && styles.loginButtonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text style={styles.loginButtonText}>เข้าสู่ระบบ</Text>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>ลืมรหัสผ่าน?</Text>
        </TouchableOpacity>
        
        <Text style={styles.mockLoginInfo}>
          สำหรับทดลอง: ใช้รหัส emp1234 (เข้าได้ทั้ง 2 ร้าน) หรือ emp5678 (เข้าได้ร้านคาเฟ่อย่างเดียว)
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    maxWidth: 400,
    width: '100%',
    alignSelf: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0891b2',
    marginTop: 10,
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1e293b',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: '#475569',
    fontWeight: '500',
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    overflow: 'hidden',
  },
  passwordInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 4,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  checkboxChecked: {
    backgroundColor: '#0891b2',
    borderColor: '#0891b2',
  },
  checkmark: {
    color: 'white',
    fontSize: 12,
  },
  checkboxLabel: {
    color: '#64748b',
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#0891b2',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  loginButtonDisabled: {
    backgroundColor: '#93c5fd',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  forgotPassword: {
    alignItems: 'center',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#0891b2',
    fontSize: 14,
  },
  mockLoginInfo: {
    textAlign: 'center',
    fontSize: 12,
    color: '#64748b',
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f0f9ff',
    borderRadius: 8,
  }
});