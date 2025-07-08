import { createContext, useContext, useReducer } from 'react';

// สร้าง Context
const CartContext = createContext();

// Initial state
const initialState = {
  items: [],
  employeeId: null,
  total: 0,
};

// ตัว reducer สำหรับจัดการ state
function cartReducer(state, action) {
  switch (action.type) {
    case 'SET_EMPLOYEE':
      return { ...state, employeeId: action.payload };
    
    case 'ADD_TO_CART': {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        // อัปเดตจำนวนถ้ามีในตะกร้าอยู่แล้ว
        const updatedItems = state.items.map(item => 
          item.id === action.payload.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
        
        return { 
          ...state, 
          items: updatedItems,
          total: calculateTotal(updatedItems)
        };
      } else {
        // เพิ่มสินค้าใหม่เข้าตะกร้า
        const newItem = { ...action.payload, quantity: 1 };
        const updatedItems = [...state.items, newItem];
        
        return { 
          ...state, 
          items: updatedItems,
          total: calculateTotal(updatedItems)
        };
      }
    }
    
    case 'REMOVE_FROM_CART': {
      const updatedItems = state.items.filter(item => item.id !== action.payload);
      return { 
        ...state, 
        items: updatedItems,
        total: calculateTotal(updatedItems)
      };
    }
    
    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;
      
      if (quantity <= 0) {
        // ลบสินค้าออกถ้าจำนวนน้อยกว่าหรือเท่ากับ 0
        const updatedItems = state.items.filter(item => item.id !== id);
        return { 
          ...state, 
          items: updatedItems,
          total: calculateTotal(updatedItems)
        };
      }
      
      const updatedItems = state.items.map(item =>
        item.id === id ? { ...item, quantity } : item
      );
      
      return { 
        ...state, 
        items: updatedItems,
        total: calculateTotal(updatedItems)
      };
    }
    
    case 'CLEAR_CART':
      return { ...state, items: [], total: 0 };
    
    default:
      return state;
  }
}

// คำนวณยอดรวมสินค้าในตะกร้า
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// Provider component
export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  
  // ฟังก์ชันสำหรับจัดการตะกร้า
  const setEmployeeId = (id) => {
    dispatch({ type: 'SET_EMPLOYEE', payload: id });
  };
  
  const addToCart = (product) => {
    dispatch({ type: 'ADD_TO_CART', payload: product });
  };
  
  const removeFromCart = (productId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  };
  
  const updateQuantity = (productId, quantity) => {
    dispatch({ 
      type: 'UPDATE_QUANTITY', 
      payload: { id: productId, quantity }
    });
  };
  
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };
  
  const value = {
    items: state.items,
    employeeId: state.employeeId,
    total: state.total,
    setEmployeeId,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };
  
  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

// Custom hook สำหรับเรียกใช้งาน context
export const useCart = () => useContext(CartContext);