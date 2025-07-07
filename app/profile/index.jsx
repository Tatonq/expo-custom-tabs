import { AntDesign } from '@expo/vector-icons'
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import ColorList from '../../components/ColorList'
import { useAuth } from '../../utils/auth'

const Profile = () => {
  const { user, signOut } = useAuth()

  const handleLogout = () => {
    Alert.alert(
      'ออกจากระบบ',
      'คุณต้องการออกจากระบบหรือไม่?',
      [
        {
          text: 'ยกเลิก',
          style: 'cancel'
        },
        {
          text: 'ออกจากระบบ',
          style: 'destructive',
          onPress: () => signOut()
        }
      ]
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <AntDesign name="user" size={40} color="#ffffff" />
          </View>
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{user?.name || 'ชื่อผู้ใช้'}</Text>
            <Text style={styles.userEmail}>{user?.email || 'อีเมล'}</Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <AntDesign name="logout" size={20} color="#ffffff" />
          <Text style={styles.logoutText}>ออกจากระบบ</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <ColorList color="#4f46e5" />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#6366f1',
    padding: 20,
    paddingTop: 40,
    paddingBottom: 30,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#4f46e5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#e0e7ff',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dc2626',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logoutText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  content: {
    flex: 1,
    padding: 20,
  },
})

export default Profile