// Mock data สำหรับร้านค้า
export const mockMerchants = [
  {
    id: 'merchant-001',
    name: 'คาเฟ่และเบเกอรี่',
    type: 'food',
    logo: 'https://via.placeholder.com/100?text=Cafe',
    color: '#10b981',  // สีเขียว
    description: 'ร้านกาแฟ ชา และขนมเบเกอรี่'
  },
  {
    id: 'merchant-002',
    name: 'วัสดุก่อสร้างครบวงจร',
    type: 'construction',
    logo: 'https://via.placeholder.com/100?text=BuildingSupply',
    color: '#f59e0b',  // สีส้ม
    description: 'จำหน่ายวัสดุก่อสร้างและอุปกรณ์สำหรับงานช่าง'
  }
];

// Mock data สำหรับการเข้าถึงร้านค้า
export const mockEmployeeAccess = {
  'emp1234': [
    'merchant-001', // พนักงาน emp1234 เข้าถึงร้านค้า merchant-001 ได้
    'merchant-002'  // พนักงาน emp1234 เข้าถึงร้านค้า merchant-002 ได้
  ],
  'emp5678': [
    'merchant-001'  // พนักงาน emp5678 เข้าถึงร้านค้า merchant-001 เท่านั้น
  ]
};

// Mock function สำหรับการตรวจสอบสิทธิ์การเข้าถึงร้านค้า
export const mockCheckEmployeeAccess = (employeeId) => {
  if (!employeeId) return [];
  
  const accessibleMerchantIds = mockEmployeeAccess[employeeId] || [];
  return mockMerchants.filter(merchant => 
    accessibleMerchantIds.includes(merchant.id)
  );
};