import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { Eye, EyeOff, ArrowLeft } from "lucide-react-native";
import { NODE_URL } from "../../config/config";
import Toast from "react-native-toast-message";
// Use your machine's IP address here.

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const registerUser = async () => {
    if (!email || !password) {
      Toast.show({
        type: "info",
        text1: "Please fill all the fields",
        text2: "All fields are required to register.",
        position: "top", // Show the toast at the top
        swipeable: true, // Allow users to swipe the toast away
        visibilityTime: 4000, // Keep the toast visible for 4 seconds
      });
      return;
    }
    setIsLoading(true);

    try {
      const response = await fetch(`${NODE_URL}/api/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log(data);

      if (data.status) {
        setEmail("");
        setPassword("");
        Toast.show({
          type: "success",
          text1: "Registration Successful",
          text2: "Your account has been created. Please log in.",
          position: "top", // Show the toast at the top
          swipeable: true, // Allow users to swipe the toast away
          visibilityTime: 4000, // Keep the toast visible for 4 seconds
        });
        // Redirect to Login after a delay
        setTimeout(() => {
          router.push("/screens/Login");
        }, 2000);
      } else {
        Toast.show({
          type: "error",
          text1: "Already Registered with this email",
          text2: "You already have an account with this email. Please login.",
          position: "top", // Show the toast at the top
          swipeable: true, // Allow users to swipe the toast away
          visibilityTime: 4000, // Keep the toast visible for 4 seconds
        });
      }
    } catch (error) {
      console.error(error);
      Toast.show({
        type: "error",
        text1: "Failed to Register",
        text2: error.message,
        position: "top", // Show the toast at the top
        swipeable: true, // Allow users to swipe the toast away
        visibilityTime: 4000, // Keep the toast visible for 4 seconds
      });
    } finally {
      setIsLoading(false);
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

          <View className="w-[90%] bg-[#252525] rounded-xl p-6 shadow-lg">
            {!isLoading ? (
              <>
                <Text className="text-4xl text-white font-bold mt-4">
                  Create Account
                </Text>
                <View className="mt-6">
                  <Text className="text-white text-lg mb-2">Email</Text>
                  <TextInput
                    className="w-full h-12 bg-[#333333] rounded-lg px-4 text-white"
                    placeholder="Enter your email"
                    placeholderTextColor="#A5A5A5"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
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
                    <TouchableOpacity
                      className="absolute right-4 top-1/2 -translate-y-1/2"
                      onPress={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <Eye size={24} color="#fff" />
                      ) : (
                        <EyeOff size={24} color="#fff" />
                      )}
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    onPress={registerUser}
                    className="w-full p-4 bg-indigo-500 mt-6 rounded-full"
                  >
                    <Text className="text-white text-xl text-center font-semibold">
                      Register
                    </Text>
                  </TouchableOpacity>

                  <View className="mt-6 flex-row justify-center items-center gap-2">
                    <Text className="text-white text-lg text-center">
                      Already have an account?{" "}
                    </Text>
                    <TouchableOpacity
                      onPress={() => router.push("/screens/Login")}
                    >
                      <Text className="text-indigo-500 underline">Login</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            ) : (
              <View className="flex justify-center items-center">
                <ActivityIndicator size="large" color="#4F46E5" />
                <Text className="text-white text-lg mt-4 font-semibold">
                  Creating your account...
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
