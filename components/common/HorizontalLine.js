import React from "react";
import { View } from "react-native";

export default function HorizontalLine({
  color = "#343a40",
  thickness = 1,
  marginVertical = 10,
}) {
  return (
    <View
      style={{
        height: thickness,
        backgroundColor: color,
        width: "100%",
        marginVertical: marginVertical,
      }}
    />
  );
}
