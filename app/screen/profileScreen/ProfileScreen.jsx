import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Modal,
  Linking,
  Alert,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import colours from "../../../src/COLOURS";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { BASE_URL } from "@env";
import { InstagramIcon } from "../../../assets/SVGs/InstagramIcon";
import { BackIcon } from "../../../assets/SVGs/BackIcon";
import ShadowWrapper from "../../components/ShadowWrapper";
import { AuthContext } from "../../contexts/AuthContext";
import Feather from "react-native-vector-icons/Feather";

export default function ProfileScreen({ navigation }) {
  const [userData, setUserData] = useState("");
  const [modal, setModal] = useState(false);

  const { userToken, logout } = useContext(AuthContext);

  async function getUserData() {
    if (userToken) {
      axios.post(`${BASE_URL}/userdata`, { token: userToken }).then((res) => {
        setUserData(res.data.data);
      });
    }
  }

  const handleBack = () => {
    navigation.navigate("Home");
  };

  const handleDelete = async () => {
    axios.post(`${BASE_URL}/delete-user`, { id: userData._id }).then((res) => {
      console.log(res.data);
    });
    logout();
  };

  useEffect(() => {
    getUserData();
  }, []);

  const openInstagram = () => {
    const url = "https://www.instagram.com/whiskers_and_wings_/";
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert("Cannot open URL");
        }
      })
      .catch((err) =>
        console.error("An error occured opening instagram link: " + err)
      );
  };

  return (
    <View style={styles.main}>
      {userToken && (
        <>
          <View style={styles.top}>
            <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
              <BackIcon />
            </TouchableOpacity>
            <Text
              style={{
                fontSize: 30,
                color: "black",
                fontFamily: "Poppins-SemiBold",
                letterSpacing: 2,
                marginTop: 20,
              }}
            >
              Profile
            </Text>
            <View style={styles.picContainer}>
              <Image
                source={require("../../../assets/images/default.jpg")}
                style={{ resizeMode: "cover", height: "100%", width: "100%" }}
              />
              {/* <View style={styles.editIconContainer}>
                <Feather name="edit-2" size={20} color="#fff" />
              </View> */}
            </View>
          </View>

          <ShadowWrapper style={[styles.bottom, styles.profileCard]}>
            <View style={styles.categoryRow}>
              <Text style={styles.categoryLabel}>Username:</Text>
              <Text style={styles.categoryValue}>{userData?.name}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.categoryRow}>
              <Text style={styles.categoryLabel}>Email:</Text>
              <Text style={styles.categoryValue}>{userData?.email}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.categoryRow}>
              <Text style={styles.categoryLabel}>Phone{"\n"}Number:</Text>
              <Text style={styles.categoryValue}>{userData?.mobile}</Text>
            </View>

            <View style={{ height: 20 }} />

            <TouchableOpacity style={styles.categoryButton} onPress={logout}>
              <Text style={styles.categoryButtonText}>Log Out</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.categoryButton, styles.deleteButton]}
              onPress={() => setModal(true)}
            >
              <Text style={[styles.categoryButtonText, { color: "#fff" }]}>
                Delete Account
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.socialLinks}
              onPress={openInstagram}
            >
              <InstagramIcon color={colours.lightStroke} />
              <Text style={styles.socialLinkText}> @whiskers_and_wings_</Text>
            </TouchableOpacity>
          </ShadowWrapper>

          <Modal visible={modal} transparent={true} animationType="fade">
            <View
              style={{
                flex: 1,
                backgroundColor: "rgba(0,0,0,0.7)",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View style={styles.deleteConfirmModal}>
                <Text
                  style={{
                    fontFamily: "Poppins-Regular",
                    fontSize: 20,
                    textAlign: "center",
                  }}
                >
                  Are you sure you want to delete your account?
                </Text>
                <View style={styles.btnCont}>
                  <TouchableOpacity
                    style={styles.confirmBtn}
                    onPress={handleDelete}
                  >
                    <Text
                      style={{
                        fontFamily: "Poppins-Regular",
                        fontSize: 18,
                      }}
                    >
                      Yes
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.confirmBtn}
                    onPress={() => setModal(false)}
                  >
                    <Text
                      style={{
                        fontFamily: "Poppins-Regular",
                        fontSize: 18,
                      }}
                    >
                      No
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </>
      )}

      {!userToken && (
        <View
          style={{
            backgroundColor: colours.primary,
            justifyContent: "center",
            alignItems: "center",
            flexGrow: 1,
          }}
        >
          <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
            <BackIcon />
          </TouchableOpacity>
          <ShadowWrapper style={styles.dropShadowStyle}>
            <View
              style={{
                height: 550,
                width: 300,
                backgroundColor: colours.white,
                borderRadius: 20,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={[
                  styles.categoryText,
                  { fontFamily: "Poppins-SemiBold" },
                ]}
              >
                {" "}
                Hi Guest, You need to sign in!
              </Text>
              <TouchableOpacity
                onPress={logout}
                style={{
                  height: 50,
                  width: 100,
                  backgroundColor: colours.tertiary,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: colours.brownStroke,
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 20,
                }}
              >
                <Text
                  style={[
                    styles.categoryText,
                    { fontSize: 14, fontFamily: "Poppins-SemiBold" },
                  ]}
                >
                  Sign In
                </Text>
              </TouchableOpacity>
            </View>
          </ShadowWrapper>
          <TouchableOpacity style={styles.socialLinks} onPress={openInstagram}>
            <InstagramIcon color={colours.lightStroke} />
            <Text style={styles.socialLinkText}> @whiskers_and_wings_</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: colours.primary,
  },
  top: {
    width: "100%",
    height: "45%",
    backgroundColor: colours.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  picContainer: {
    width: 150,
    height: 150,
    borderRadius: 150,
    borderWidth: 1,
    borderColor: "black",
    margin: "5%",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "10%",
    backgroundColor: "#fff",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
  },
  editIconContainer: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: colours.primary,
    borderRadius: 12,
    padding: 4,
    elevation: 4,
  },
  bottom: {
    position: "absolute",
    top: "43%",
    width: "100%",
    padding: 30,
    backgroundColor: "transparent",
  },
  profileCard: {
    backgroundColor: colours.white,
    borderRadius: 25,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    // marginHorizontal: 16,
  },
  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryLabel: {
    fontFamily: "Poppins-SemiBold",
    color: colours.heading,
    fontSize: 20,
    width: 130,
  },
  categoryValue: {
    fontFamily: "Poppins-Regular",
    color: colours.heading,
    fontSize: 20,
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 8,
    width: "100%",
  },
  categoryButton: {
    backgroundColor: colours.secondary,
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 32,
    alignItems: "center",
    marginVertical: 8,
    elevation: 2,
    borderColor: colours.lightStroke,
    borderWidth: 1,
  },
  categoryButtonText: {
    color: "#fff",
    fontFamily: "Poppins-SemiBold",
    fontSize: 18,
  },
  deleteButton: {
    backgroundColor: "#D69197",
    borderColor: "#8E121E",
    borderWidth: 1,
  },
  socialLinks: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    backgroundColor: "#F6F6F6",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  socialLinkText: {
    fontFamily: "Poppins-Regular",
    color: colours.heading,
    fontSize: 18,
    marginLeft: 8,
  },
  dropShadowStyle: {
    shadowColor: colours.dropShadowColour,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 1,
  },
  deleteConfirmModal: {
    width: 350,
    height: 180,
    borderRadius: 20,
    backgroundColor: colours.tertiary,
    justifyContent: "center",
    padding: "5%",
    borderWidth: 2,
    borderColor: colours.brownStroke,
  },
  btnCont: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 20,
  },
  confirmBtn: {
    width: 80,
    height: 35,
    borderRadius: 10,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colours.brownStroke,
  },
  backBtn: {
    position: "absolute",
    top: 45,
    left: 5,
  },
});
