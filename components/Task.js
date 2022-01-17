import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import axios from "axios";
import Toast from "react-native-toast-message";
import { FontAwesome, Feather } from "@expo/vector-icons";

const Task = ({ data, actions }) => {
  const handleDeleteTask = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/v1/todos/${id}`
      );
      Toast.show({
        type: "success",
        text1: response.data.message,
        topOffset: 50,
      });
      actions.setReload(!actions.reload);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: error.response.data.error,
        topOffset: 50,
      });
    }
  };

  const handleUpdateTask = async (data) => {
    actions.getTaskId(data._id);
    actions.setTask(data.name);
    actions.setTaskStatus(data.status);
    actions.setUpdate(true);
  };
  return (
    <View style={styles.item}>
      <View style={styles.itemLeft}>
        <View style={styles.itemMain}>
          <Text style={styles.itemText}>{data.name}</Text>
          <Text
            style={
              data.status === "completed"
                ? styles.itemCompleted
                : styles.itemInProgress
            }
          >
            {data.status}
          </Text>
        </View>
      </View>
      <TouchableOpacity onPress={() => handleUpdateTask(data)}>
      <View style={styles.editIcon}>
        <Feather name="edit" size={24} color="green" />
      </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleDeleteTask(data._id)}>
        <View style={styles.trashIcon}>
          <FontAwesome name="trash-o" size={24} color="red" />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  itemMain: {
    width: "80%",
  },
  itemText: {
    fontSize: 20,
    fontWeight: "bold",
    maxWidth: "80%",
  },
  itemCompleted: {
    color: "#228B22",
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 3,
  },
  itemInProgress: {
    color: "#DC143C",
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 3,
  },
  editIcon: {
    marginRight: 4,
  },
  trashIcon: {
    marginRight: 10,
  },
});

export default Task;
