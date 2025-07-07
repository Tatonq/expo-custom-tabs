import { Stack } from 'expo-router'

export default function ExploreLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#f59e0b', // สีเหลือง-ส้ม
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
        animation: 'fade',
        contentStyle: {
          backgroundColor: '#fffbeb',
        },
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'Explore World',
          headerShown: true,
          headerStyle: {
            backgroundColor: '#f59e0b',
          },
        }} 
      />
      {/* เพิ่ม screens อื่นๆ เมื่อสร้างไฟล์จริงแล้ว:
          <Stack.Screen name="search" options={{ title: 'Search' }} />
          <Stack.Screen name="categories" options={{ title: 'Categories' }} />
          <Stack.Screen name="favorites" options={{ title: 'My Favorites' }} />
      */}
    </Stack>
  )
}