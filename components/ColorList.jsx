import { ScrollView, StyleSheet, View } from "react-native"

const ColorList = ({ color }) => {
  return (
    <ScrollView
        contentContainerStyle={styles.container}>
      {
        [1, 0.8, 0.5].map(opacity => (
            <View 
                key={opacity}
                style={[styles.color, { backgroundColor: color, opacity }]}
            />
        ))
      }
    </ScrollView>
  )
}

const styles = StyleSheet.create({
    color: {
        with: '100%',
        height: 150,
        borderRadius: 25,
        borderCurve: 'continuous',
        marginBottom: 15,
    },
    container: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        height: '100%',
    }
})

export default ColorList