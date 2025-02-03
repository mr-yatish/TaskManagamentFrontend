import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { ArrowLeft, Eye, EyeOff } from "lucide-react-native";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NODE_URL } from "../../config/config";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const router = useRouter();

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

  const handleLogin = async () => {
    if (!email || !password) {
      Toast.show({
        type: "info",
        text1: "Please fill all the fields",
        text2: "All fields are required to Login.",
        position: "top",
        swipeable: true,
        visibilityTime: 4000,
      });
      return;
    }
    setisLoading(true);

    try {
      const response = await fetch(`${NODE_URL}/api/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.status) {
        // Store token or user credentials in AsyncStorage
        if (data?.data?.token) {
          await AsyncStorage.setItem("userToken", data?.data?.token);
        }
        if (data?.data?.user) {
          const userDetails = JSON.stringify(data?.data?.user);
          await AsyncStorage.setItem("userDetails", userDetails);
        }

        setEmail("");
        setPassword("");
        Toast.show({
          type: "success",
          text1: "Login Successful",
          text2: "You have been logged in successfully.",
          position: "top",
          swipeable: true,
          visibilityTime: 4000,
        });

        // Redirect to Dashboard after a delay
        setTimeout(() => {
          router.push("/screens/Dashboard");
          router.dismissAll();
        }, 2000);
      } else {
        Toast.show({
          type: "error",
          text1: "Failed to Login",
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
        text1: "Failed to Login",
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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View>
        <View className="bg-[#414141] w-full h-full justify-center items-center overflow-hidden">
          <View className="bg-indigo-500 w-80 h-80 rounded-full absolute -top-32 -left-32">
            <TouchableOpacity
              onPress={() => router.push("/screens/Splash")}
              className="absolute bottom-14 right-28 z-50"
            >
              <ArrowLeft size={32} color="#fff" />
            </TouchableOpacity>
          </View>
          <View className="bg-indigo-500 w-80 h-80 rounded-full absolute -bottom-32 -right-32"></View>
          <View className="w-[90%] bg-[#252525] rounded-xl p-6">
            {!isLoading && (
              <>
                <Text className="text-4xl text-white font-bold mt-10">
                  Login
                </Text>
                <View className="mt-10">
                  <Text className="text-white text-lg mb-2">Email</Text>
                  <TextInput
                    className="w-full h-12 bg-[#333333] rounded-lg px-4 text-white"
                    placeholder="Enter your email"
                    placeholderTextColor="#A5A5A5"
                    value={email}
                    keyboardType="email-address"
                    onChangeText={setEmail}
                  />
                  <Text className="text-white text-lg mt-4 mb-2">Password</Text>
                  <View className="relative">
                    <TextInput
                      className="w-full h-12 bg-[#333333] rounded-lg px-4 text-white"
                      placeholder="Enter your password"
                      placeholderTextColor="#A5A5A5"
                      secureTextEntry={!showPassword}
                      value={password}
                      onChangeText={setPassword}
                    />
                    <Text
                      className="text-white cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 text-2xl"
                      onPress={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <Eye size={24} color="#fff" />
                      ) : (
                        <EyeOff size={24} color="#fff" />
                      )}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={handleLogin}
                    className="w-full p-4 bg-indigo-500 mt-10 rounded-full"
                  >
                    <Text className="text-white text-xl text-center">
                      Submit
                    </Text>
                  </TouchableOpacity>

                  <View className="mt-6 flex-row justify-center items-center gap-2">
                    <Text className="text-white text-lg text-center">
                      Don't have account?{" "}
                    </Text>
                    <TouchableOpacity
                      onPress={() => router.push("/screens/Register")}
                      className="cursor-pointer"
                    >
                      <Text className="text-indigo-500 underline">Sign Up</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            )}
            {isLoading && (
              <View className="flex justify-center items-center">
                {/* Animated Spinner */}
                <ActivityIndicator size="large" color="#4F46E5" />
                <Text className="text-white text-lg mt-4 font-semibold">
                  Loading, please wait...
                </Text>
              </View>
            )}
          </View>
        </View>
        <View className="absolute top-5 w-full justify-center items-center">
          <Toast />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
