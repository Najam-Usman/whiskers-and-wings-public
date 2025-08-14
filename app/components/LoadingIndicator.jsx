import {
  ActivityIndicator,
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import colours from "../../src/COLOURS";
import ShadowWrapper from "./ShadowWrapper";

const LoadingIndicator = ({ message }) => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {/* {Platform.OS } */}

      <ShadowWrapper style={styles.dropShadowStyle}>
        <View style={styles.messageBox}>
          <Text style={styles.heading}>{message}</Text>
          <View style={{ height: 20 }} />
          <ActivityIndicator size={"large"} color={colours.navbar} />
        </View>
      </ShadowWrapper>
    </View>
  );
};

export default LoadingIndicator;

const styles = StyleSheet.create({
  heading: {
    fontFamily: "Nunito",
    fontSize: 20,
    color: colours.heading2,
    margin: 10,
  },

  messageBox: {
    height: 300,
    width: 300,
    borderRadius: 20,
    backgroundColor: colours.white,
    justifyContent: "center",
    alignItems: "center",
  },

  dropShadowStyle: {
    shadowColor: colours.dropShadowColour,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 1,
  },
});
