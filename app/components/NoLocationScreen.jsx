import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import colours from "../../src/COLOURS";
import ShadowWrapper from "./ShadowWrapper";

const NoLocationScreen = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ShadowWrapper style={styles.dropShadowStyle}>
        <View style={styles.messageBox}>
          <Text style={styles.heading}>
            ⚠️Please enable location usage through your device settings.⚠️
          </Text>
          <Text style={[styles.heading, { fontSize: 15 }]}>
            You cannot report animals without providing your location.
          </Text>
          {/* <Image source={require('../../assets/images/heart-paw-icon.png')} style={{width:60, height:60}} /> */}
        </View>
      </ShadowWrapper>
    </View>
  );
};

export default NoLocationScreen;

const styles = StyleSheet.create({
  heading: {
    fontFamily: "Poppins-SemiBold",
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
