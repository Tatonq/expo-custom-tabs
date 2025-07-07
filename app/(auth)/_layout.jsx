import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // ซ่อน header เพื่อให้ดูสะอาด
        animation: 'slide_from_right',
        presentation: 'card',
        contentStyle: {
          backgroundColor: '#ffffff',
        },
      }}
    >
      <Stack.Screen 
        name="login" 
        options={{ 
          title: 'เข้าสู่ระบบ',
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="register" 
        options={{ 
          title: 'สมัครสมาชิก',
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="forgot-password" 
        options={{ 
          title: 'ลืมรหัสผ่าน',
          headerShown: true,
          headerStyle: {
            backgroundColor: '#ffffff',
          },
          headerTintColor: '#000000',
          headerTitleStyle: {
            fontWeight: '600',
          },
          headerBackTitle: 'ย้อนกลับ',
        }} 
      />
    </Stack>
  )
}