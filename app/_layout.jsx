// import { Tabs } from 'expo-router'
// import TabBar from '../components/TabBar'

// export default function RootLayout() {
//   return (
//     <Tabs 
//       tabBar={props => <TabBar {...props} />}
//       screenOptions={{
//         headerShown: false, // ซ่อน header ของ Tabs เพื่อให้ Stack ใน tab แสดง header
//         tabBarHideOnKeyboard: true, // ซ่อน tab bar เมื่อเปิดคีย์บอร์ด
//       }}
//     >
//       <Tabs.Screen
//         name="index"
//         options={{
//           title: 'Home',
//           tabBarLabel: 'Home',
//           href: '/index',
//         }}
//       />
//       <Tabs.Screen
//         name="explore"
//         options={{
//           title: 'Explore',
//           tabBarLabel: 'Explore',
//           href: '/explore',
//         }}
//       />
//       <Tabs.Screen
//         name="create"
//         options={{
//           title: 'Create',
//           tabBarLabel: 'Create',
//           href: '/create',
//         }}
//       />
//       <Tabs.Screen
//         name="profile"
//         options={{
//           title: 'Profile',
//           tabBarLabel: 'Profile',
//           href: '/profile',
//         }}
//       />
//     </Tabs>
//   )
// }

import { Slot, Tabs, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import TabBar from '../components/TabBar';
import { AuthProvider, useAuth } from '../utils/auth';

// สร้างฟังก์ชัน Context สำหรับการจัดการ authentication
function RootLayoutNav() {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // รอจนกว่าจะโหลดข้อมูล user เสร็จ
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    // ถ้าไม่มี user และไม่ได้อยู่ในกลุ่ม auth ให้นำทางไปหน้า login
    if (!user && !inAuthGroup) {
      router.replace('/login');
    } else if (user && inAuthGroup) {
      // ถ้ามี user แล้วแต่ยังอยู่ในหน้า login ให้นำทางไปหน้าหลัก
      router.replace('/');
    }
  }, [user, segments, isLoading]);

  // ถ้ายังโหลดอยู่ให้แสดง loading
  if (isLoading) {
    return <Slot />;
  }

  // ถ้าไม่มี user แสดงหน้า auth
  if (!user) {
    return <Slot />;
  }

  // ถ้ามี user แล้วแสดง Tabs layout
  return (
    <Tabs 
      tabBar={props => <TabBar {...props} />}
      screenOptions={{
        headerShown: false, // ซ่อน header ของ Tabs เพื่อให้ Stack ใน tab แสดง header
        tabBarHideOnKeyboard: true, // ซ่อน tab bar เมื่อเปิดคีย์บอร์ด
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarLabel: 'Home',
          href: '/index',
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarLabel: 'Explore',
          href: '/explore',
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: 'Create',
          tabBarLabel: 'Create',
          href: '/create',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarLabel: 'Profile',
          href: '/profile',
        }}
      />
    </Tabs>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}