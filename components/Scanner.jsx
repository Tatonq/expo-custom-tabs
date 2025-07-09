import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import useCartStore from '../stores/cartStore';

const Scanner = ({ onScanned }) => {
  const [barcode, setBarcode] = useState('');
  
  const activeCart = useCartStore(state => state.getActiveCart());

  const handleManualInput = () => {
    if (barcode.trim()) {
      if (onScanned) onScanned(barcode.trim());
      setBarcode('');
    } else {
      Alert.alert('กรุณาใส่รหัสสินค้า');
    }
  };

  // Always show manual input interface
  return (
    <View style={styles.container}>
      <View style={styles.scannerFrame}>
        <View style={styles.fallbackScanner}>
          <MaterialIcons name="qr-code-scanner" size={60} color="#64748b" />
          <Text style={styles.fallbackText}>กรอกรหัสสินค้า</Text>
          <Text style={styles.fallbackSubtext}>
            กรุณาใส่รหัสสินค้าด้วยตนเอง
          </Text>
          
          <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="ใส่รหัสสินค้า"
                value={barcode}
                onChangeText={setBarcode}
                keyboardType="numeric"
                returnKeyType="done"
                onSubmitEditing={handleManualInput}
              />
              <TouchableOpacity 
                style={styles.submitButton}
                onPress={handleManualInput}
              >
                <MaterialIcons name="check" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>
          
          {!activeCart && (
            <View style={styles.noCartOverlay}>
              <Text style={styles.noCartText}>กรุณาสร้างตะกร้าก่อนสแกนสินค้า</Text>
            </View>
          )}
        </View>
      </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  scannerFrame: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 12,
  },
  fallbackScanner: {
    flex: 1,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  fallbackText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748b',
    marginTop: 10,
    textAlign: 'center',
  },
  fallbackSubtext: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 5,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    marginTop: 20,
    width: '100%',
    maxWidth: 300,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: 'white',
  },
  submitButton: {
    backgroundColor: '#0891b2',
    borderRadius: 8,
    marginLeft: 8,
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noCartOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
  },
  noCartText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
});

export default Scanner;