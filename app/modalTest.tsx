import { useState } from "react";
import { Button, Modal, Text, View } from "react-native";

const ModalTest = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "black",
      }}
    >
      <Button title="Show Modal" onPress={() => setShowModal(true)} />
      <Modal
        visible={showModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <View
            style={{
              width: "80%",
              padding: 20,
              backgroundColor: "white",
              borderRadius: 10,
            }}
          >
            <Text style={{ textAlign: "center", marginBottom: 20 }}>
              This is a test modal
            </Text>
            <Button title="Close Modal" onPress={() => setShowModal(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ModalTest;
