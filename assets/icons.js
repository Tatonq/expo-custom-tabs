import { AntDesign, Feather } from "@expo/vector-icons";

export const icons = {
    index: (props)=> <AntDesign name="home" size={26} {...props} />,
    explore: (props)=> <Feather name="compass" size={26} {...props} />,
    create: (props)=> <AntDesign name="pluscircleo" size={26} {...props} />,
    profile: (props)=> <AntDesign name="user" size={26} {...props} />,
    // เพิ่มชื่อแทนที่อื่นๆ ที่อาจเกิดขึ้น
    home: (props)=> <AntDesign name="home" size={26} {...props} />,
    '(auth)': (props)=> <AntDesign name="login" size={26} {...props} />,
    login: (props)=> <AntDesign name="login" size={26} {...props} />,
    register: (props)=> <AntDesign name="adduser" size={26} {...props} />,
    logout: (props)=> <AntDesign name="logout" size={26} {...props} />,
  }