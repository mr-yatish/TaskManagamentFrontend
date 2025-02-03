import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  Text,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import {
  Search,
  Minus,
  Home,
  Calendar,
  CreditCard,
  User,
  Plus,
  Paintbrush,
  Flame,
  Wrench,
  LocateIcon,
  TableOfContents,
  Loader,
  CircleDot,
  Check,
} from "lucide-react-native";
import { router } from "expo-router";
import TaskBar from "./TaskBar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NODE_URL } from "../../config/config";
const Dashboard = () => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userDetails = await AsyncStorage.getItem("userDetails"); // Await the promise
        if (!userDetails) {
          // If no user details, redirect to login
          router.replace("/screens/Login");
          return;
        }

        const parsedUser = JSON.parse(userDetails); // Parse the string back to JSON
        console.log("Fetched User Details:", parsedUser); // Log parsed user details
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
  const { width, height } = useWindowDimensions();
  const isLargeScreen = width > 768;
  const services = [
    { icon: Plus, name: "Manage Task", url: "/screens/ManageTask" },
  ];

  return (
    <View className="bg-[#fff] flex-1 relative ">
      <View
        className={`bg-indigo-500 ${
          isLargeScreen ? "h-[30%]" : "h-[35%]"
        } rounded-b-3xl mb-10`}
      >
        <StatusBar barStyle="light-content" />
        <SafeAreaView className="flex-1">
          <View className="px-6 flex-1 justify-center">
            <Text className="text-white/90 text-lg text-center">
              Hello {user?.name || "User"}!
            </Text>

            <View className="flex-row items-center justify-center gap-2 space-x-2  mb-6 mt-5">
              <Text
                className={`text-white font-semibold ${
                  isLargeScreen ? "text-3xl" : "text-2xl"
                }`}
              >
                Boston, 02108
              </Text>
              <LocateIcon size={isLargeScreen ? 24 : 20} color="white" />
            </View>

            <View className="bg-white rounded-full flex-row items-center px-4 h-16 mt-5">
              <Search size={20} color="#666666" />
              <TextInput
                className="flex-1 ml-2 text-base"
                placeholder="What service are you looking for?"
                placeholderTextColor="#666666"
              />
            </View>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView
        className="flex-1 px-4 sm:px-6 -mt-6"
        contentContainerStyle={{
          paddingBottom: 20,
        }}
      >
        <View className="flex-row flex-wrap justify-between mt-5">
          {services.map((service, index) => (
            <TouchableOpacity
              onPress={() => router.push(service.url)}
              key={index}
              className={`${
                isLargeScreen ? "w-[15%]" : "w-[30%]"
              } items-center bg-white rounded-xl p-4 mb-4 shadow-sm shadow-black`}
            >
              <service.icon size={isLargeScreen ? 32 : 24} color="#666666" />
              <Text
                className={`text-center mt-2 ${
                  isLargeScreen ? "text-sm" : "text-xs"
                }`}
              >
                {service.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity className="bg-white rounded-xl p-4 mb-6 shadow-sm shadow-black">
          <View className="flex-row justify-between items-center">
            <Text
              className={`font-semibold ${
                isLargeScreen ? "text-2xl" : "text-xl"
              }`}
            >
              Home Care Scheduler
            </Text>
            <View className="bg-indigo-500 rounded-full p-2">
              <Search size={isLargeScreen ? 24 : 20} color="white" />
            </View>
          </View>
        </TouchableOpacity>
      </ScrollView>

      <TaskBar />
    </View>
  );
};

export default Dashboard;
