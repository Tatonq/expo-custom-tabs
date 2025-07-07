import { Tabs } from 'expo-router';
import TabBar from '../../components/TabBar';

export default function AppLayout() {
  return (
    <Tabs tabBar={props => <TabBar {...props} />}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'หน้าหลัก',
        }}
      />
      <Tabs.Screen
        name="task"
        options={{
          title: 'งาน',
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: 'สแกน',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'โปรไฟล์',
        }}
      />
    </Tabs>
  );
}