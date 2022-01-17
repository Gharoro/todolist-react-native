import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from "react-native";
import Toast from "react-native-toast-message";
import axios from "axios";
import Task from "./components/Task";
import Loader from "./components/Loader";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [filterResult, setFilterResult] = useState([]);
  const [update, setUpdate] = useState(false);
  const [reload, setReload] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [taskList, setTaskList] = useState([]);
  const [task, setTask] = useState("");
  const [status, setTaskStatus] = useState("");
  const [taskId, setTaskId] = useState("");

  useEffect(async () => {
    const response = await axios.get("http://localhost:5000/api/v1/todos");
    if (response.data.success) {
      setFilterResult(response.data.data);
      setTaskList(response.data.data);
      setLoading(false);
    }
  }, [reload]);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    const response = await axios.get("http://localhost:5000/api/v1/todos");
    if (response.data.success) {
      Toast.show({
        type: "success",
        text1: response.data.message,
        topOffset: 50,
      });
      setTaskList(response.data.data);
      setFilterResult(response.data.data);
      setRefreshing(false);
    }
  }, [refreshing]);

  const getTaskId = (id) => {
    setTaskId(id);
  };

  const filterCompleted = () => {
    const result = taskList.filter((item) => {
      return item.status === "completed";
    });
    setFilterResult(result);
  };
  const filterInProgress = () => {
    const result = taskList.filter((item) => {
      return item.status === "in-progress";
    });
    setFilterResult(result);
  };

  const handleAddTask = async () => {
    if (update) {
      // handle update
      const data = {
        name: task,
        status: status.toLowerCase(),
      };

      try {
        const response = await axios.put(
          `http://localhost:5000/api/v1/todos/${taskId}`,
          data
        );
        Toast.show({
          type: "success",
          text1: response.data.message,
          topOffset: 50,
        });
        setReload(!reload);
      } catch (error) {
        Toast.show({
          type: "error",
          text1: error.response.data.error,
          topOffset: 50,
        });
      }
    } else {
      // handleAdd
      const data = {
        name: task,
      };
      try {
        const response = await axios.post(
          "http://localhost:5000/api/v1/todos",
          data
        );
        Toast.show({
          type: "success",
          text1: response.data.message,
          topOffset: 50,
        });
        setReload(!reload);
      } catch (error) {
        Toast.show({
          type: "error",
          text1: error.response.data.error,
          topOffset: 50,
        });
      }
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <>
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
          }}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Todo Lists */}
          <View style={styles.tasksWrapper}>
            <Text style={styles.headingTitle}>My Todo List</Text>
            <View style={styles.filterBtns}>
              <Button
                onPress={() => filterCompleted()}
                title="Filter Completed"
                color="#228B22"
                accessibilityLabel="Show only completed tasks"
              />
              <Text style={styles.headingTitle}>|</Text>
              <Button
                onPress={() => filterInProgress()}
                title="Filter In-Progress"
                color="#FF0000"
                accessibilityLabel="Show tasks in progress"
              />
            </View>

            <View style={styles.items}>
              {filterResult.map((item) => {
                return (
                  <TouchableOpacity key={item._id}>
                    <Task
                      data={item}
                      actions={{
                        setTask,
                        setTaskStatus,
                        reload,
                        setReload,
                        setUpdate,
                        getTaskId,
                      }}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </ScrollView>

        {/* Input task form */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.writeTaskWrapper}
        >
          {update ? (
            <View>
              <TouchableOpacity
                onPress={() => {
                  setUpdate(false), setTask("");
                }}
              >
                <Text style={styles.cancelText}>Cancel Update</Text>
              </TouchableOpacity>

              <TextInput
                style={styles.input}
                placeholder={"Enter task"}
                value={task}
                onChangeText={(text) => setTask(text)}
              />
              <TextInput
                style={styles.input}
                placeholder={"Enter task status: in-progress or completed"}
                value={status}
                onChangeText={(text) => setTaskStatus(text)}
              />
            </View>
          ) : (
            <TextInput
              style={styles.input}
              placeholder={"Enter task"}
              value={task}
              onChangeText={(text) => setTask(text)}
            />
          )}

          <TouchableOpacity onPress={() => handleAddTask()}>
            <View style={styles.addWrapper}>
              <Text style={styles.addText}>+</Text>
            </View>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </View>

      <Toast />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8EAED",
  },
  tasksWrapper: {
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  filterBtns: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 5,
    padding: 15,
    marginTop: 10,
  },
  headingTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  items: {
    marginTop: 30,
  },
  writeTaskWrapper: {
    position: "absolute",
    bottom: 60,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  cancelText: {
    color: "#FF0000",
    marginBottom: 6,
  },
  input: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: "#FFF",
    borderRadius: 60,
    borderColor: "#C0C0C0",
    borderWidth: 1,
    fontWeight: "bold",
    width: 250,
    marginBottom: 5,
  },
  addWrapper: {
    width: 60,
    height: 60,
    backgroundColor: "#FFF",
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#C0C0C0",
    borderWidth: 1,
  },
});
