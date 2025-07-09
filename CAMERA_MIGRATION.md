# การเปลี่ยนจาก expo-barcode-scanner ไปใช้ react-native-vision-camera

## ความเปลี่ยนแปลงที่สำคัญ

### 1. Library ที่เปลี่ยนไป
- ลบ: `expo-barcode-scanner`
- เพิ่มใหม่: `react-native-vision-camera`, `react-native-worklets-core`, `vision-camera-code-scanner`

### 2. ข้อดีของ react-native-vision-camera
- ประสิทธิภาพสูงกว่า (ใช้ Native C++ Frame Processors)
- รองรับ Barcode/QR Code หลากหลายประเภทมากกว่า
- มีการควบคุมกล้องที่ละเอียดกว่า (torch, zoom, flash, etc.)
- Active development และ community support ดีกว่า
- รองรับ advanced features เช่น face detection, object detection

### 3. ประเภท Barcode ที่รองรับ
- QR Code
- EAN-13, EAN-8
- UPC-A, UPC-E
- Code 128, Code 39, Code 93
- Codabar
- ITF (Interleaved 2 of 5)
- PDF417
- และอื่นๆ

### 4. สิ่งที่ต้องทำหลังจากการเปลี่ยนแปลง

#### สำหรับ Development Build
```bash
# Prebuild สำหรับ iOS และ Android
npx expo prebuild --clean

# Build development build
eas build --profile development --platform all
```

#### สำหรับ Production Build
```bash
# Build production
eas build --platform all
```

### 5. การตั้งค่า Permissions
การตั้งค่า permissions ได้ถูกอัปเดตใน `app.json` แล้ว:
- iOS: NSCameraUsageDescription
- Android: android.permission.CAMERA

### 6. API ที่เปลี่ยนแปลง

#### เดิม (expo-barcode-scanner)
```javascript
import { BarCodeScanner } from 'expo-barcode-scanner';

<BarCodeScanner
  onBarCodeScanned={handleBarCodeScanned}
  style={styles.scanner}
  flashMode={torchOn ? BarCodeScanner.Constants.FlashMode.torch : BarCodeScanner.Constants.FlashMode.off}
/>
```

#### ใหม่ (react-native-vision-camera)
```javascript
import { Camera, useCameraDevice, useCameraPermission, useCodeScanner } from 'react-native-vision-camera';

const device = useCameraDevice('back');
const { hasPermission, requestPermission } = useCameraPermission();

const codeScanner = useCodeScanner({
  codeTypes: ['qr', 'ean-13', 'ean-8', 'code-128', ...],
  onCodeScanned: (codes) => {
    // Handle scanned codes
  },
});

<Camera
  ref={cameraRef}
  style={styles.scanner}
  device={device}
  isActive={true}
  codeScanner={codeScanner}
  torch={torchOn ? 'on' : 'off'}
/>
```

### 7. หมายเหตุสำคัญ
- ต้องใช้ Development Build หรือ Custom Dev Client เพื่อทดสอบในโทรศัพท์จริง
- ไม่สามารถทดสอบใน Expo Go ได้ เนื่องจาก react-native-vision-camera ต้องการ native compilation
- Web fallback จะแสดงการป้อนข้อมูลด้วยตนเองแทนการสแกน

### 8. การ Debug
หากพบปัญหา สามารถตรวจสอบได้จาก:
1. Console logs ในแอป
2. Native logs (iOS: Xcode Console, Android: adb logcat)
3. ตรวจสอบ permissions ในการตั้งค่าของอุปกรณ์
