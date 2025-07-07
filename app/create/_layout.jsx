import { Stack } from 'expo-router'

export default function CreateLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#e11d48', // สีแดง-ชมพู
          borderBottomWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 18,
          color: '#ffffff',
        },
        headerTitleAlign: 'center',
        animation: 'slide_from_bottom',
        contentStyle: {
          backgroundColor: '#fef2f2',
        },
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'Create New',
          headerShown: true,
          headerStyle: {
            backgroundColor: '#e11d48',
          },
        }} 
      />
      {/* เพิ่ม screens อื่นๆ เมื่อสร้างไฟล์จริงแล้ว:
          <Stack.Screen name="photo" options={{ title: 'Photo Editor' }} />
          <Stack.Screen name="video" options={{ title: 'Video Editor' }} />
          <Stack.Screen name="template" options={{ title: 'Choose Template' }} />
          <Stack.Screen name="preview" options={{ title: 'Preview' }} />
      */}
    </Stack>
  )
}
