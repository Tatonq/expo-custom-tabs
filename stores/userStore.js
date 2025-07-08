// stores/userStore.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

const useUserStore = create(
  persist(
    (set, get) => ({
      // สถานะผู้ใช้
      employeeId: null,         // รหัสพนักงาน
      employeeName: null,       // ชื่อพนักงาน
      selectedMerchantId: null, // ร้านค้าที่เลือกปัจจุบัน
      accessibleMerchants: [],  // รายการร้านค้าที่เข้าถึงได้
      
      // การกระทำ
      setEmployeeInfo: (id, name) => set({ 
        employeeId: id, 
        employeeName: name 
      }),
      
      setSelectedMerchant: (merchantId) => set({
        selectedMerchantId: merchantId
      }),
      
      // เพิ่มร้านค้าที่เข้าถึงได้จากการ login
      setAccessibleMerchants: (merchants) => set({
        accessibleMerchants: merchants
      }),
      
      // ล้างข้อมูลทั้งหมดเมื่อ logout
      resetUserData: () => set({
        employeeId: null,
        employeeName: null,
        selectedMerchantId: null,
        accessibleMerchants: [],
      }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useUserStore;