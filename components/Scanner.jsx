import { MaterialIcons } from '@expo/vector-icons';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Vibration,
  View
} from 'react-native';
import useCartStore from '../stores/cartStore';

const Scanner = ({ onScanned }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  
  const activeCart = useCartStore(state => state.getActiveCart());

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    
    // สั่นเครื่องเมื่อสแกนสำเร็จ
    Vibration.vibrate(200);
    
    // ส่งข้อมูลบาร์โค้ดไปยัง parent component
    if (onScanned) onScanned(data);
  };

  const toggleTorch = () => {
    setTorchOn(!torchOn);
  };

  if (hasPermission === null) {
    return <Text style={styles.message}>กำลังขออนุญาตการใช้กล้อง...</Text>;
  }
  
  if (hasPermission === false) {
    return <Text style={styles.message}>ไม่ได้รับอนุญาตให้ใช้กล้อง</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.scannerFrame}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={styles.scanner}
          flashMode={torchOn ? 'torch' : 'off'}
        />
        {!activeCart && (
          <View style={styles.noCartOverlay}>
            <Text style={styles.noCartText}>กรุณาสร้างตะกร้าก่อนสแกนสินค้า</Text>
          </View>
        )}
        <View style={styles.scannerGuide}>
          <View style={styles.guideLine} />
          <View style={styles.guideCorners}>
            <View style={[styles.guideCorner, styles.topLeft]} />
            <View style={[styles.guideCorner, styles.topRight]} />
            <View style={[styles.guideCorner, styles.bottomLeft]} />
            <View style={[styles.guideCorner, styles.bottomRight]} />
          </View>
        </View>
        
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
      
      {scanned && (
        <TouchableOpacity 
          style={styles.rescanButton}
          onPress={() => setScanned(false)}
        >
          <MaterialIcons name="refresh" size={20} color="white" />
          <Text style={styles.rescanText}>สแกนอีกครั้ง</Text>
        </TouchableOpacity>
      )}
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
  scanner: {
    ...StyleSheet.absoluteFillObject,
  },
  message: {
    textAlign: 'center',
    color: '#64748b',
    fontSize: 16,
    margin: 20,
  },
  scannerGuide: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  guideLine: {
    width: '60%',
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  guideCorners: {
    ...StyleSheet.absoluteFillObject,
    padding: 40,
  },
  guideCorner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: '#0891b2',
    borderWidth: 3,
  },
  topLeft: {
    top: 40,
    left: 40,
    borderBottomWidth: 0,
    borderRightWidth: 0,
  },
  topRight: {
    top: 40,
    right: 40,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
  },
  bottomLeft: {
    bottom: 40,
    left: 40,
    borderTopWidth: 0,
    borderRightWidth: 0,
  },
  bottomRight: {
    bottom: 40,
    right: 40,
    borderTopWidth: 0,
borderLeftWidth: 0,
  },
  noCartOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noCartText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  torchButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
  },
  rescanButton: {
    flexDirection: 'row',
    backgroundColor: '#0891b2',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  rescanText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
});

export default Scanner;