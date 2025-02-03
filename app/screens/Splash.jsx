import { Image, Text, View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Users, Calendar } from "lucide-react-native"; // Import Lucide icons
import { useFocusEffect } from "@react-navigation/native";
import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
const Splash = () => {
  // Check for existing login session using useFocusEffect
  useFocusEffect(
    React.useCallback(() => {
      const checkSession = async () => {
        try {
          const userToken = await AsyncStorage.getItem("userToken");
          if (userToken) {
            // Redirect to Dashboard if token exists
            router.replace("/screens/Dashboard");
          }
        } catch (error) {
          console.error("Error checking session:", error);
        }
      };

      checkSession();
    }, [router])
  );
  const router = useRouter();
  return (
    <View className="bg-[#24303C] items-center w-full h-full px-4 py-10">
      {/* Top Section */}
      <View className="flex-1 justify-center items-center">
        {/* Logo or Splash Image */}
        <Image
          source={require("../../assets/images/SplashScreen.png")}
          className="w-48 h-48 rounded-full shadow-lg"
        />

        {/* Main Title */}
        <Text className="text-white text-3xl font-extrabold mt-8">
          Welcome to TaskPro
        </Text>

        {/* Subtitle */}
        <Text className="text-gray-300 text-center text-base mt-4 px-6">
          Manage your tasks effortlessly. Plan your day, achieve your goals, and
          stay on top of your work with TaskPro!
        </Text>
      </View>
      {/* Features Section */}
      <View className="w-full mt-8 flex-1 px-4">
        <Text className="text-gray-300 text-xl font-semibold text-center mb-6">
          Why Choose TaskPro?
        </Text>
        <View className="flex flex-wrap justify-center space-y-4">
          {/* Feature 1 */}
          <View className="w-full sm:w-[48%] flex-row items-center bg-[#2A3B47] p-4 rounded-lg shadow-md mb-4">
            <View className="bg-indigo-500 p-3 rounded-full mr-4">
              <Users color="white" size={24} />
            </View>
            <Text className="text-white text-base">
              Seamless Team Collaboration for better productivity.
            </Text>
          </View>

          {/* Feature 2 */}
          <View className="w-full sm:w-[48%] flex-row items-center bg-[#2A3B47] p-4 rounded-lg shadow-md mb-4">
            <View className="bg-indigo-500 p-3 rounded-full mr-4">
              <Users color="white" size={24} />
            </View>
            <Text className="text-white text-base">
              Seamless Team Collaboration for better productivity.
            </Text>
          </View>

          {/* Feature 3 */}
          <View className="w-full sm:w-[48%] flex-row items-center bg-[#2A3B47] p-4 rounded-lg shadow-md">
            <View className="bg-indigo-500 p-3 rounded-full mr-4">
              <Calendar color="white" size={24} />
            </View>
            <Text className="text-white text-base">
              Stay Organized & Productive with smart planning.
            </Text>
          </View>
        </View>
      </View>

      {/* Bottom Section */}
      <View className="mt-6 justify-center items-center">
        <TouchableOpacity
          onPress={() => {
            router.push("/screens/Register");
          }}
          className="bg-indigo-600 rounded-full px-10 py-4 shadow-lg"
        >
          <Text className="text-white text-lg font-semibold text-center">
            Get Started
          </Text>
        </TouchableOpacity>
        <Text
          className="text-gray-400 text-sm text-center mt-4"
          onPress={() => router.push("/screens/Login")}
        >
          Already have an account?{" "}
          <Text className="text-indigo-500">Sign In</Text>
        </Text>
      </View>
    </View>
  );
};

export default Splash;
