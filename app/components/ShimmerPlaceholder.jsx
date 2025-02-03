import React, { useEffect, useState, useRef } from "react";
import { Animated, Easing, Dimensions } from "react-native";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const ShimmerPlaceholder = ({ style, className }) => {
  const fadeAnim = useRef(new Animated.Value(0.5)).current;

  const parseClasses = () => {
    const classes = className?.split(" ") || [];
    return classes.reduce((acc, curr) => {
      const [prefix, modifier] = curr.split("-");

      if (prefix === "w") {
        if (modifier === "full") return { ...acc, width: "100%" };
        if (modifier === "screen") return { ...acc, width: screenWidth };
        if (!isNaN(modifier)) return { ...acc, width: Number(modifier) * 4 };
      }

      if (prefix === "h") {
        if (modifier === "full") return { ...acc, height: "100%" };
        if (modifier === "screen") return { ...acc, height: screenHeight };
        if (!isNaN(modifier)) return { ...acc, height: Number(modifier) * 4 };
      }

      if (prefix === "rounded") {
        switch (modifier) {
          case "lg":
            return { ...acc, borderRadius: 8 };
          case "full":
            return { ...acc, borderRadius: 9999 };
          default:
            return { ...acc, borderRadius: 4 };
        }
      }

      return acc;
    }, {});
  };

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.3,
          duration: 800,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [fadeAnim]);

  return (
    <Animated.View
      style={[
        parseClasses(),
        style,
        {
          opacity: fadeAnim,
          backgroundColor: "#e5e7eb",
          margin: 4,
        },
      ]}
    />
  );
};

export default ShimmerPlaceholder;