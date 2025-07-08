// stores/productsStore.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

// สร้าง store สำหรับสินค้า
const useProductsStore = create(
  persist(
    (set, get) => ({
      // สถานะ (State)
      products: {}, // { merchantId: [products] }
      
      // การกระทำ (Actions)
      setMerchantProducts: (merchantId, products) => set((state) => ({
        products: {
          ...state.products,
          [merchantId]: products
        }
      })),
      
      // Mock data สำหรับทดสอบ
      initMockData: () => {
        set({
          products: {
            // ร้านอาหารและเครื่องดื่ม
            'merchant-001': [
              { id: '001', name: 'อเมริกาโน่', price: 55, category: 'coffee', image: 'https://via.placeholder.com/100?text=Coffee' },
              { id: '002', name: 'ลาเต้', price: 60, category: 'coffee', image: 'https://via.placeholder.com/100?text=Latte' },
              { id: '003', name: 'ชาเขียวนม', price: 50, category: 'tea', image: 'https://via.placeholder.com/100?text=Tea' },
              { id: '004', name: 'ชานมไข่มุก', price: 65, category: 'tea', image: 'https://via.placeholder.com/100?text=BubbleTea' },
              { id: '005', name: 'เค้กช็อกโกแลต', price: 75, category: 'bakery', image: 'https://via.placeholder.com/100?text=Cake' },
              { id: '006', name: 'คุกกี้', price: 35, category: 'bakery', image: 'https://via.placeholder.com/100?text=Cookie' },
              { id: '007', name: 'น้ำส้ม', price: 45, category: 'juice', image: 'https://via.placeholder.com/100?text=Orange' },
              { id: '008', name: 'น้ำแอปเปิ้ล', price: 45, category: 'juice', image: 'https://via.placeholder.com/100?text=Apple' },
            ],
            
            // ร้านวัสดุก่อสร้าง
            'merchant-002': [
              { id: '101', name: 'ปูนซีเมนต์ 50kg', price: 150, category: 'cement', image: 'https://via.placeholder.com/100?text=Cement' },
              { id: '102', name: 'ทรายละเอียด 50kg', price: 60, category: 'sand', image: 'https://via.placeholder.com/100?text=Sand' },
              { id: '103', name: 'อิฐบล็อก 10cm', price: 7, category: 'brick', image: 'https://via.placeholder.com/100?text=Block' },
              { id: '104', name: 'ท่อ PVC 4"', price: 120, category: 'pipe', image: 'https://via.placeholder.com/100?text=PVC' },
              { id: '105', name: 'สีน้ำภายนอก 5L', price: 850, category: 'paint', image: 'https://via.placeholder.com/100?text=Paint' },
              { id: '106', name: 'ตะปู 1kg', price: 65, category: 'tools', image: 'https://via.placeholder.com/100?text=Nail' },
              { id: '107', name: 'ค้อน', price: 250, category: 'tools', image: 'https://via.placeholder.com/100?text=Hammer' },
              { id: '108', name: 'สว่านไฟฟ้า', price: 1500, category: 'tools', image: 'https://via.placeholder.com/100?text=Drill' },
            ]
          }
        });
      },
      
      // ค้นหาสินค้าโดยรหัสบาร์โค้ดหรือรหัสสินค้า
      findProductByBarcode: (merchantId, barcode) => {
        const merchantProducts = get().products[merchantId];
        if (!merchantProducts) return null;
        
        // สมมติว่าในกรณีนี้ barcode = id ของสินค้า
        return merchantProducts.find(p => p.id === barcode);
      },
      
      // ค้นหาสินค้าโดยชื่อ (ใช้สำหรับการค้นหา)
      searchProducts: (merchantId, query) => {
        const merchantProducts = get().products[merchantId];
        if (!merchantProducts) return [];
        
        const lowerQuery = query.toLowerCase();
        return merchantProducts.filter(p => 
          p.name.toLowerCase().includes(lowerQuery) ||
          p.category.toLowerCase().includes(lowerQuery)
        );
      },
      
      // ดึงสินค้าตามหมวดหมู่
      getProductsByCategory: (merchantId, category) => {
        const merchantProducts = get().products[merchantId];
        if (!merchantProducts) return [];
        
        return merchantProducts.filter(p => p.category === category);
      },
      // ดึงรายการหมวดหมู่สินค้าทั้งหมด
      getCategories: (merchantId) => {
        const merchantProducts = get().products[merchantId];
        if (!merchantProducts) return [];
        
        const categories = new Set(merchantProducts.map(p => p.category));
        return Array.from(categories);
      },
    }),
    {
      name: 'products-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useProductsStore;