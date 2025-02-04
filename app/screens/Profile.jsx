import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  Pressable,
  TouchableWithoutFeedback,
  Image,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import TaskBar from "./TaskBar";
import {
  Calendar,
  User,
  ArrowLeft,
  Pen,
  Mail,
  Pencil,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NODE_URL } from "../../config/config";
import Toast from "react-native-toast-message";
import ShimmerPlaceholder from "../components/ShimmerPlaceholder";
const ProfileEdit = () => {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [user, setUser] = useState({
    id: "",
    name: "",
    email: "",
    gender: "",
    dateOfBirth: "",
    profileImage:
      "https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg",
  });
  const router = useRouter();
  // user state
  const [isGenderPickerVisible, setGenderPickerVisible] = useState(false);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [tempDate, setTempDate] = useState(new Date()); // For storing the selected date temporarily
  const [isLoading, setisLoading] = useState(false);
  // Handle Date Change
  const handleDateChange = (event, selectedDate) => {
    if (event.type === "set" && selectedDate) {
      setDate(selectedDate);
      setUser({ ...user, dateOfBirth: selectedDate });
    }
    setShowDatePicker(false); // Close picker after selection
  };
  useEffect(() => {
    setisLoading(true);
    const fetchUserDetails = async () => {
      try {
        const userDetails = await AsyncStorage.getItem("userDetails"); // Await the promise
        if (!userDetails) {
          // If no user details, redirect to login
          router.replace("/screens/Login");
          return;
        }

        const parsedUser = JSON.parse(userDetails); // Parse the string back to JSON
        await fetchUserData(parsedUser?.id);
        setisLoading(false);
      } catch (error) {
        setisLoading(false);
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, []);

  // Fetch user Data
  const fetchUserData = async (id) => {
    try {
      const response = await fetch(`${NODE_URL}/api/user/${id}`, {
        method: "GET",
      });

      const data = await response.json();
      if (data.status) {
        setUser(data?.data);
        setDate(new Date(data?.data?.dateOfBirth));
      } else {
        Toast.show({
          type: "error",
          text1: "Failed to Fetch User",
          text2: data.message,
          position: "top",
          swipeable: true,
          visibilityTime: 4000,
        });
      }
    } catch (error) {}
  };

  // Handler to update user state
  const handleInputChange = (field, value) => {
    setUser({ ...user, [field]: value });
  };

  // Handle Gender Selection
  const handleGenderSelect = (gender) => {
    setUser({ ...user, gender });
    setGenderPickerVisible(false);
  };

  // Handle Log Out
  const handleLogout = () => {
    // Clear user session
    AsyncStorage.removeItem("userToken");
    AsyncStorage.removeItem("userDetails");
    console.log("Logged out");

    // Redirect to Login
    router.push("/screens/Login");
    router.dismissAll();
  };

  // Handle Update Profile
  const handleUpdateProfile = async () => {
    try {
      const response = await fetch(`${NODE_URL}/api/user/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...user, id: user?._id }),
      });
      const data = await response.json();
      if (data.status) {
        Toast.show({
          type: "success",
          text1: "Updated Successfully",
          text2: "You have been updated successfully.",
          position: "top",
          swipeable: true,
          visibilityTime: 4000,
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Failed to Update",
          text2: data.message,
          position: "top",
          swipeable: true,
          visibilityTime: 4000,
        });
      }
    } catch (error) {
      console.error(error);
      Toast.show({
        type: "error",
        text1: "Failed to Update",
        text2: error.message,
        position: "top",
        swipeable: true,
        visibilityTime: 4000,
      });
    } finally {
      setisLoading(false);
    }
  };

  return (
    <View className="bg-[#fff] flex-1 relative">
      {!isLoading ? (
        <ScrollView className="w-full h-full mb-16 px-6 py-4 mt-10">
          {/* Header */}
          <View className="flex-row items-center mb-6 justify-center ">
            <TouchableOpacity
              onPress={() => {
                router.back();
              }}
              className="p-2"
            >
              <ArrowLeft size={24} color="#374151" />
            </TouchableOpacity>
            <Text className="flex-1 text-lg font-semibold text-center">
              Edit Profile
            </Text>
          </View>
          {/* Profile Image Section with pen icon for edit image */}
          <View className="flex-row items-center justify-center mb-6">
            <View className="bg-gray-100 rounded-full relative overflow-hidden">
              <View className="absolute top-2/3 w-full h-20 bg-black/40 z-20 ">
                <Text className="text-white text-sm p-2 font-semibold text-center">
                  Edit
                </Text>
              </View>

              {user?.profileImage ? (
                <Image
                  source={{ uri: user?.profileImage }}
                  style={{ width: 100, height: 100, borderRadius: 100 }}
                />
              ) : (
                <User size={100} color="#9CA3AF" />
              )}
            </View>
          </View>

          {/* First Name Input */}
          <View className="mb-6 relative">
            <Text className="text-gray-700 mb-1">Name</Text>
            <TextInput
              value={user?.name}
              onChangeText={(text) => handleInputChange("name", text)}
              placeholder="Enter your name"
              className="bg-gray-100 p-4 rounded-lg "
            />
            <View className="absolute right-4 top-[65%] transform -translate-y-1/2">
              <Pencil size={20} color="#9CA3AF" />
            </View>
          </View>

          {/* Email Input */}
          <View className="mb-6 ">
            <Text className="text-gray-700 mb-1">Email</Text>
            <TextInput
              value={user?.email}
              onChangeText={(text) => handleInputChange("email", text)}
              placeholder="Enter your email address"
              keyboardType="email-address"
              className="bg-gray-100 p-4 rounded-lg "
            />
            <View className="absolute right-4 top-[65%] transform -translate-y-1/2">
              <Mail size={20} color="#9CA3AF" />
            </View>
          </View>

          {/* Gender Selection */}
          <View className="mb-6">
            <Text className="text-gray-700 mb-1">Gender</Text>
            <TouchableOpacity
              onPress={() => setGenderPickerVisible(true)}
              className="bg-gray-100 p-4 rounded-lg flex-row items-center justify-between"
            >
              <Text className="text-gray-700">
                {user?.gender || "Select your gender"}
              </Text>
              <User size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          {/* Date of Birth Picker */}
          <View className="mb-6">
            <Text className="text-gray-700 mb-1">Date of Birth</Text>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              className="bg-gray-100 p-4 rounded-lg flex-row items-center justify-between"
            >
              <Text className="text-gray-800 text-lg">
                {date.toLocaleDateString()}
              </Text>
              <Calendar size={20} color="#9CA3AF" />
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
          </View>

          {/* Update Button */}
          <TouchableOpacity
            onPress={() => {
              handleUpdateProfile();
            }}
            className="bg-[#4338CA] p-4 rounded-t-2xl items-center"
          >
            <Text className="text-white font-medium text-base">
              Update Profile
            </Text>
          </TouchableOpacity>
          {/* Log out Button */}
          <TouchableOpacity
            onPress={() => {  
              handleLogout();
            }}
            className="bg-red-400 mt-2 mb-10 p-4 rounded-b-2xl items-center"
          >
            <Text className="text-white font-medium text-base">Log Out</Text>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <ScrollView className="w-full h-full mb-16 px-6 py-4 mt-10">
          {/* Header Shimmer */}
          <View className="flex-row items-center mb-4 gap-20 ">
            <ShimmerPlaceholder className="w-8 h-8 rounded-full" />
            <ShimmerPlaceholder className="h-8 rounded-lg w-32 ml-2" />
          </View>

          {/* Profile Image Shimmer */}
          <View className="items-center justify-center mb-4">
            <ShimmerPlaceholder className="w-24 h-24 rounded-full" />
          </View>

          {/* Form Shimmers */}
          {[1, 2, 3, 4].map((i) => (
            <View key={i} className="mb-2">
              <ShimmerPlaceholder className="h-4 rounded w-16 mb-1" />
              <ShimmerPlaceholder className="h-12 rounded-lg" />
            </View>
          ))}

          {/* Button Shimmers */}
          <View className="mb-3">
            <ShimmerPlaceholder className="h-12 rounded-lg" />
          </View>
          <View className="mb-6">
            <ShimmerPlaceholder className="h-12 rounded-lg" />
          </View>
        </ScrollView>
      )}
      {/* Date Picker Modal */}

      {/* Gender Picker Modal */}
      <Modal
        visible={isGenderPickerVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setGenderPickerVisible(false)}
      >
        <TouchableWithoutFeedback
          onPress={() => setGenderPickerVisible(false)}
          accessible={false}
        >
          <View className="flex-1 justify-end bg-black/50">
            <TouchableWithoutFeedback>
              <View className="bg-white p-6 rounded-t-lg">
                <Text className="text-lg font-semibold text-center mb-4">
                  Select Gender
                </Text>
                <TouchableOpacity
                  onPress={() => handleGenderSelect("Male")}
                  className="p-4 rounded-lg bg-gray-100 mb-2"
                >
                  <Text className="text-center text-base">Male</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleGenderSelect("Female")}
                  className="p-4 rounded-lg bg-gray-100 mb-2"
                >
                  <Text className="text-center text-base">Female</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleGenderSelect("Other")}
                  className="p-4 rounded-lg bg-gray-100"
                >
                  <Text className="text-center text-base">Other</Text>
                </TouchableOpacity>
                <Pressable
                  onPress={() => setGenderPickerVisible(false)}
                  className="mt-4 p-4 rounded-lg bg-red-500"
                >
                  <Text className="text-center text-white">Cancel</Text>
                </Pressable>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <View className="absolute top-5 w-full justify-center items-center">
        <Toast />
      </View>
      {/* Task Bar */}
      <TaskBar />
    </View>
  );
};

export default ProfileEdit;
