import { useState } from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";

const Calculator = () => {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");

  const handleInput = (value) => {
    setInput((prev) => prev + value);
  };

  const calculateResult = () => {
    try {
      const evalResult = eval(input);
      setResult(evalResult.toLocaleString());
      setInput(evalResult.toString());
    } catch (error) {
      setResult("Error");
    }
  };

  const handleClear = () => {
    setInput("");
    setResult("");
  };

  const handleDelete = () => {
    setInput((prev) => prev.slice(0, -1)); // Removes last character
  };

  // Updated buttons without sin/deg
  const buttons = [
    ["AC", "DEL", "/", "*"],
    ["7", "8", "9", "-"],
    ["4", "5", "6", "+"],
    ["1", "2", "3", "="],
    ["0", ".", "%"],
  ];

  return (
    <View className="flex-1 justify-center items-center bg-gradient-to-b from-white to-gray-200 p-4">
      {/* Glassy effect on the main container */}
      <View className="w-full bg-white/30 rounded-xl p-6 shadow-xl backdrop-blur-md">
        {/* Editable Input Area */}
        <View className="mb-8">
          <TextInput
            value={input}
            onChangeText={setInput} // Update input when user types
            className="text-right text-4xl font-light text-gray-800 p-4 bg-white/30 rounded-lg backdrop-blur-md"
            placeholder="Enter calculation"
            keyboardType="numeric"
            autoCapitalize="none"
            editable
          />
          <Text className="text-right text-3xl font-light text-gray-500 mt-2">
            {result ? `=${result}` : ""}
          </Text>
        </View>

        {/* Buttons */}
        <View className="space-y-4">
          {buttons.map((row, rowIndex) => (
            <View key={rowIndex} className="flex-row justify-between mt-3">
              {row.map((button) => (
                <TouchableOpacity
                  key={button}
                  onPress={() => {
                    if (button === "=") calculateResult();
                    else if (button === "AC") handleClear();
                    else if (button === "DEL") handleDelete();
                    else handleInput(button);
                  }}
                  className={`
                    ${button === "0" ? "w-40" : "w-16"} h-16 rounded-full justify-center items-center
                    ${button === "=" ? "bg-blue-500" : "bg-gray-300"}
                    ${["AC", "DEL"].includes(button) ? "bg-red-500" : ""}
                    shadow-md backdrop-blur-md
                  `}
                >
                  <Text
                    className={`
                      text-2xl
                      ${button === "=" ? "text-white" : "text-gray-800"}
                      ${["AC", "DEL"].includes(button) ? "text-white" : ""}
                    `}
                  >
                    {button}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

export default Calculator;
           