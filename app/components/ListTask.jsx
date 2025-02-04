import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import Toast from "react-native-toast-message";
import { NODE_URL } from "../../config/config";
import ShimmerPlaceholder from "./ShimmerPlaceholder";
import { Trash, Pencil } from "lucide-react-native";
import EditTaskPopUp from "./EditTaskPopUp";
const ListTask = ({ user, setActiveIndex, type = "All" }) => {
  const [list, setList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [taskStatuses, setTaskStatuses] = useState({});
  const [editTask, setEditTask] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  useEffect(() => {
    fetchTasks();
  }, []);

  // Fetch Tasks
  const fetchTasks = async () => {
    try {
      const response = await fetch(`${NODE_URL}/api/task/list/${user}`, {
        method: "GET",
      });
      const data = await response.json();
      if (data.status) {
        let filteredData = data.data;
        if (type == "All") {
          filteredData = data.data;
        } else if (type === "Today") {
          filteredData = data.data.filter(
            (task) =>
              new Date(task.date).toDateString() === new Date().toDateString()
          );
        } else if (type === "Completed") {
          filteredData = data.data.filter(
            (task) => task.progress === "Completed"
          );
        } else if (type === "In Progress") {
          filteredData = data.data.filter(
            (task) => task.progress === "In Progress"
          );
        } else if (type === "Not Started") {
          filteredData = data.data.filter(
            (task) => task.progress === "Not Started"
          );
        }
        setList(filteredData);

        const initialStatuses = {};
        filteredData.forEach((task) => {
          initialStatuses[task._id] = task.progress;
        });
        setTaskStatuses(initialStatuses);
        setIsLoading(false);
      } else {
        Toast.show({
          type: "error",
          text1: "Failed to Fetch Tasks",
          text2: data.message,
        });
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  // Handle Edit Task
  const handleEditTask = (task) => {
    setEditTask(true);
    setSelectedTask(task);
  };
  const handleDeleteTask = async (task) => {
    try {
      const response = await fetch(`${NODE_URL}/api/task/${task._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.status) {
        Toast.show({
          type: "success",
          text1: "Task Deleted",
          text2: "Task has been deleted successfully",
          position: "top",
          swipeable: true,
          visibilityTime: 4000,
        });
        setIsLoading(false);
        fetchTasks();
      } else {
        Toast.show({
          type: "error",
          text1: "Failed to delete Task",
          text2: data.message,
          position: "top",
          swipeable: true,
          visibilityTime: 4000,
        });
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      Toast.show({
        type: "error",
        text1: "Failed to delete Task",
        text2: error.message,
        position: "top",
        swipeable: true,
        visibilityTime: 4000,
      });
    }
  };
  return (
    <View className="p-4">
      {/* Loading Shimmer Effect */}
      {isLoading && <ActivityIndicator size="large" color="#4f46e5" />}

      {/* No Task Found */}
      {!isLoading && list.length === 0 && (
        <View className="flex-1 justify-center items-center mt-10">
          <Text className="text-center text-xl text-gray-500 font-semibold">
            No tasks found
          </Text>
          <Text className="text-center text-gray-400 text-sm mt-2">
            It looks like there are no tasks to show. Try adding some new tasks.
          </Text>
          {/* Optional: Add a call to action like a button */}
          <TouchableOpacity
            onPress={() => {
              setActiveIndex(2);
            }}
            className="mt-4 bg-indigo-500 p-3 rounded-full "
          >
            <Text className="text-white text-sm font-semibold shadow-lg">
              Add New Task
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Task List */}
      {!isLoading && (
        <View className="space-y-4 py-10 gap-4">
          {list.map((task, index) => (
            <View
              key={index}
              className="p-4 bg-white/40 rounded-lg shadow-md flex-row justify-between items-center gap-2"
            >
              <View className=" justify-between items-start gap-2 ">
                <Text className="text-lg font-semibold">{task?.title}</Text>
                <Text className="text-sm text-gray-500">
                  {new Date(task?.date).toDateString()}
                </Text>
              </View>
              <View className="flex-1 h-full flex-col  items-end gap-4">
                <Text
                  className={`font-semibold text-right ${
                    task?.progress == "Not Started"
                      ? "text-red-600"
                      : task.progress === "In Progress"
                      ? "text-indigo-500"
                      : task.progress === "Completed"
                      ? "text-green-500"
                      : "text-black"
                  }`}
                >
                  {task?.progress}
                </Text>
                <View className="flex-row gap-2">
                  <TouchableOpacity onPress={() => handleEditTask(task)}>
                    <View className="flex-row gap-2  items-center p-1 rounded-full w-10 h-10 justify-center">
                      <Pencil width={20} color={"#667eea"} />
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDeleteTask(task)}>
                    <View className="flex-row gap-2  items-center p-1 rounded-full w-10 h-10 justify-center">
                      <Trash width={20} color={"#f44336"} />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}

      <EditTaskPopUp
        visible={editTask}
        task={selectedTask}
        onClose={() => {
          setEditTask(false);
          setSelectedTask(null);
          fetchTasks();
        }}
      />
    </View>
  );
};

export default ListTask;
