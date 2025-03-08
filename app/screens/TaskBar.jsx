import {
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import React, { useEffect } from "react";
import { Home, CreditCard, User, Swords,Bell } from "lucide-react-native";
import { useRouter, usePathname } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

const menu = [
  {
    name: "Home",
    icon: Home,
    route: "/screens/Dashboard",
  },
  {
    name: "Games",
    icon: Swords,
    route: "/screens/Calendar",
  },
  {
    name: "Payments",
    icon: CreditCard,
    route: "/screens/Payments",
  },
  {
    name: "Notifications",
    icon: Bell,
    route: "/screens/Notifications",
  },
  {
    name: "Profile",
    icon: User,
    route: "/screens/Profile",
  },
];
const TaskBar = () => {
  const { width } = useWindowDimensions();
  const isLargeScreen = width > 768;
  const router = useRouter(); // Use the router instance
  const currentRoute = usePathname(); // Get the current path

  // Check User Session
  useFocusEffect(
    React.useCallback(() => {
      const checkSession = async () => {
        try {
          const userToken = await AsyncStorage.getItem("userToken");
          if (!userToken) {
            // Redirect to Dashboard if token exists
            router.replace("/screens/Login");
          }
        } catch (error) {
          console.error("Error checking session:", error);
        }
      };

      checkSession();
    }, [router])
  );
  const handleNavigation = (targetRoute) => {
    if (currentRoute !== targetRoute) {
      if (targetRoute === "/screens/Dashboard") {
        router.replace(targetRoute);
        router.dismissAll()
      } else {
        router.push(targetRoute);
      }
    }
  };

  return (
    <View className="flex-row justify-around py-4 bg-white absolute bottom-0 w-full">
      {menu.map((item, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => handleNavigation(item.route)}
          className="items-center  p-2 rounded-lg"
        >
          <item.icon size={isLargeScreen ? 28 : 24} color="#666666" />
          <Text className={`mt-1 ${isLargeScreen ? "text-sm" : "text-xs"}`}>
            {item.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default TaskBar;
