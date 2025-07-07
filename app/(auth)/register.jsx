import { Link, router } from 'expo-router'
import { useState } from 'react'
import { Alert, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import { useAuth } from '../../utils/auth'

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleRegister = async () => {
    const { name, email, password, confirmPassword } = formData

    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('ข้อผิดพลาด', 'กรุณากรอกข้อมูลให้ครบถ้วน')
      return
    }

    if (password !== confirmPassword) {
      Alert.alert('ข้อผิดพลาด', 'รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน')
      return
    }

    if (password.length < 6) {
      Alert.alert('ข้อผิดพลาด', 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร')
      return
    }

    setLoading(true)
    try {
      await signUp(email, password, name)
      Alert.alert(
        'สมัครสมาชิกสำเร็จ',
        'ยินดีต้อนรับสู่แอปพลิเคชัน',
        [
          {
            text: 'ตกลง',
            onPress: () => router.replace('/')
          }
        ]
      )
    } catch (error) {
      Alert.alert('ข้อผิดพลาด', 'เกิดข้อผิดพลาดในการสมัครสมาชิก กรุณาลองใหม่อีกครั้ง')
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>สมัครสมาชิก</Text>
            <Text style={styles.subtitle}>สร้างบัญชีใหม่เพื่อเริ่มต้นใช้งาน</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>ชื่อ-นามสกุล</Text>
              <TextInput
                style={styles.input}
                placeholder="กรอกชื่อและนามสกุลของคุณ"
                value={formData.name}
                onChangeText={(value) => handleInputChange('name', value)}
                autoComplete="name"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>อีเมล</Text>
              <TextInput
                style={styles.input}
                placeholder="กรอกอีเมลของคุณ"
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>รหัสผ่าน</Text>
              <TextInput
                style={styles.input}
                placeholder="กรอกรหัสผ่าน (อย่างน้อย 6 ตัวอักษร)"
                value={formData.password}
                onChangeText={(value) => handleInputChange('password', value)}
                secureTextEntry
                autoComplete="new-password"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>ยืนยันรหัสผ่าน</Text>
              <TextInput
                style={styles.input}
                placeholder="กรอกรหัสผ่านอีกครั้ง"
                value={formData.confirmPassword}
                onChangeText={(value) => handleInputChange('confirmPassword', value)}
                secureTextEntry
                autoComplete="new-password"
              />
            </View>

            <TouchableOpacity 
              style={[styles.registerButton, loading && styles.registerButtonDisabled]}
              onPress={handleRegister}
              disabled={loading}
            >
              <Text style={styles.registerButtonText}>
                {loading ? 'กำลังสมัครสมาชิก...' : 'สมัครสมาชิก'}
              </Text>
            </TouchableOpacity>

            <View style={styles.terms}>
              <Text style={styles.termsText}>
                การสมัครสมาชิกหมายความว่าคุณยอมรับ{' '}
                <Text style={styles.termsLink}>เงื่อนไขการใช้งาน</Text>
                {' และ '}
                <Text style={styles.termsLink}>นโยบายความเป็นส่วนตัว</Text>
              </Text>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>มีบัญชีอยู่แล้ว? </Text>
            <Link href="/login" style={styles.loginLink}>
              เข้าสู่ระบบ
            </Link>
          </View>
        </View>
      </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  form: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: '#f9fafb',
  },
  registerButton: {
    backgroundColor: '#10b981',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  registerButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  registerButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  terms: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  termsText: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 18,
  },
  termsLink: {
    color: '#10b981',
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  footerText: {
    fontSize: 14,
    color: '#6b7280',
  },
  loginLink: {
    color: '#6366f1',
    fontSize: 14,
    fontWeight: '600',
  },
})
