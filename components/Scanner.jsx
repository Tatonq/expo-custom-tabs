import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import useCartStore from '../stores/cartStore';

// Conditionally import BarCodeScanner and handle errors
let BarCodeScanner;
try {
  BarCodeScanner = require('expo-barcode-scanner').BarCodeScanner;
} catch (error) {
  console.warn('BarCodeScanner not available:', error);
  BarCodeScanner = null;
}

const Scanner = ({ onScanned }) => {
  const [barcode, setBarcode] = useState('');
  const [torchOn, setTorchOn] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [useFallback, setUseFallback] = useState(!BarCodeScanner);
  
  const activeCart = useCartStore(state => state.getActiveCart());

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      if (!BarCodeScanner) {
        setUseFallback(true);
        return;
      }

      try {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setHasPermission(status === 'granted');
        if (status !== 'granted') {
          setUseFallback(true);
        }
      } catch (error) {
        console.warn('Camera permission request failed:', error);
        setUseFallback(true);
      }
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    if (onScanned) onScanned(data);
    // Reset scanned state after a delay to allow for continuous scanning
    setTimeout(() => setScanned(false), 2000);
  };

  const handleManualInput = () => {
    if (barcode.trim()) {
      if (onScanned) onScanned(barcode.trim());
      setBarcode('');
    } else {
      Alert.alert('กรุณาใส่รหัสสินค้า');
    }
  };

  const toggleTorch = () => {
    setTorchOn(!torchOn);
  };

  // Show fallback scanner if BarCodeScanner is not available, permission is denied, or there's an issue
  if (!BarCodeScanner || hasPermission === null || useFallback) {
    const fallbackReason = !BarCodeScanner 
      ? 'ไม่สามารถใช้งานกล้องได้ในโหมดพัฒนา' 
      : hasPermission === null 
        ? 'กำลังขอสิทธิ์กล้อง...' 
        : 'ไม่สามารถเข้าถึงกล้องได้';

    return (
      <View style={styles.container}>
        <View style={styles.scannerFrame}>
          <View style={styles.fallbackScanner}>
            <MaterialIcons name="qr-code-scanner" size={60} color="#64748b" />
            <Text style={styles.fallbackText}>{fallbackReason}</Text>
            <Text style={styles.fallbackSubtext}>
              {!BarCodeScanner ? 'ใช้ development build เพื่อใช้งานกล้อง' : 'กรุณาใส่รหัสสินค้าด้วยตนเอง'}
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
  }

  return (
    <View style={styles.container}>
      <View style={styles.scannerFrame}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={styles.scanner}
          flashMode={torchOn ? BarCodeScanner.Constants.FlashMode.torch : BarCodeScanner.Constants.FlashMode.off}
        />
        
        <View style={styles.overlay}>
          <View style={styles.scanArea}>
            <View style={styles.corner} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>
          
          <Text style={styles.scanText}>
            {scanned ? 'สแกนเสร็จแล้ว!' : 'นำกล้องไปจ่อที่บาร์โค้ด'}
          </Text>
        </View>
        
        {!activeCart && (
          <View style={styles.noCartOverlay}>
            <Text style={styles.noCartText}>กรุณาสร้างตะกร้าก่อนสแกนสินค้า</Text>
          </View>
        )}
        
        <TouchableOpacity 
          style={styles.torchButton}
          onPress={toggleTorch}
        >
          <MaterialIcons 
            name={torchOn ? "flashlight-off" : "flashlight-on"} 
            size={24} 
            color="white" 
          />
        </TouchableOpacity>
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
  scanner: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: 200,
    height: 200,
    position: 'relative',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: 12,
  },
  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: '#0891b2',
    borderWidth: 3,
    top: -3,
    left: -3,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: -3,
    right: -3,
    left: 'auto',
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderRightWidth: 3,
  },
  bottomLeft: {
    bottom: -3,
    left: -3,
    top: 'auto',
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomWidth: 3,
  },
  bottomRight: {
    bottom: -3,
    right: -3,
    top: 'auto',
    left: 'auto',
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderRightWidth: 3,
    borderBottomWidth: 3,
  },
  scanText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 20,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  torchButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 30,
    padding: 12,
    zIndex: 10,
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