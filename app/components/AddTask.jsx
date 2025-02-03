import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Toast from "react-native-toast-message";
import { NODE_URL } from "../../config/config";
const AddTask = ({ user }) => {
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [formData, setFormData] = useState({
    title: "", 
    date: new Date(),
    startfrom: new Date(),
    endto: new Date(),
  });

  // Handle Form Data Change
  const handleFormDataChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  // Handle Date Change
  const handleDateChange = (event, selectedDate) => {
    if (event.type === "set" && selectedDate) {
      setDate(selectedDate);
      setFormData({ ...formData, date: selectedDate });
    }
    setShowDatePicker(false); // Close picker after selection
  };

  // Handle Start Time Change
  const handleStartTimeChange = (event, selectedTime) => {
    if (event.type === "set" && selectedTime) {
      setStartTime(selectedTime);
      setFormData({ ...formData, startfrom: selectedTime });
    }
    setShowStartTimePicker(false); // Close picker after selection
  };

  // Handle End Time Change
  const handleEndTimeChange = (event, selectedTime) => {
    if (event.type === "set" && selectedTime) {
      setEndTime(selectedTime);
      setFormData({ ...formData, endto: selectedTime });
    }
    setShowEndTimePicker(false); // Close picker after selection
  };

  // Handle Add Task
  const handleAddTask = async () => {
    if (!formData.title) {
      Toast.show({
        type: "error",
        text1: "Title is Required",
        text2: "Please enter a title for your task",
        position: "top",
        swipeable: true,
        visibilityTime: 4000,
      });
      return;
    }

    if (!user) {
      Toast.show({
        type: "error",
        text1: "User Not Logged In",
        text2: "Please login to add a task",
        position: "top",
        swipeable: true,
        visibilityTime: 4000,
      });
      return;
    }

    try {
      const response = await fetch(`${NODE_URL}/api/task/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, user }),
      });
      const data = await response.json();

      if (data.status) {
        Toast.show({
          type: "success",
          text1: "Task Added Successfully",
          text2: "Your task has been added successfully",
          position: "top",
          swipeable: true,
          visibilityTime: 4000,
        });

        // Reset Form Data Only After Successful Task Addition
        setFormData({
          title: "",
          date: new Date(),
          startfrom: new Date(),
          endto: new Date(),
        });
        setDate(new Date());
        setStartTime(new Date());
        setEndTime(new Date());
      } else {
        Toast.show({
          type: "error",
          text1: "Failed to Add Task",
          text2: data.message,
          position: "top",
          swipeable: true,
          visibilityTime: 4000,
        });
      }
    } catch (error) {
      console.log(error.message);

      Toast.show({
        type: "error",
        text1: "Failed to Add Task",
        text2: "An error occurred while adding your task",
        position: "top",
        swipeable: true,
        visibilityTime: 4000,
      });
    }
  };

  return (
    <View className="m-4 p-5  bg-blue-200/40 rounded-xl mt-10 ">
      {/* Header */}
      <Text className="text-xl font-bold text-gray-900 mb-3">Add New Task</Text>

      {/* Task Title */}
      <TextInput
        placeholder="Enter Task Title"
        placeholderTextColor="#888"
        className="py-2 border-b  focus:border-indigo-500  w-full "
        onChangeText={(text) => handleFormDataChange("title", text)}
        value={formData.title}
      />

      {/* Due Date Selection */}
      <Text className="text-gray-900 font-semibold mt-4">Select Date</Text>
      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        className="py-2 border-b  focus:border-indigo-500  w-full  mt-2"
      >
        <Text className="text-gray-800 text-lg">
          {date.toLocaleDateString()}
        </Text>
      </TouchableOpacity>

      {/* Date Picker (Only Opens When Needed) */}
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "calendar"}
          onChange={handleDateChange}
          textColor="#000"
        />
      )}

      {/* Start Time Selection */}
      <Text className="text-gray-900 font-semibold mt-4">
        Select Start Time
      </Text>
      <TouchableOpacity
        onPress={() => setShowStartTimePicker(true)}
        className="py-2 border-b  focus:border-indigo-500  w-full  mt-2"
      >
        <Text className="text-gray-800 text-lg">
          {startTime.toLocaleTimeString()}
        </Text>
      </TouchableOpacity>

      {/* Start Time Picker (Only Opens When Needed) */}
      {showStartTimePicker && (
        <DateTimePicker
          value={startTime}
          mode="time"
          display={Platform.OS === "ios" ? "spinner" : "clock"}
          onChange={handleStartTimeChange}
          textColor="#000"
        />
      )}

      {/* End Time Selection */}
      <Text className="text-gray-900 font-semibold mt-4">Select End Time</Text>
      <TouchableOpacity
        onPress={() => setShowEndTimePicker(true)}
        className="py-2 border-b  focus:border-indigo-500  w-full  mt-2"
      >
        <Text className="text-gray-800 text-lg">
          {endTime.toLocaleTimeString()}
        </Text>
      </TouchableOpacity>

      {/* End Time Picker (Only Opens When Needed) */}
      {showEndTimePicker && (
        <DateTimePicker
          value={endTime}
          mode="time"
          display={Platform.OS === "ios" ? "spinner" : "clock"}
          onChange={handleEndTimeChange}
          textColor="#000"
        />
      )}

      {/* Add Task Button */}
      <TouchableOpacity
        onPress={handleAddTask}
        activeOpacity={0.8}
        className="bg-indigo-500 rounded-lg p-3 mt-5 shadow-md shadow-indigo-300"
      >
        <Text className="text-white text-center font-semibold">Add Task</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddTask;
