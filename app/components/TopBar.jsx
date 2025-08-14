import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { memo, useContext, useEffect, useState } from "react";
import colours from "../../src/COLOURS";
import { HeartIcon } from "../../assets/SVGs/HeartIcon";
import { AuthContext } from "../contexts/AuthContext";
import { BASE_URL } from "@env";
import axios from "axios";

function TopBar({ handleWishList, handleProfile }) {
  const { userToken } = useContext(AuthContext);
  const [userData, setUserData] = useState("");

  async function getUserData() {
    if (userToken) {
      axios.post(`${BASE_URL}/userdata`, { token: userToken }).then((res) => {
        // console.log(res.data)
        setUserData(res.data.data);
      });
    }
  }

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <View style={styles.topBar}>
      <View style={styles.greetingContainer}>
        <Text
          style={[
            styles.normalText,
            {
              marginLeft: 20,
              color: "#2C241C",
              marginBottom: -5,
              fontSize: 15,
              fontFamily: "Poppins-Bold",
            },
          ]}
        >
          Welcome back,
        </Text>
        <Text
          style={[
            styles.normalText,
            {
              marginLeft: 20,
              color: "#2C241C",
              fontFamily: "Poppins-Bold",
              fontSize: 15,
            },
          ]}
        >
          {!userToken ? "Guest" : userData?.name}
        </Text>
      </View>

      <View style={{ flexDirection: "row", marginRight: -30 }}>
        <TouchableOpacity
          style={[styles.picContainer, { borderWidth: 0 }]}
          onPress={handleWishList}
        >
          {/* <Image source={require('../../assets/images/heart-empty-icon.png')} style={{resizeMode:'cover', height:'100%', width:'100%'}}/> */}
          <HeartIcon width={40} height={40} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.picContainer} onPress={handleProfile}>
          <Image
            source={require("../../assets/images/default.jpg")}
            style={{ resizeMode: "cover", height: "100%", width: "100%" }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    marginTop: Platform.OS == "ios" ? "12%" : "6%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colours.primary,
  },

  picContainer: {
    width: 40,
    height: 40,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "black",
    margin: "5%",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },

  normalText: {
    color: "black",

    fontSize: 20,
  },
});

export default memo(TopBar);
