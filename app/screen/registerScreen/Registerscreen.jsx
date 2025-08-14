import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  Modal,
} from "react-native";
import React, { useState, useRef } from "react";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontListo from "react-native-vector-icons/Fontisto";
import Feather from "react-native-vector-icons/Feather";
import Error from "react-native-vector-icons/MaterialIcons";
import axios from "axios";

import { useNavigation } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import PhoneInput from "react-native-phone-number-input";
import colours from "../../../src/COLOURS";
import { CheckBox } from "@rneui/themed";

import { BASE_URL } from "@env";

export default function Registerscreen() {
  const navigation = useNavigation();

  const [username, onChangeUsername] = useState("");
  const [usernameVerify, setUsernameVerify] = useState(false);

  const [password, onChangePassword] = useState("");
  const [passwordVerify, setPasswordVerify] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [email, onChangeEmail] = useState("");
  const [emailVerify, setEmailVerify] = useState(false);

  const [mobile, onChangeMobile] = useState("");
  const [mobileVerify, setMobileVerify] = useState(true);

  const [checked, setChecked] = useState(false);
  const toggleCheckbox = () => setChecked(!checked);

  const [showTermsModal, setShowTermsModal] = useState(false);

  const scrollRef = useRef(null);
  const passwordInputRef = useRef(null);

  function handleSubmit() {
    const userData = {
      name: username,
      email: email,
      mobile: mobile,
      password: password,
    };

    if (
      usernameVerify &&
      emailVerify &&
      mobileVerify &&
      passwordVerify &&
      checked
    ) {
      axios
        .post(`${BASE_URL}/register`, userData)
        .then((res) => {
          if (res.data.status == "ok") {
            Alert.alert("Registered Successfully!");
          } else if (res.data.status == "User Exists") {
            Alert.alert("A user with this email already exists.");
          } else {
            Alert.alert(JSON.stringify(res.data));
          }
        })
        .catch((e) => console.log(e));
    } else if (
      !checked &&
      usernameVerify &&
      emailVerify &&
      mobileVerify &&
      passwordVerify
    ) {
      Alert.alert("Please Accept the Terms and Conditions");
    } else {
      Alert.alert("Fill mandatory details");
    }
  }

  function handleUsername(e) {
    const nameVar = e.nativeEvent.text;
    onChangeUsername(nameVar);
    setUsernameVerify(false);

    if (nameVar.length > 1) {
      setUsernameVerify(true);
    }
  }

  function handleEmail(e) {
    const emailVar = e.nativeEvent.text;
    onChangeEmail(emailVar);
    setEmailVerify(false);

    if (/^[\w.%+-]+@[\w.-]+\.[a-zA-z]{1,}$/.test(emailVar)) {
      setEmailVerify(true);
    }
  }

  function handleMobile(e) {
    const mobileVar = e;
    onChangeMobile(mobileVar);
    setMobileVerify(false);

    if (mobileVar.length >= 8) {
      setMobileVerify(true);
    }
  }

  function handlePassword(e) {
    const passwordVar = e.nativeEvent.text;
    onChangePassword(passwordVar);
    setPasswordVerify(false);

    if (/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/.test(passwordVar)) {
      setPasswordVerify(true);
    }
  }

  return (
    <View style={styles.registerContainer}>
      <KeyboardAwareScrollView
        ref={scrollRef}
        enableOnAndroid
        keyboardShouldPersistTaps="handled"
        scrollEnabled={false} // disables manual scrolling
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View style={styles.loginContainer}>
          <Text
            style={{
              margin: 20,
              fontFamily: "Poppins-Bold",
              fontSize: 20,
              color: "black",
            }}
          >
            Create your account
          </Text>

          <Image
            source={require("../../../assets/images/brown-wrapped-whiskers-and-wings-logo.png")}
            style={styles.logo}
          />

          {/* Username */}
          <View style={styles.fieldCont}>
            <FontAwesome
              name="user-o"
              colour="#420475"
              style={styles.smallIcon}
            />
            <TextInput
              style={styles.textInput}
              onChange={(e) => handleUsername(e)}
              value={username}
              placeholder="Username"
            />
            {username.length < 1 ? null : usernameVerify ? (
              <Feather name="check-circle" color="green" size={20} />
            ) : (
              <Error name="error" color="red" size={20} />
            )}
          </View>
          {username.length < 1 ? null : usernameVerify ? null : (
            <Text style={styles.errorText}>
              Username should be more than 1 character
            </Text>
          )}

          {/* Email Address */}
          <View style={styles.fieldCont}>
            <FontListo name="email" colour="#420475" style={styles.smallIcon} />
            <TextInput
              style={styles.textInput}
              onChange={(e) => handleEmail(e)}
              value={email}
              placeholder="Email"
            />
            {email.length < 1 ? null : emailVerify ? (
              <Feather name="check-circle" color="green" size={20} />
            ) : (
              <Error name="error" color="red" size={20} />
            )}
          </View>
          {email.length < 1 ? null : emailVerify ? null : (
            <Text style={styles.errorText}>Enter a valid email address</Text>
          )}

          {/* Mobile */}
          <PhoneInput
            containerStyle={styles.phoneField}
            codeTextStyle={{ fontSize: 15, fontFamily: "Poppins-SemiBold" }}
            textInputStyle={styles.textInput}
            countryPickerButtonStyle={{ width: "30%" }}
            defaultCode="OM"
            defaultValue=""
            layout="second"
            onChangeText={(text) => {
              handleMobile(text);
            }}
          />

          {/* Password */}
          <View style={styles.fieldCont}>
            <View style={styles.iconCont}>
              <FontAwesome
                name="lock"
                colour="#420475"
                style={styles.smallIcon}
              />
            </View>
            <TextInput
              ref={passwordInputRef}
              style={styles.textInput}
              onChange={(e) => handlePassword(e)}
              value={password}
              secureTextEntry={showPassword}
              placeholder="Password"
              onFocus={() => {
                if (scrollRef.current && passwordInputRef.current) {
                  scrollRef.current.scrollToFocusedInput(
                    passwordInputRef.current,
                    60
                  );
                }
              }}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              {password.length < 1 ? null : !showPassword ? (
                <Feather
                  name="eye-off"
                  style={{ marginRight: 5 }}
                  color={passwordVerify ? "green" : "red"}
                  size={23}
                />
              ) : (
                <Feather
                  name="eye"
                  style={{ marginRight: 5 }}
                  color="green"
                  size={23}
                />
              )}
            </TouchableOpacity>
            {password.length < 1 ? null : passwordVerify ? (
              <Feather
                name="check-circle"
                color={passwordVerify ? "green" : "red"}
                size={20}
              />
            ) : (
              <Error name="error" color="red" size={20} />
            )}
          </View>
          {password.length < 1 ? null : passwordVerify ? null : (
            <Text style={styles.errorText}>
              Password must have one lowercase, one uppercase and 6 or more
              characters
            </Text>
          )}

          {/* Terms and Conditions  */}
          <View style={styles.termsCont}>
            <CheckBox
              checked={checked}
              onPress={toggleCheckbox}
              iconType="material-community"
              checkedIcon="checkbox-marked"
              uncheckedIcon="checkbox-blank-outline"
              uncheckedColor={colours.brownStroke}
              checkedColor={colours.secondary}
            />
            <TouchableOpacity
              onPress={() => {
                setShowTermsModal(true);
              }}
            >
              <Text
                style={{
                  color: colours.heading2,
                  fontFamily: "Poppins-Regular",
                  fontSize: 11,
                  marginLeft: -15,
                }}
              >
                I accept the{" "}
                <Text
                  style={{
                    color: colours.heading2,
                    fontFamily: "Poppins-Regular",
                    fontSize: 11,
                    textDecorationLine: "underline",
                  }}
                >
                  terms and conditions
                </Text>
                .
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={{
              height: 75,
              width: 85,
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
            navigation.navigate("Login");
          }}
        >
          <Text
            style={{
              color: "#ECE3D5",
              fontFamily: "Poppins-Regular",
              textDecorationLine: "underline",
            }}
          >
            Already a member? Go Sign In!
          </Text>
        </TouchableOpacity>

        <Modal
          visible={showTermsModal}
          animationType="slide"
          transparent={true}
        >
          <View style={styles.modalCont}>
            <ScrollView
              contentContainerStyle={{ marginTop: 30 }}
              showsVerticalScrollIndicator={false}
            >
              <Text
                style={{
                  color: colours.heading2,
                  fontSize: 25,
                  fontFamily: "Poppins-Bold",
                  alignSelf: "center",
                }}
              >
                Terms and Conditions
              </Text>

              <View style={{ height: 20 }} />

              <Text
                style={{
                  color: colours.heading2,
                  fontSize: 16,
                  fontWeight: "bold",
                  fontFamily: "Nunito",
                }}
              >
                By using Whiskers and Wings, you agree to the following:
              </Text>

              <View style={{ height: 10 }} />

              <Text
                style={{
                  color: colours.heading2,
                  fontSize: 14,
                  fontFamily: "Nunito",
                }}
              >
                1. Limited Use of Contact Information: We only use your phone
                number and email for the purpose of contacting you regarding
                reports, adoptions, or any other interactions initiated by you
                through our platform.
              </Text>

              <View style={{ height: 10 }} />

              <Text
                style={{
                  color: colours.heading2,
                  fontSize: 14,
                  fontFamily: "Nunito",
                }}
              >
                2. Privacy Assurance: Your contact information will not be
                shared, sold, or used for any other purpose beyond necessary
                communication related to your involvement with Whiskers and
                Wings.
              </Text>

              <View style={{ height: 20 }} />

              <Text
                style={{
                  color: colours.heading2,
                  fontSize: 16,
                  fontWeight: "bold",
                  fontFamily: "Nunito",
                }}
              >
                If you choose to take home any animal facilitated through
                Whiskers and Wings, you, the user, agree to the following terms
                and conditions:
              </Text>

              <View style={{ height: 10 }} />

              <Text
                style={{
                  color: colours.heading2,
                  fontSize: 14,
                  fontFamily: "Nunito",
                }}
              >
                1. Assumption of Risk: You acknowledge and understand that
                working with or adopting animals carries inherent risks,
                including but not limited to the possibility of injury, attack,
                or harm from the animal, regardless of the animal's temperament.
                This includes any special cases where you believe the animal may
                have exhibited symptoms of illness, including but not limited to
                rabies.
              </Text>

              <View style={{ height: 10 }} />

              <Text
                style={{
                  color: colours.heading2,
                  fontSize: 14,
                  fontFamily: "Nunito",
                }}
              >
                2. No Liability for Injuries or Harm: Once you choose to take an
                animal home, Whiskers and Wings is not responsible or liable for
                any injury, harm, illness, or attack that may occur after the
                adoption or interaction with the animal. This includes, but is
                not limited to, bites, scratches, or other forms of physical
                injury caused by the animal.
              </Text>

              <View style={{ height: 10 }} />

              <Text
                style={{
                  color: colours.heading2,
                  fontSize: 14,
                  fontFamily: "Nunito",
                }}
              >
                3. Responsibility for Animal's Health: You agree that it is your
                responsibility to ensure the proper care, health, and well-being
                of the animal once you have taken it into your custody. Whiskers
                and Wings is not responsible for any medical conditions or
                treatments required after the adoption.
              </Text>

              <View style={{ height: 10 }} />

              <Text
                style={{
                  color: colours.heading2,
                  fontSize: 14,
                  fontFamily: "Nunito",
                }}
              >
                4. Rabies or Suspected Illness: In any case where you suspect
                that the animal may have rabies or any other illness, Whiskers
                and Wings holds no liability for any issues or medical
                treatments that may arise. You are solely responsible for
                seeking the appropriate medical attention for both yourself and
                the animal.
              </Text>

              <View style={{ height: 10 }} />

              <Text
                style={{
                  color: colours.heading2,
                  fontSize: 14,
                  fontFamily: "Nunito",
                }}
              >
                5. Indemnification: You agree to indemnify and hold harmless
                Whiskers and Wings, its employees, volunteers, and partners from
                any claims, actions, damages, or liabilities arising from your
                decision to take an animal home or from any injury or harm that
                may occur thereafter.
              </Text>

              <View style={{ height: 20 }} />

              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => {
                  setShowTermsModal(false);
                }}
              >
                <Text
                  style={{
                    color: colours.white,
                    fontSize: 25,
                    fontFamily: "Poppins-SemiBold",
                  }}
                >
                  Continue
                </Text>
              </TouchableOpacity>

              <View style={{ height: 50 }} />
            </ScrollView>
          </View>
        </Modal>
      </KeyboardAwareScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  registerContainer: {
    backgroundColor: "#2B1107",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },

  logo: {
    height: 130,
    width: 130,
    marginBottom: 10,
  },

  loginContainer: {
    backgroundColor: "#FFFDFD",
    width: 300,
    height: 700,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "space-evenly",
    padding: 10,
    marginBottom: 20,
    shadowColor: "black",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 20,
  },

  textInput: {
    color: "black",
    fontFamily: "Poppins-SemiBold",
    fontSize: 15,
    flex: 1,
  },

  fieldCont: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "black",
    borderRadius: 10,
    marginBottom: 10,
    height: 60,
    width: 260,
  },

  smallIcon: {
    marginHorizontal: 10,
    fontSize: 24,
  },

  iconCont: {
    alignItems: "center",
    justifyContent: "center",
  },

  phoneField: {
    borderWidth: 2,
    borderColor: "black",
    width: 260,
    height: 60,
    padding: 2,
    marginBottom: 10,
    borderRadius: 10,
  },

  termsCont: {
    flexDirection: "row",
    width: 270,
    alignItems: "center",
  },

  modalCont: {
    backgroundColor: colours.primary,
    justifyContent: "center",
    flexGrow: 1,
    padding: "5%",
  },

  closeBtn: {
    width: "90%",
    backgroundColor: colours.navbar,
    alignSelf: "center",
    padding: "5%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
  },

  errorText: {
    color: "red",
    marginTop: -7,
    fontFamily: "Poppins-Regular",
    fontSize: 12,
    // alignSelf: "center",
  },
});
