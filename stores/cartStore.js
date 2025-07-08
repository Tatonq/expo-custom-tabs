// stores/cartStore.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { nanoid } from 'nanoid/non-secure';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

// สร้าง store สำหรับระบบตะกร้า
const useCartStore = create(
  persist(
    (set, get) => ({
      // สถานะ (State)
      // ปรับโครงสร้างให้แยกตามร้านค้า merchantId -> carts
      merchantCarts: {},        // { merchantId: { cartId: { cart data } } }
      activeCartId: null,       // รหัสตะกร้าที่เลือกใช้งานอยู่
      currentMerchantId: null,  // เก็บ merchantId ปัจจุบัน
      
      // การกระทำ (Actions)
      setCurrentMerchant: (merchantId) => set({ currentMerchantId: merchantId }),
      
      createCart: (merchantId, name = '', note = '', type = 'inStore') => {
        if (!merchantId) {
          console.warn('merchantId is required for createCart');
          return null;
        }
        
        const cartId = `cart-${merchantId}-${Date.now()}-${nanoid(4)}`;
        
        set((state) => {
          // ดึงตะกร้าที่มีอยู่ของร้านค้านี้ (หรือสร้าง object ใหม่)
          const merchantCartsObj = state.merchantCarts[merchantId] || {};
          const cartsCount = Object.keys(merchantCartsObj).length;
          const defaultName = `ตะกร้า ${cartsCount + 1}`;
          
          return {
            merchantCarts: {
              ...state.merchantCarts,
              [merchantId]: {
                ...merchantCartsObj,
                [cartId]: {
                  id: cartId,
                  merchantId: merchantId,
                  name: name || defaultName,
                  items: [],
                  total: 0,
                  createdAt: new Date().toISOString(),
                  note: note || '',
                  type: type,
                  notified: false,
                }
              }
            },
            activeCartId: cartId,
            currentMerchantId: merchantId,
          };
        });
        
        return cartId;
      },
      
      switchCart: (cartId) => {
        // ตรวจสอบว่ามีตะกร้านี้อยู่หรือไม่
        const state = get();
        const merchantId = state.currentMerchantId;
        if (!merchantId) return false;
        
        const merchantCarts = state.merchantCarts[merchantId] || {};
        if (!merchantCarts[cartId]) return false;
        
        set({ activeCartId: cartId });
        return true;
      },
      
      deleteCart: (cartId) => set((state) => {
        const merchantId = state.currentMerchantId;
        if (!merchantId) return state;
        
        const merchantCartsObj = {...state.merchantCarts[merchantId]};
        if (!merchantCartsObj[cartId]) return state;
        
        // ลบตะกร้า
        const { [cartId]: _, ...remainingCarts } = merchantCartsObj;
        
        // ถ้าลบตะกร้าที่กำลังใช้งานอยู่ ให้เลือกตะกร้าอื่นแทน
        let newActiveCartId = state.activeCartId;
        if (newActiveCartId === cartId) {
          const cartIds = Object.keys(remainingCarts);
          newActiveCartId = cartIds.length > 0 ? cartIds[0] : null;
        }
        
        return {
          merchantCarts: {
            ...state.merchantCarts,
            [merchantId]: remainingCarts
          },
          activeCartId: newActiveCartId,
        };
      }),
      
      renameCart: (cartId, name) => set((state) => {
        const merchantId = state.currentMerchantId;
        if (!merchantId) return state;
        
        const merchantCartsObj = state.merchantCarts[merchantId];
        if (!merchantCartsObj || !merchantCartsObj[cartId]) return state;
        
        return {
          merchantCarts: {
            ...state.merchantCarts,
            [merchantId]: {
              ...merchantCartsObj,
              [cartId]: {
                ...merchantCartsObj[cartId],
                name,
              }
            }
          }
        };
      }),
      
      updateCartType: (cartId, type) => set((state) => {
        const merchantId = state.currentMerchantId;
        if (!merchantId) return state;
        
        const merchantCartsObj = state.merchantCarts[merchantId];
        if (!merchantCartsObj || !merchantCartsObj[cartId]) return state;
        
        return {
          merchantCarts: {
            ...state.merchantCarts,
            [merchantId]: {
              ...merchantCartsObj,
              [cartId]: {
                ...merchantCartsObj[cartId],
                type,
              }
            }
          }
        };
      }),
      
      addCartNote: (cartId, note) => set((state) => {
        const merchantId = state.currentMerchantId;
        if (!merchantId) return state;
        
        const merchantCartsObj = state.merchantCarts[merchantId];
        if (!merchantCartsObj || !merchantCartsObj[cartId]) return state;
        
        return {
          merchantCarts: {
            ...state.merchantCarts,
            [merchantId]: {
              ...merchantCartsObj,
              [cartId]: {
                ...merchantCartsObj[cartId],
                note,
              }
            }
          }
        };
      }),
      
      markCartNotified: (cartId) => set((state) => {
        const merchantId = state.currentMerchantId;
        if (!merchantId) return state;
        
        const merchantCartsObj = state.merchantCarts[merchantId];
        if (!merchantCartsObj || !merchantCartsObj[cartId]) return state;
        
        return {
          merchantCarts: {
            ...state.merchantCarts,
            [merchantId]: {
              ...merchantCartsObj,
              [cartId]: {
                ...merchantCartsObj[cartId],
                notified: true,
              }
            }
          }
        };
      }),
      
      addToCart: (product) => set((state) => {
        const { activeCartId, currentMerchantId } = state;
        if (!activeCartId || !currentMerchantId) return state;
        
        const merchantCartsObj = state.merchantCarts[currentMerchantId];
        if (!merchantCartsObj) return state;
        
        const currentCart = merchantCartsObj[activeCartId];
        if (!currentCart) return state;
        
        const existingItemIndex = currentCart.items.findIndex(item => item.id === product.id);
        
        // สร้าง items array ใหม่ตามสถานการณ์
        let updatedItems;
        if (existingItemIndex >= 0) {
          // มีสินค้านี้อยู่แล้ว ให้เพิ่มจำนวน
          updatedItems = [...currentCart.items];
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity: updatedItems[existingItemIndex].quantity + 1
          };
        } else {
          // เป็นสินค้าใหม่ ให้เพิ่มเข้าไปในอาร์เรย์
          updatedItems = [...currentCart.items, { ...product, quantity: 1 }];
        }
        
        // คำนวณยอดรวมใหม่
        const newTotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        return {
          merchantCarts: {
            ...state.merchantCarts,
            [currentMerchantId]: {
              ...merchantCartsObj,
              [activeCartId]: {
                ...currentCart,
                items: updatedItems,
                total: newTotal,
              }
            }
          }
        };
      }),
      
      removeFromCart: (productId) => set((state) => {
        const { activeCartId, currentMerchantId } = state;
        if (!activeCartId || !currentMerchantId) return state;
        
        const merchantCartsObj = state.merchantCarts[currentMerchantId];
        if (!merchantCartsObj) return state;
        
        const currentCart = merchantCartsObj[activeCartId];
        if (!currentCart) return state;
        
        const updatedItems = currentCart.items.filter(item => item.id !== productId);
        
        // คำนวณยอดรวมใหม่
        const newTotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        return {
          merchantCarts: {
            ...state.merchantCarts,
            [currentMerchantId]: {
              ...merchantCartsObj,
              [activeCartId]: {
                ...currentCart,
                items: updatedItems,
                total: newTotal,
              }
            }
          }
        };
      }),
      
      updateQuantity: (productId, quantity) => set((state) => {
        const { activeCartId, currentMerchantId } = state;
        if (!activeCartId || !currentMerchantId) return state;
        
        const merchantCartsObj = state.merchantCarts[currentMerchantId];
        if (!merchantCartsObj) return state;
        
        const currentCart = merchantCartsObj[activeCartId];
        if (!currentCart) return state;
        
        let updatedItems;
        if (quantity <= 0) {
          // ลบสินค้าออกถ้าจำนวนน้อยกว่าหรือเท่ากับ 0
          updatedItems = currentCart.items.filter(item => item.id !== productId);
        } else {
          // อัปเดตจำนวนสินค้า
          updatedItems = currentCart.items.map(item =>
            item.id === productId ? { ...item, quantity } : item
          );
        }
        
        // คำนวณยอดรวมใหม่
        const newTotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        return {
          merchantCarts: {
            ...state.merchantCarts,
            [currentMerchantId]: {
              ...merchantCartsObj,
              [activeCartId]: {
                ...currentCart,
                items: updatedItems,
                total: newTotal,
              }
            }
          }
        };
      }),
      
      clearCart: () => set((state) => {
        const { activeCartId, currentMerchantId } = state;
        if (!activeCartId || !currentMerchantId) return state;
        
        const merchantCartsObj = state.merchantCarts[currentMerchantId];
        if (!merchantCartsObj) return state;
        
        const currentCart = merchantCartsObj[activeCartId];
        if (!currentCart) return state;
        
        return {
          merchantCarts: {
            ...state.merchantCarts,
            [currentMerchantId]: {
              ...merchantCartsObj,
              [activeCartId]: {
                ...currentCart,
                items: [],
                total: 0,
              }
            }
          }
        };
      }),
      
      checkoutCart: () => set((state) => {
        const { activeCartId, currentMerchantId } = state;
        if (!activeCartId || !currentMerchantId) return state;
        
        const merchantCartsObj = state.merchantCarts[currentMerchantId];
        if (!merchantCartsObj) return state;
        
        // ลบตะกร้าที่ชำระเงินแล้ว
        const { [activeCartId]: _, ...remainingCarts } = merchantCartsObj;
        
        // เลือกตะกร้าใหม่ (ถ้ามี)
        const cartIds = Object.keys(remainingCarts);
        const newActiveCartId = cartIds.length > 0 ? cartIds[0] : null;
        
        return {
          merchantCarts: {
            ...state.merchantCarts,
            [currentMerchantId]: remainingCarts
          },
          activeCartId: newActiveCartId,
        };
      }),
      
      // ล้างตะกร้าทั้งหมดของร้านค้า (เช่น เมื่อเปลี่ยนร้านค้า)
      resetMerchantCarts: (merchantId) => set((state) => ({
        merchantCarts: {
          ...state.merchantCarts,
          [merchantId]: {}
        },
        activeCartId: null,
      })),
      
      // ล้างข้อมูลทั้งหมด
      resetAll: () => set({
        merchantCarts: {},
        activeCartId: null,
        currentMerchantId: null,
      }),
      
      // Selectors (คำนวณค่าจาก state)
      getActiveCart: () => {
        const state = get();
        if (!state.activeCartId || !state.currentMerchantId) return null;
        
        const merchantCarts = state.merchantCarts[state.currentMerchantId];
        return merchantCarts ? merchantCarts[state.activeCartId] : null;
      },
      
      // ดึงจำนวนตะกร้าของร้านค้าที่เลือก
      getCartCount: () => {
        const state = get();
        if (!state.currentMerchantId) return 0;
        
        const merchantCarts = state.merchantCarts[state.currentMerchantId];
        return merchantCarts ? Object.keys(merchantCarts).length : 0;
      },
      
      // ดึงรายการตะกร้าทั้งหมดของร้านค้าที่เลือก
      getCartList: () => {
        const state = get();
        if (!state.currentMerchantId) return [];
        
        const merchantCarts = state.merchantCarts[state.currentMerchantId];
        return merchantCarts ? Object.values(merchantCarts) : [];
      },
      
      // ดึงรายการตะกร้าของร้านค้าที่เลือกเรียงตามเวลาสร้าง
      getOldestCarts: (limit = 3) => {
        const state = get();
        if (!state.currentMerchantId) return [];
        
        const merchantCarts = state.merchantCarts[state.currentMerchantId];
        if (!merchantCarts) return [];
        
        return Object.values(merchantCarts)
          .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
          .slice(0, limit);
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useCartStore;