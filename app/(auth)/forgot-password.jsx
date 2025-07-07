import { Link, router } from 'expo-router'
import { useState } from 'react'
import { Alert, Keyboard, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import { useAuth } from '../../utils/auth'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const { resetPassword } = useAuth()

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('ข้อผิดพลาด', 'กรุณากรอกอีเมลของคุณ')
      return
    }

    setLoading(true)
    try {
      await resetPassword(email)
      setSent(true)
      Alert.alert(
        'ส่งอีเมลสำเร็จ',
        'เราได้ส่งลิงก์สำหรับรีเซ็ตรหัสผ่านไปยังอีเมลของคุณแล้ว',
        [
          {
            text: 'ตกลง',
            onPress: () => router.back()
          }
        ]
      )
    } catch (error) {
      Alert.alert('ข้อผิดพลาด', 'เกิดข้อผิดพลาดในการส่งอีเมล กรุณาลองใหม่อีกครั้ง')
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
        <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>ลืมรหัสผ่าน?</Text>
          <Text style={styles.subtitle}>
            ไม่ต้องกังวล! กรอกอีเมลของคุณ เราจะส่งลิงก์สำหรับรีเซ็ตรหัสผ่านให้คุณ
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>อีเมล</Text>
            <TextInput
              style={styles.input}
              placeholder="กรอกอีเมลของคุณ"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              editable={!sent}
            />
          </View>

          <TouchableOpacity 
            style={[styles.resetButton, (loading || sent) && styles.resetButtonDisabled]}
            onPress={handleResetPassword}
            disabled={loading || sent}
          >
            <Text style={styles.resetButtonText}>
              {loading ? 'กำลังส่งอีเมล...' : sent ? 'ส่งอีเมลแล้ว' : 'ส่งลิงก์รีเซ็ตรหัสผ่าน'}
            </Text>
          </TouchableOpacity>

          {sent && (
            <View style={styles.successMessage}>
              <Text style={styles.successText}>
                ✅ ส่งอีเมลสำเร็จ! กรุณาตรวจสอบกล่องจดหมายของคุณ
              </Text>
              <TouchableOpacity 
                style={styles.resendButton}
                onPress={() => {
                  setSent(false)
                  setEmail('')
                }}
              >
                <Text style={styles.resendButtonText}>ส่งอีเมลใหม่</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>จำรหัสผ่านได้แล้ว? </Text>
          <Link href="/login" style={styles.loginLink}>
            เข้าสู่ระบบ
          </Link>
        </View>
      </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 22,
  },
  form: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 24,
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
  resetButton: {
    backgroundColor: '#f59e0b',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  resetButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  resetButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  successMessage: {
    marginTop: 24,
    padding: 20,
    backgroundColor: '#f0fdf4',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#bbf7d0',
    alignItems: 'center',
  },
  successText: {
    fontSize: 14,
    color: '#15803d',
    textAlign: 'center',
    marginBottom: 12,
  },
  resendButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  resendButtonText: {
    color: '#f59e0b',
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
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
