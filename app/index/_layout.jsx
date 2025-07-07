import { Stack } from 'expo-router'

export default function HomeLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#10b981', // สีเขียวสดใส
          borderBottomWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 20,
          color: '#ffffff',
        },
        headerTitleAlign: 'left',
        animation: 'slide_from_left',
        contentStyle: {
          backgroundColor: '#f0fdf4',
        },
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'Welcome Home',
          headerShown: true,
          headerStyle: {
            backgroundColor: '#10b981',
          },
        }} 
      />
      {/* เพิ่ม screens อื่นๆ เมื่อสร้างไฟล์จริงแล้ว:
          <Stack.Screen name="notifications" options={{ title: 'Notifications' }} />
          <Stack.Screen name="details" options={{ title: 'Details' }} />
      */}
    </Stack>
  )
}
//         options={{
//           title: 'Profile',
//           // tabBarIcon: 'cog',
//         }}
//       />
//     </Tabs>
//   )
// }

// export default _layout