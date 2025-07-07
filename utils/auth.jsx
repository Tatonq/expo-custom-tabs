// utils/auth.jsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // โหลดข้อมูล user จาก AsyncStorage เมื่อ app เริ่มต้น
  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email, password) => {
    try {
      // จำลอง API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // ตรวจสอบ credentials (ในแอปจริงจะเรียก API)
      if (email === 'admin@example.com' && password === 'password') {
        const userData = {
          id: 1,
          email: email,
          name: 'Admin User',
          createdAt: new Date().toISOString(),
        };
        
        await AsyncStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        return userData;
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      throw error;
    }
  };

  const signUp = async (email, password, name) => {
    try {
      // จำลอง API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const userData = {
        id: Date.now(),
        email: email,
        name: name,
        createdAt: new Date().toISOString(),
      };
      
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return userData;
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const resetPassword = async (email) => {
    try {
      // จำลอง API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // ในแอปจริงจะส่งอีเมลรีเซ็ตรหัสผ่าน
      console.log('Reset password email sent to:', email);
      return true;
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signIn,
        signUp,
        signOut,
        resetPassword,
        // เก็บฟังก์ชันเก่าไว้เพื่อ backward compatibility
        login: signIn,
        logout: signOut,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);