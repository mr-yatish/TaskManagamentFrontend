import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Toast from "react-native-toast-message";
import { NODE_URL } from "../../config/config";
import ShimmerPlaceholder from "./ShimmerPlaceholder";
const ListTask = ({ user }) => {
  const [list, setList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [taskStatuses, setTaskStatuses] = useState({});

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
        setList(data.data);
        const initialStatuses = {};
        data.data.forEach((task) => {
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

  // Update Task Progress
  const updateProgress = async (taskId, newStatus) => {
    try {
      const response = await fetch(`${NODE_URL}/api/task/update/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await response.json();
      if (data.status) {
        setTaskStatuses((prev) => ({ ...prev, [taskId]: newStatus }));
        Toast.show({
          type: "success",
          text1: "Task Updated",
          text2: "Task status updated successfully!",
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Update Failed",
          text2: data.message,
        });
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  return (
    <View className="p-4">
      {/* Loading Shimmer Effect */}
      {isLoading && <ShimmerPlaceholder className="w-full h-24 rounded-lg" />}

      {/* No Task Found */}
      {!isLoading && list.length === 0 && (
        <Text className="text-center text-lg text-gray-500">
          No tasks found
        </Text>
      )}

      {/* Task List */}
      {!isLoading && (
        <View className="space-y-4 gap-4">
          {list.map((task, index) => (
            <View key={index} className="p-4 bg-white rounded-lg shadow-md">
              <View className=" justify-between items-start gap-2 ">
                <Text className="text-lg font-semibold">{task?.title}</Text>
                <Text className="text-sm text-gray-500">
                  {new Date(task?.date).toDateString()}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default ListTask;
