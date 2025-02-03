import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  ImageBackground,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import TaskBar from "./TaskBar";
import {
  Calendar,
  Plus,
  ArrowLeft,
  List,
  CheckCheck,
  CircleDashed,
  CircleHelp,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NODE_URL } from "../../config/config";
import Toast from "react-native-toast-message";
import ShimmerPlaceholder from "../components/ShimmerPlaceholder";
import AddTask from "../components/AddTask";
import ListTask from "../components/ListTask";
import TodayTask from "../components/TodayTask";

const subMenu = [
  { index: 0, title: "Today Task", icon: Calendar },
  { index: 1, title: "Task List", icon: List },
  { index: 2, title: "Add Task", icon: Plus },
  { index: 3, title: "Completed", icon: CheckCheck },
  { index: 4, title: "In Progress", icon: CircleDashed },
  { index: 5, title: "Not Started", icon: CircleHelp },
];
const ManageTask = () => {
  const [isLoading, setisLoading] = useState(true);
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const fadeAnim = useRef(new Animated.Value(1)).current; // Opacity animation
  const translateY = useRef(new Animated.Value(0)).current; // Slide effect

  const scrollViewRef = useRef(null); // Ref for horizontal scroll view

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userDetails = await AsyncStorage.getItem("userDetails");
        if (!userDetails) {
          router.replace("/screens/Login");
          return;
        }
        const parsedUser = JSON.parse(userDetails);
        await fetchUserData(parsedUser?.id);
      } catch (error) {
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
        setisLoading(false);
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

  // Handle Tab Change with Animation
  const handleTabChange = (index) => {
    setActiveIndex(index);

    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0, // Fade out
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 10, // Move down
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1, // Fade in
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0, // Move back up
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  };

  useEffect(() => {
    // Trigger animation when activeIndex changes
    handleTabChange(activeIndex);
  }, [activeIndex]);

  return (
    <ImageBackground
      source={{
        uri: "https://img.freepik.com/free-photo/background-gradient-lights_23-2149305014.jpg?t=st=1738569428~exp=1738573028~hmac=bf65579c917016ce6514251dc8e005bc4143e03d6089a16fa7c314dd6c9c6807&w=740",
      }}
      style={{ flex: 1, justifyContent: "center" }}
      imageStyle={{ opacity: 0.6 }}
    >
      {!isLoading ? (
        <ScrollView className="w-full h-full mb-16 py-4 mt-10">
          {/* Header */}
          <View className="flex-row items-center mb-6 px-4 justify-center">
            <TouchableOpacity onPress={() => router.back()} className="p-2">
              <ArrowLeft size={24} color="#374151" />
            </TouchableOpacity>
            <Text className="flex-1 text-lg font-semibold text-center">
              Manage Task
            </Text>
          </View>

          {/* User Greeting */}
          <View className="p-4 my-6 px-6">
            <Text className="text-4xl text-gray-800">
              Hello, <Text className="font-bold">{user?.name || "User"}!</Text>{" "}
              👋
            </Text>
            <Text className="text-lg text-gray-600 mt-3">
              Have a fantastic day!
            </Text>
          </View>

          {/* Sub Menu Tabs */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 8, gap: 8 }}
            ref={scrollViewRef}
          >
            {subMenu.map((item, index) => (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => handleTabChange(index)}
                key={index}
                className={`h-14 items-center border-2 border-indigo-500  justify-center p-4 gap-2 rounded-full flex-row transition-all duration-200 ease-in-out transform ${
                  index === activeIndex ? "bg-indigo-500 " : ""
                }`}
              >
                <View>
                  <item.icon
                    width={24}
                    color={index === activeIndex ? "#fff" : "#4f46e5"}
                    className="transition-all duration-300 ease-in-out"
                  />
                </View>
                <Text
                  className={`text-sm font-semibold transition-all duration-300 ${
                    index === activeIndex
                      ? "text-white opacity-100"
                      : "text-indigo-500 opacity-80"
                  }`}
                >
                  {item.title}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Horizontal Scroll View to change tabs */}

          <Animated.View
            className="px-2"
            style={{ opacity: fadeAnim, transform: [{ translateY }] }}
          >
            {activeIndex === 0 && (
              <ListTask
                user={user?._id}
                setActiveIndex={setActiveIndex}
                type="Today"
              />
            )}
            {activeIndex === 1 && (
              <ListTask
                user={user?._id}
                setActiveIndex={setActiveIndex}
                type="All"
              />
            )}
            {activeIndex === 2 && <AddTask user={user?._id} />}
            {activeIndex === 3 && (
              <ListTask
                user={user?._id}
                setActiveIndex={setActiveIndex}
                type="Completed"
              />
            )}
            {activeIndex === 4 && (
              <ListTask
                user={user?._id}
                setActiveIndex={setActiveIndex}
                type="In Progress"
              />
            )}
            {activeIndex === 5 && (
              <ListTask
                user={user?._id}
                setActiveIndex={setActiveIndex}
                type="Not Started"
              />
            )}
          </Animated.View>
        </ScrollView>
      ) : (
        <ScrollView className="w-full h-full mb-16 py-4 mt-10">
          {/* Your Loading State Shimmer */}
        </ScrollView>
      )}

      {/* Toast */}
      <View className="absolute top-5 w-full justify-center items-center">
        <Toast />
      </View>

      {/* Task Bar */}
      <TaskBar />
    </ImageBackground>
  );
};

export default ManageTask;
