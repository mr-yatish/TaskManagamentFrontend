import { useEffect, useState } from "react";
import { View, Text } from "react-native";
import io from "socket.io-client";

// Ensure the frontend connects to the correct backend port
const socket = io("https://taskmanagamentbackend.onrender.com");

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    socket.on("pushMessage", (data) => {
      console.log("Data Received:", data);
      setNotifications((prev) => [...prev, data]);
    });

    return () => {
      socket.off("pushMessage"); 
    };
  }, []);

  return (
    <View className="mt-20 flex flex-col gap-3 p-2 ">
      <Text className="text-center text-2xl mb-10 ">Notifications</Text>
      {notifications.map((ele, index) => {
        return (
          <Text key={index} className="p-2 bg-red-200 py-4 rounded-lg ">
            {ele}
          </Text>
        );
      })}
    </View>
  );
};

export default Notifications;
