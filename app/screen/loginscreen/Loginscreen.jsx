import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useContext, useState } from "react";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import colours from "../../../src/COLOURS";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { BASE_URL } from "@env";
import { AuthContext } from "../../contexts/AuthContext";

export default function Loginscreen() {
  const navigation = useNavigation();

  const [username, onChangeUsername] = useState("");
  const [password, onChangePassword] = useState("");

  const { login, continueAsGuest } = useContext(AuthContext);

  function handleSubmit() {
    if (username.length == 0 || password.length == 0) {
      Alert.alert("Empty Field(s)");
      return;
    }

    const userData = {
      email: username,
      password: password,
    };

    axios
      .post(`${BASE_URL}/login-user`, userData)
      .then(async (res) => {
        if (res.data.status !== "ok") {
          if (res.data.data == "User doesn't exist") {
            Alert.alert("User doesn't exist!");
            onChangeUsername("");
            onChangePassword("");
          } else if (res.data.data == "Incorrect Password") {
            Alert.alert("Incorrect Password");
            onChangePassword("");
          }
          return;
        }

        const token = res.data.data;

        try {
          await AsyncStorage.setItem("token", token);
          login(token);
          Alert.alert("Logged in Successfully");
        } catch (error) {
          console.error("Login request failed: ", error);
        }
      })
      .catch((error) => {
        console.error("Login request failed: ", error);
        Alert.alert("Network error. Please try again.");
      });
  }

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.mainContainer}
      resetScrollToCoords={{ x: 0, y: 0 }}
      scrollEnabled={false}
    >
      <View style={styles.loginContainer}>
        <Text
          style={[
            {
              fontSize: 20,
              color: "black",
              margin: 20,
              fontFamily: "Poppins-Bold",
            },
          ]}
        >
          Sign in to your account
        </Text>

        <Image
          source={require("../../../assets/images/brown-wrapped-whiskers-and-wings-logo.png")}
          style={styles.logo}
        />

        <View style={styles.fieldCont}>
          <FontAwesome
            name="user-o"
            colour="#420475"
            style={styles.smallIcon}
          />
          <TextInput
            style={styles.textInput}
            onChangeText={onChangeUsername}
            value={username}
            placeholder="Email"
            placeholderTextColor={"grey"}
          />
        </View>

        <View style={styles.fieldCont}>
          <FontAwesome name="lock" colour="#420475" style={styles.smallIcon} />
          <TextInput
            style={styles.textInput}
            onChangeText={onChangePassword}
            value={password}
            placeholder="Password"
            secureTextEntry={true}
            placeholderTextColor={"grey"}
          />
        </View>

        <TouchableOpacity
          style={{
            height: 65,
            width: 75,
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => handleSubmit()}
        >
          <Image
            source={require("../../../assets/images/brown-paw-icon.png")}
            style={{ height: "100%", width: "100%" }}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Register");
        }}
      >
        <Text
          style={{
            color: "#FAF7EF",
            fontFamily: "Poppins-Regular",
            textDecorationLine: "underline",
          }}
        >
          Not a member? Create an account here!
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={{ marginTop: 10 }} onPress={continueAsGuest}>
        <Text
          style={{
            color: "#FAF7EF",
            fontFamily: "Poppins-Regular",
            textDecorationLine: "underline",
          }}
        >
          Continue as guest.
        </Text>
      </TouchableOpacity>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2B1107",
  },

  logo: {
    height: 130,
    width: 130,
    marginBottom: 10,
  },

  loginContainer: {
    backgroundColor: "#FFFDFD",
    width: 300,
    height: 500,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "space-around",
    padding: 10,
    marginBottom: 30,
    shadowColor: "black",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 20,
  },

  textInput: {
    flex: 0.9,
    color: "black",
    fontFamily: "Poppins-SemiBold",
  },

  fieldCont: {
    flexDirection: "row",
    borderWidth: 2,
    borderColor: "black",
    borderRadius: 10,
    marginBottom: 5,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },

  smallIcon: {
    marginHorizontal: 10,
    fontSize: 24,
    padding: 5,
  },
});
