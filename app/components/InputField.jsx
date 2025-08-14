import { Alert, StyleSheet, Text, TextInput, View } from "react-native";
import React from "react";
import { Controller } from "react-hook-form";

const InputField = ({
  title,
  inputStyle,
  multiline = false,
  value,
  onChange,
  ...props
}) => {
  return (
    <View style={{ marginTop: 20 }}>
      <Text
        style={{ fontFamily: "Nunito", fontSize: 15, fontWeight: "semibold" }}
      >
        {title}:
      </Text>

      <TextInput
        placeholder=""
        style={inputStyle}
        {...props}
        multiline={multiline}
        onChangeText={onChange}
        value={value}
      />
      {value.trim() === "" && (
        <Text
          style={{
            fontFamily: "Nunito",
            color: "red",
            fontSize: 12,
            marginTop: 5,
            fontWeight: "bold",
          }}
        >
          This field is requried.
        </Text>
      )}
      {value.trim() !== "" &&
        title === "Email" &&
        !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value) && (
          <Text
            style={{
              fontFamily: "Nunito",
              color: "red",
              fontSize: 12,
            }}
          >
            Please enter a valid email address.
          </Text>
        )}
      {value.trim() !== "" &&
        title === "Phone Number with country code" &&
        !/^\+([1-9]\d{0,2})[-\s]?(\d{6,14})$/.test(value) && (
          <Text
            style={{
              fontFamily: "Nunito",
              color: "red",
              fontSize: 12,
            }}
          >
            Please enter a valid phone number.
          </Text>
        )}
    </View>
  );
};

export default InputField;
