import { Tabs } from 'expo-router'
import TabBar from '../components/TabBar'

const _layout = () => {
  return (
    <Tabs 
      tabBar={props => <TabBar {...props} />}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          // tabBarIcon: 'home',
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          // tabBarIcon: 'palette',
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: 'Create',
          // tabBarIcon: 'cog',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          // tabBarIcon: 'cog',
        }}
      />
    </Tabs>
  )
}

export default _layout