import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Platform,
  ScrollView,
  Animated,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from "react-native";
import { X } from "lucide-react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { NODE_URL } from "../../config/config";
import Toast from "react-native-toast-message";

const EditTaskPopUp = ({ visible, onClose, task }) => {
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isProgressPickerVisible, setIsProgressPickerVisible] = useState(false); // State for progress dropdown
  const [progressOptions] = useState([
    "Not Started",
    "In Progress",
    "Completed",
  ]); // Options for progress
  const [animation] = useState(new Animated.Value(0)); // Animation value for sliding
  const [isClosing, setIsClosing] = useState(true); // State to track closing status

  useEffect(() => {
    if (!task) {
      return;
    }
    setFormData({
      title: task?.title || "",
      date: task?.date || new Date(),
      startfrom: task?.startfrom,
      endto: task?.endto,
      progress: task?.progress || "Not Started",
    });
    setDate(new Date(task?.date));
    setStartTime(new Date(task?.startfrom));
    setEndTime(new Date(task?.endto));
  }, [task]);

  const handleFormDataChange = (key, value) => {
    setFormData({
      ...formData,
      [key]: value,
    });
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
    handleFormDataChange("date", currentDate);
  };

  const handleStartTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || startTime;
    setShowStartTimePicker(false);
    setStartTime(currentTime);
    handleFormDataChange("startfrom", currentTime);
  };

  const handleEndTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || endTime;
    setShowEndTimePicker(false);
    setEndTime(currentTime);
    handleFormDataChange("endto", currentTime);
  };

  const handleUpdateTask = async () => {
    console.log("Task Updated:", formData);
    // onClose();
    // Fetch API to update task
    setIsLoading(true);
    try {
      const response = await fetch(`${NODE_URL}/api/task/${task._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.status) {
        Toast.show({
          type: "success",
          text1: "Task Updated",
          text2: "Task has been updated successfully",
          position: "top",
          swipeable: true,
          visibilityTime: 4000,
        });
        setIsLoading(false);
        onClose();
      } else {
        Toast.show({
          type: "error",
          text1: "Failed to Update Task",
          text2: data.message,
          position: "top",
          swipeable: true,
          visibilityTime: 4000,
        });
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error updating task:", error);
      Toast.show({
        type: "error",
        text1: "Failed to Update Task",
        text2: error.message,
        position: "top",
        swipeable: true,
        visibilityTime: 4000,
      });
    }
  };
  const handleDeleteTask = async () => {
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
        onClose();
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

  useEffect(() => {
    if (visible) {
      setIsClosing(false);
      Animated.timing(animation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else if (!isClosing) {
      setIsClosing(true);
      Animated.timing(animation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => onClose()}
    >
      <TouchableWithoutFeedback onPress={() => onClose()} accessible={false}>
        <View className="flex-1 justify-end bg-black/30">
          <TouchableWithoutFeedback>
            {!isLoading ? (
              <View className="bg-white p-6 py-14 rounded-t-lg relative">
                <TouchableOpacity
                  onPress={() => onClose()}
                  className="absolute top-2 right-2 p-2 rounded-full bg-gray-100 h-max"
                >
                  <X size={24} color="#333" />
                </TouchableOpacity>

                <TextInput
                  placeholder="Enter Task Title"
                  placeholderTextColor="#888"
                  className="py-2 border-b border-gray-300 focus:border-indigo-500 w-full"
                  onChangeText={(text) => handleFormDataChange("title", text)}
                  value={formData.title}
                />

                <Text className="text-gray-900 font-semibold mt-4">
                  Select Date
                </Text>
                <TouchableOpacity
                  onPress={() => setShowDatePicker(true)}
                  className="py-2 border-b border-gray-300 focus:border-indigo-500 w-full mt-2"
                >
                  <Text className="text-gray-800 text-lg">
                    {date.toLocaleDateString()}
                  </Text>
                </TouchableOpacity>

                {showDatePicker && (
                  <DateTimePicker
                    value={date}
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "calendar"}
                    onChange={handleDateChange}
                    textColor="#000"
                  />
                )}

                <Text className="text-gray-900 font-semibold mt-4">
                  Select Start Time
                </Text>
                <TouchableOpacity
                  onPress={() => setShowStartTimePicker(true)}
                  className="py-2 border-b border-gray-300 focus:border-indigo-500 w-full mt-2"
                >
                  <Text className="text-gray-800 text-lg">
                    {startTime.toLocaleTimeString()}
                  </Text>
                </TouchableOpacity>

                {showStartTimePicker && (
                  <DateTimePicker
                    value={startTime}
                    mode="time"
                    display={Platform.OS === "ios" ? "spinner" : "clock"}
                    onChange={handleStartTimeChange}
                    textColor="#000"
                  />
                )}

                <Text className="text-gray-900 font-semibold mt-4">
                  Select End Time
                </Text>
                <TouchableOpacity
                  onPress={() => setShowEndTimePicker(true)}
                  className="py-2 border-b border-gray-300 focus:border-indigo-500 w-full mt-2"
                >
                  <Text className="text-gray-800 text-lg">
                    {endTime.toLocaleTimeString()}
                  </Text>
                </TouchableOpacity>

                {showEndTimePicker && (
                  <DateTimePicker
                    value={endTime}
                    mode="time"
                    display={Platform.OS === "ios" ? "spinner" : "clock"}
                    onChange={handleEndTimeChange}
                    textColor="#000"
                  />
                )}

                {/* Custom Progress Dropdown */}
                <Text className="text-gray-900 font-semibold mt-4">
                  Select Progress
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    setIsProgressPickerVisible(!isProgressPickerVisible)
                  }
                  className="py-2 border-b border-gray-300 focus:border-indigo-500 w-full mt-2"
                >
                  <Text className="text-gray-800 text-lg">
                    {formData.progress}
                  </Text>
                </TouchableOpacity>

                {/* Progress Dropdown */}
                {isProgressPickerVisible && (
                  <View className=" w-full bg-white  shadow-sm  mt-2 gap-2 ">
                    {progressOptions.map((progress, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => {
                          handleFormDataChange("progress", progress);
                          setIsProgressPickerVisible(false);
                        }}
                        className={`py-2  px-4 rounded-sm ${
                          progress === formData.progress
                            ? "bg-indigo-500 text-white"
                            : "text-gray-800"
                        }`}
                      >
                        <Text
                          className={`${
                            progress === formData.progress
                              ? " text-white"
                              : "text-gray-800"
                          }`}
                        >
                          {progress}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                <View className="flex-row w-full mt-5">
                  {/* Delete Task Button */}
                  <TouchableOpacity
                    onPress={handleDeleteTask}
                    activeOpacity={0.8}
                    className="bg-red-500 rounded-lg p-3 shadow-md shadow-indigo-300 flex-1 mr-2"
                  >
                    <Text className="text-white text-center font-semibold">
                      Delete Task
                    </Text>
                  </TouchableOpacity>

                  {/* Update Task Button */}
                  <TouchableOpacity
                    onPress={handleUpdateTask}
                    activeOpacity={0.8}
                    className="bg-indigo-500 rounded-lg p-3 shadow-md shadow-indigo-300 flex-1 ml-2"
                  >
                    <Text className="text-white text-center font-semibold">
                      Update Task
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View className="bg-white p-6 py-14 rounded-t-lg relative">
                <ActivityIndicator size="large" color="#4f46e5" />
              </View>
            )}
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default EditTaskPopUp;
