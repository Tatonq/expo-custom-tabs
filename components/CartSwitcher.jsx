import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import {
    Alert,
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import useCartStore from '../stores/cartStore';
import useUserStore from '../stores/userStore';

// ฟังก์ชันฟอร์แมตวันที่เวลา
const formatTime = (dateString) => {
  const date = new Date(dateString);
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
};

// คอมโพเนนต์ CartSwitcher
const CartSwitcher = () => {
  // ดึงข้อมูลร้านค้า
  const selectedMerchantId = useUserStore(state => state.selectedMerchantId);
  const accessibleMerchants = useUserStore(state => state.accessibleMerchants);
  
  // หาร้านค้าที่เลือกจาก id
  const selectedMerchant = accessibleMerchants.find(
    merchant => merchant.id === selectedMerchantId
  );
  
  // ดึงข้อมูลและฟังก์ชันจาก Zustand store
  const activeCartId = useCartStore(state => state.activeCartId);
  const cartList = useCartStore(state => state.getCartList());
  const cartCount = useCartStore(state => state.getCartCount());
  const createCart = useCartStore(state => state.createCart);
  const switchCart = useCartStore(state => state.switchCart);
  const deleteCart = useCartStore(state => state.deleteCart);
  const renameCart = useCartStore(state => state.renameCart);
  const addCartNote = useCartStore(state => state.addCartNote);
  const updateCartType = useCartStore(state => state.updateCartType);
  const activeCart = useCartStore(state => state.getActiveCart());
  
  // state สำหรับ UI
  const [modalVisible, setModalVisible] = useState(false);
  const [newCartName, setNewCartName] = useState('');
  const [newCartNote, setNewCartNote] = useState('');
  const [newCartType, setNewCartType] = useState('inStore');
  const [noteModalVisible, setNoteModalVisible] = useState(false);
  const [selectedCartId, setSelectedCartId] = useState(null);
  const [cartNote, setCartNote] = useState('');
  const [renameMode, setRenameMode] = useState(false);
  const [cartToRename, setCartToRename] = useState(null);
  const [newName, setNewName] = useState('');

  // สร้างตะกร้าใหม่
  const handleCreateCart = () => {
    if (!selectedMerchant) {
      Alert.alert('ข้อผิดพลาด', 'กรุณาเลือกร้านค้าก่อน');
      return;
    }
    
    const name = newCartName.trim() || `ตะกร้า ${cartCount + 1}`;
    createCart(selectedMerchant.id, name, newCartNote, newCartType);
    setNewCartName('');
    setNewCartNote('');
    setNewCartType('inStore');
    setModalVisible(false);
  };

  // ลบตะกร้า
  const handleDeleteCart = (cartId) => {
    Alert.alert(
      'ยืนยันการลบตะกร้า',
      'คุณต้องการลบตะกร้านี้หรือไม่? รายการสินค้าทั้งหมดจะหายไป',
      [
        { text: 'ยกเลิก' },
        { 
          text: 'ลบ', 
          style: 'destructive',
          onPress: () => deleteCart(cartId) 
        }
      ]
    );
  };

  // เปิด modal สำหรับเพิ่ม/แก้ไขบันทึก
  const openNoteModal = (cartId) => {
    setSelectedCartId(cartId);
    
    // หาตะกร้าที่ต้องการจาก cartList
    const selectedCart = cartList.find(cart => cart.id === cartId);
    setCartNote(selectedCart?.note || '');
    
    setNoteModalVisible(true);
  };

  // บันทึกโน้ต
  const saveNote = () => {
    if (selectedCartId) {
      addCartNote(selectedCartId, cartNote);
      setNoteModalVisible(false);
    }
  };

  // เปิด modal สำหรับเปลี่ยนชื่อตะกร้า
  const openRenameModal = (cartId) => {
    setCartToRename(cartId);
    
    // หาตะกร้าที่ต้องการจาก cartList
    const selectedCart = cartList.find(cart => cart.id === cartId);
    setNewName(selectedCart?.name || '');
    
    setRenameMode(true);
  };

  // เปลี่ยนชื่อตะกร้า
  const handleRenameCart = () => {
    if (cartToRename && newName.trim()) {
      renameCart(cartToRename, newName.trim());
      setRenameMode(false);
      setCartToRename(null);
    }
  };

  // ฟังก์ชันแสดงไอคอนตามประเภทตะกร้า
  const getCartTypeIcon = (type) => {
    switch (type) {
      case 'inStore': return <FontAwesome5 name="store" size={14} color="#0891b2" />;
      case 'takeAway': return <MaterialIcons name="delivery-dining" size={16} color="#10b981" />;
      case 'reserved': return <MaterialIcons name="event" size={16} color="#8b5cf6" />;
default: return <FontAwesome5 name="shopping-basket" size={14} color="#64748b" />;
    }
  };

  // Render รายการตะกร้าแต่ละรายการ
  const renderCartItem = ({ item }) => {
    const isActive = item.id === activeCartId;
    
    const cartTypeColors = {
      inStore: '#0891b2',
      takeAway: '#10b981',
      reserved: '#8b5cf6',
      default: '#64748b'
    };
    
    const borderColor = cartTypeColors[item.type] || cartTypeColors.default;
    
    return (
      <TouchableOpacity
        style={[
          styles.cartItem, 
          isActive && styles.activeCartItem,
          { borderLeftColor: borderColor }
        ]}
        onPress={() => {
          switchCart(item.id);
          setModalVisible(false);
        }}
      >
        <View style={styles.cartInfo}>
          <View style={styles.cartHeader}>
            <Text style={[styles.cartName, isActive && styles.activeText]}>
              {item.name}
            </Text>
            {getCartTypeIcon(item.type)}
          </View>
          
          <Text style={styles.cartDetails}>
            {item.items.length} รายการ | ฿{item.total.toLocaleString()}
          </Text>
          
          <View style={styles.cartMeta}>
            <MaterialIcons name="access-time" size={12} color="#64748b" />
            <Text style={styles.cartTime}>{formatTime(item.createdAt)}</Text>
          </View>
          
          {item.note ? (
            <View style={styles.noteTag}>
              <MaterialIcons name="note" size={12} color="#f59e0b" />
              <Text style={styles.noteText} numberOfLines={1}>{item.note}</Text>
            </View>
          ) : null}
        </View>
        
        <View style={styles.cartActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => openNoteModal(item.id)}
          >
            <MaterialIcons name="note-add" size={22} color="#64748b" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => openRenameModal(item.id)}
          >
            <MaterialIcons name="edit" size={22} color="#64748b" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleDeleteCart(item.id)}
          >
            <MaterialIcons name="delete" size={22} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  // รายการประเภทตะกร้า
  const cartTypes = [
    { id: 'inStore', label: 'ขายหน้าร้าน', color: '#0891b2', icon: 'store' },
    { id: 'takeAway', label: 'สั่งกลับบ้าน', color: '#10b981', icon: 'delivery-dining' },
    { id: 'reserved', label: 'จองล่วงหน้า', color: '#8b5cf6', icon: 'event' }
  ];

  if (!selectedMerchant) {
    return (
      <View style={styles.noMerchant}>
        <Text style={styles.noMerchantText}>กรุณาเลือกร้านค้า</Text>
      </View>
    );
  }

  return (
    <>
      <TouchableOpacity 
        style={styles.switcherButton}
        onPress={() => setModalVisible(true)}
      >
        <FontAwesome5 
          name="shopping-basket" 
          size={18} 
          color={activeCart?.type === 'takeAway' ? '#10b981' : 
                activeCart?.type === 'reserved' ? '#8b5cf6' : '#0891b2'} 
        />
        <View style={[
          styles.cartCountBadge,
          {backgroundColor: activeCart?.type === 'takeAway' ? '#10b981' : 
                            activeCart?.type === 'reserved' ? '#8b5cf6' : '#0891b2'}
        ]}>
          <Text style={styles.cartCountText}>{cartCount}</Text>
        </View>
        <Text style={styles.switcherText}>
          {activeCart ? activeCart.name : 'เลือกตะกร้า'}
        </Text>
        <MaterialIcons name="keyboard-arrow-down" size={22} color="#0891b2" />
      </TouchableOpacity>

      {/* Modal สำหรับการสลับตะกร้า */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.
modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>จัดการตะกร้า - {selectedMerchant.name}</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <MaterialIcons name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            {cartList.length > 0 ? (
              <FlatList
                data={cartList}
                renderItem={renderCartItem}
                keyExtractor={(item) => item.id}
                style={styles.cartList}
              />
            ) : (
              <Text style={styles.emptyText}>ไม่มีตะกร้า กรุณาสร้างตะกร้าใหม่</Text>
            )}

            <View style={styles.newCartSection}>
              <Text style={styles.sectionTitle}>สร้างตะกร้าใหม่</Text>
              
              <TextInput
                style={styles.input}
                placeholder="ชื่อตะกร้า (เช่น โต๊ะ 5, คุณสมชาย)"
                value={newCartName}
                onChangeText={setNewCartName}
              />
              
              <TextInput
                style={[styles.input, { height: 80 }]}
                placeholder="บันทึกเพิ่มเติม (ถ้ามี)"
                value={newCartNote}
                onChangeText={setNewCartNote}
                multiline
                numberOfLines={3}
              />
              
              <Text style={styles.inputLabel}>ประเภทตะกร้า</Text>
              <View style={styles.cartTypeSelector}>
                {cartTypes.map(type => (
                  <TouchableOpacity
                    key={type.id}
                    style={[
                      styles.cartTypeOption,
                      newCartType === type.id && { backgroundColor: type.color + '20', borderColor: type.color }
                    ]}
                    onPress={() => setNewCartType(type.id)}
                  >
                    {type.id === 'inStore' ? (
                      <FontAwesome5 name={type.icon} size={16} color={type.color} />
                    ) : (
                      <MaterialIcons name={type.icon} size={18} color={type.color} />
                    )}
                    <Text 
                      style={[
                        styles.cartTypeText, 
                        newCartType === type.id && { color: type.color }
                      ]}
                    >
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              <TouchableOpacity 
                style={styles.createButton}
                onPress={handleCreateCart}
              >
                <MaterialIcons name="add-shopping-cart" size={22} color="white" />
                <Text style={styles.createButtonText}>สร้างตะกร้าใหม่</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal สำหรับการเพิ่มบันทึก */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={noteModalVisible}
        onRequestClose={() => setNoteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { height: 'auto' }]}>
            <Text style={styles.modalTitle}>เพิ่มบันทึกสำหรับตะกร้านี้</Text>
            
            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder="เพิ่มบันทึก เช่น ชื่อลูกค้า, โต๊ะที่นั่ง"
              value={cartNote}
              onChangeText={setCartNote}
              multiline
              numberOfLines={4}
            />
            
            <View style={styles.buttonRow}>
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton]}
                onPress={() => setNoteModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>ยกเลิก</Text>
</TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.button, styles.saveButton]}
                onPress={saveNote}
              >
                <Text style={styles.saveButtonText}>บันทึก</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal สำหรับเปลี่ยนชื่อตะกร้า */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={renameMode}
        onRequestClose={() => setRenameMode(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { height: 'auto' }]}>
            <Text style={styles.modalTitle}>เปลี่ยนชื่อตะกร้า</Text>
            
            <TextInput
              style={styles.input}
              placeholder="ชื่อตะกร้าใหม่"
              value={newName}
              onChangeText={setNewName}
            />
            
            <View style={styles.buttonRow}>
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton]}
                onPress={() => setRenameMode(false)}
              >
                <Text style={styles.cancelButtonText}>ยกเลิก</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.button, styles.saveButton]}
                onPress={handleRenameCart}
              >
                <Text style={styles.saveButtonText}>บันทึก</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  noMerchant: {
    padding: 15,
    alignItems: 'center',
  },
  noMerchantText: {
    color: '#64748b',
    fontSize: 16,
  },
  switcherButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginVertical: 10,
    marginHorizontal: 15,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cartCountBadge: {
    backgroundColor: '#0891b2',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },
  cartCountText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  switcherText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 10,
    color: '#1e293b',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  closeButton: {
    padding: 5,
  },
  cartList: {
    maxHeight: 300,
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#f8fafc',
    borderLeftWidth: 4,
    borderLeftColor: '#64748b',
  },
  activeCartItem: {
    backgroundColor: '#e0f2fe',
  },
  cartInfo: {
    flex: 1,
  },
  cartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartName: {
    fontSize: 16,
    fontWeight: '500',
    marginRight: 8,
  },
  activeText: {
    color: '#0891b2',
    fontWeight: 'bold',
  },
  cartDetails: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  cartMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  cartTime: {
    fontSize: 12,
    color: '#64748b',
    marginLeft: 4,
  },
  noteTag: {
    flexDirection: 'row',
    alignItems: 'center',
backgroundColor: '#fffbeb',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
    marginTop: 6,
    alignSelf: 'flex-start',
  },
  noteText: {
    fontSize: 12,
    color: '#92400e',
    marginLeft: 4,
    maxWidth: 150,
  },
  cartActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#64748b',
    marginVertical: 20,
  },
  newCartSection: {
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#334155',
  },
  inputLabel: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 8,
    marginTop: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  cartTypeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  cartTypeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
    justifyContent: 'center',
  },
  cartTypeText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#475569',
  },
  createButton: {
    backgroundColor: '#0891b2',
    flexDirection: 'row',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f1f5f9',
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: '#0891b2',
  },
  cancelButtonText: {
    color: '#64748b',
    fontSize: 16,
    fontWeight: '500',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default CartSwitcher;