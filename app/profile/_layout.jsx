import { Stack } from 'expo-router'

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#6366f1', // สีม่วงเข้ม
          borderBottomWidth: 0,
          elevation: 0, // Android
          shadowOpacity: 0, // iOS
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 18,
          color: '#ffffff',
        },
        headerTitleAlign: 'center',
        headerBlurEffect: 'light',
        animation: 'slide_from_right',
        presentation: 'card',
        contentStyle: {
          backgroundColor: '#f8fafc',
        },
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'My Profile',
          headerShown: true,
          headerStyle: {
            backgroundColor: '#6366f1',
          },
          headerRight: () => null, // สามารถเพิ่ม component ปุ่มได้
        }} 
      />
      {/* เพิ่ม screens อื่นๆ เมื่อสร้างไฟล์จริงแล้ว:
          <Stack.Screen name="settings" options={{ title: 'Settings' }} />
          <Stack.Screen name="edit" options={{ title: 'Edit Profile' }} />
          <Stack.Screen name="security" options={{ title: 'Security & Privacy' }} />
      */}
    </Stack>
  )
}
