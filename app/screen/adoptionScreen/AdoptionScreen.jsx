import {
  StyleSheet,
  Text,
  View,
  Image,
  Platform,
  TouchableOpacity,
  ScrollView,
  Modal,
  FlatList,
  Linking,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import colours from "../../../src/COLOURS";
import { useNavigation } from "@react-navigation/native";
import TopBar from "../../components/TopBar";
import { Shadow } from "react-native-shadow-2";
import ShadowWrapper from "../../components/ShadowWrapper";
import partnerData from "./PartnerData";
import { InstagramIcon } from "../../../assets/SVGs/InstagramIcon";

export default function AdoptionScreen() {
  const navigation = useNavigation();

  const handleProfile = () => {
    navigation.navigate("Profile");
  };

  const handleWishList = () => {
    navigation.navigate("Wishlist");
  };

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedInfo, setSelectedInfo] = useState("");

  const openModal = (info) => {
    setSelectedInfo(info);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedInfo({});
  };

  const openInstagram = (url) => {
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert("Sorry, there was an error!");
        }
      })
      .catch((err) =>
        console.error("An error occured opening instagram link: " + err)
      );
  };

  return (
    <View style={styles.main}>
      <TopBar
        handleProfile={handleProfile}
        handleWishList={handleWishList}
      ></TopBar>

      <ScrollView
        contentContainerStyle={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View style={styles.textContainer}>
          <Text
            style={{
              fontFamily: "Poppins-Bold",
              color: colours.heading2,
              fontSize: 22,
            }}
          >
            Meet your Best Friend
          </Text>

          <Text
            style={{
              fontSize: 14,
              flexDirection: "row",
              flexWrap: "wrap",
              margin: 15,
              textAlign: "center",
              fontFamily: "Nunito",
              letterSpacing: 1.5,
            }}
          >
            By offering a loving home to animals in need, you provide a second
            chance and contribute to reducing the population of homeless pets.
            Adoption supports the vital work of shelters, creating a bond of
            gratitude and loyalty with your new furry friend. Join a community
            dedicated to the welfare of animals, make a positive difference!
          </Text>
        </View>

        <Text style={styles.heading2Text}>Our Partners</Text>

        <FlatList
          contentContainerStyle={styles.groupsContainer}
          key={"Carousel"}
          horizontal
          data={partnerData}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => {
            return (
              <View style={styles.group}>
                <TouchableOpacity
                  style={styles.groupLogo}
                  onPress={() => {
                    openModal(item);
                  }}
                >
                  <Image style={item.style} source={item.imageURL} />
                </TouchableOpacity>
                <Text style={styles.groupName}>{item.name}</Text>
              </View>
            );
          }}
        />

        <Text style={styles.heading2Text}>Forever Homes</Text>

        <View style={styles.foreverHomesCont}>
          <View
            style={{ margin: "5%", flexDirection: "row", flexWrap: "nowrap" }}
          >
            <Shadow
              startColor={"rgba(166, 110, 58, 0.7)"}
              offset={[-6, 25]}
              distance={10}
            >
              <Image
                source={require("../../../assets/images/foreverHomes1.jpg")}
                style={{
                  width: 230,
                  height: 220,
                  borderRadius: 15,
                  marginTop: 20,
                }}
              />
            </Shadow>

            <Image
              source={require("../../../assets/images/brown-highlighted-paw-icon.png")}
              style={{
                width: 210,
                height: 200,
                marginTop: "15%",
                transform: [{ rotate: "45deg" }],
              }}
            />

            <Shadow
              startColor={"rgba(166, 110, 58, 0.7)"}
              offset={[-340, 5]}
              distance={2}
              style={{
                width: 300,
                height: 65,
                position: "absolute",
                backgroundColor: "#FBFAF7",
                borderWidth: 1,
                borderColor: colours.lightStroke,
                borderRadius: 50,
                top: 0,
                right: 40,
                zIndex: 100,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={styles.storyText}>
                Axel, a beautiful puppy, was abandoned in a cardboard box. After
                a journey to the US with his siblings, Sky and Roby, he found
                his forever home.
              </Text>
            </Shadow>
          </View>

          <View
            style={{
              margin: "5%",
              flexDirection: "row",
              flexWrap: "nowrap",
              overflow: "visible",
            }}
          >
            <Image
              source={require("../../../assets/images/brown-highlighted-paw-icon.png")}
              style={{
                width: 210,
                height: 200,
                marginTop: "10%",
                transform: [{ rotate: "315deg" }],
              }}
            />

            <ShadowWrapper>
              <Image
                source={require("../../../assets/images/foreverHomes2.jpg")}
                style={{
                  width: 200,
                  height: 260,
                  borderRadius: 15,
                  position: "absolute",
                  left: "50%",
                  top: 30,
                }}
              />
            </ShadowWrapper>

            <ShadowWrapper>
              <View
                style={{
                  width: 300,
                  height: 65,
                  position: "absolute",
                  backgroundColor: "#FBFAF7",
                  borderWidth: 1,
                  borderColor: colours.lightStroke,
                  borderRadius: 50,
                  top: 5,
                  left: -185,
                  zIndex: 100,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={styles.storyText}>
                  Asal, a young puppy, was found alone on the streets in late
                  2022. He quickly found a loving home with a couple from the
                  UK.
                </Text>
              </View>
            </ShadowWrapper>
          </View>

          <View
            style={{
              margin: "5%",
              flexDirection: "row",
              flexWrap: "nowrap",
              marginTop: "20%",
            }}
          >
            <Shadow
              startColor={"rgba(166, 110, 58, 0.7)"}
              distance={10}
              offset={[-6, 25]}
            >
              <Image
                source={require("../../../assets/images/foreverHomes3.jpg")}
                style={{
                  width: 210,
                  height: 250,
                  borderRadius: 15,
                  marginTop: 20,
                }}
              />
            </Shadow>

            <Image
              source={require("../../../assets/images/brown-highlighted-paw-icon.png")}
              style={{
                width: 210,
                height: 200,
                marginTop: "15%",
                transform: [{ rotate: "45deg" }],
              }}
            />

            <Shadow
              startColor={"rgba(166, 110, 58, 0.7)"}
              offset={[-360, 3]}
              distance={3}
              style={{
                width: 320,
                height: 65,
                position: "absolute",
                backgroundColor: "#FBFAF7",
                borderWidth: 1,
                borderColor: colours.lightStroke,
                borderRadius: 50,
                top: 0,
                right: 40,
                zIndex: 100,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={styles.storyText}>
                Petra, a gorgeous puppy, was found abandoned under a bin with
                her brother Paddy. They were rescued and received medical
                treatment before finding their forever home.
              </Text>
            </Shadow>
          </View>

          <View style={{ height: 20 }} />

          <View
            style={{
              margin: "5%",
              flexDirection: "row",
              flexWrap: "nowrap",
              overflow: "visible",
            }}
          >
            <Image
              source={require("../../../assets/images/brown-highlighted-paw-icon.png")}
              style={{
                width: 210,
                height: 200,
                marginTop: "10%",
                transform: [{ rotate: "315deg" }],
              }}
            />

            <ShadowWrapper>
              <Image
                source={require("../../../assets/images/foreverHomes4.jpg")}
                style={{
                  width: 200,
                  height: 250,
                  borderRadius: 15,
                  position: "absolute",
                  left: "50%",
                  top: 30,
                }}
              />
            </ShadowWrapper>

            <ShadowWrapper>
              <View
                style={{
                  width: 310,
                  height: 65,
                  position: "absolute",
                  backgroundColor: "#FBFAF7",
                  borderWidth: 1,
                  borderColor: colours.lightStroke,
                  borderRadius: 50,
                  top: 5,
                  left: -185,
                  zIndex: 100,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={styles.storyText}>
                  June was found abandoned in Muscat as a young puppy. She
                  struggled to find a home there but was lucky enough to be
                  adopted by a loving family in the UK.{" "}
                </Text>
              </View>
            </ShadowWrapper>
          </View>

          <View style={{ height: 20 }} />

          <View
            style={{ margin: "5%", flexDirection: "row", flexWrap: "nowrap" }}
          >
            <Shadow
              startColor={"rgba(166, 110, 58, 0.7)"}
              offset={[-6, 25]}
              distance={10}
            >
              <Image
                source={require("../../../assets/images/foreverHomes5.jpg")}
                style={{
                  width: 230,
                  height: 260,
                  borderRadius: 15,
                  marginTop: 20,
                }}
              />
            </Shadow>

            <Image
              source={require("../../../assets/images/brown-highlighted-paw-icon.png")}
              style={{
                width: 210,
                height: 200,
                marginTop: "15%",
                transform: [{ rotate: "45deg" }],
              }}
            />

            <Shadow
              startColor={"rgba(166, 110, 58, 0.7)"}
              offset={[-340, 5]}
              distance={2}
              style={{
                width: 300,
                height: 65,
                position: "absolute",
                backgroundColor: "#FBFAF7",
                borderWidth: 1,
                borderColor: colours.lightStroke,
                borderRadius: 50,
                top: 0,
                right: 40,
                zIndex: 100,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={styles.storyText}>
                This brave boy was abandoned in Muscat and lost a leg due to an
                injury. Despite his hardships, he found a loving home in the
                United States.
              </Text>
            </Shadow>
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      <Modal
        visible={modalVisible}
        onRequestClose={closeModal}
        transparent={true}
        animationType="fade"
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.3)",
          }}
        >
          <View style={styles.modalContent}>
            <Text
              style={{
                fontFamily: "Poppins-Bold",
                color: colours.heading2,
                fontSize: 22,
              }}
            >
              About {selectedInfo.name}
            </Text>
            <Text
              style={{
                fontFamily: "Poppins-Regular",
                textAlign: "justify",
                fontSize: 12,
              }}
            >
              {selectedInfo.description}
            </Text>

            <TouchableOpacity
              style={styles.socialLinks}
              onPress={() => {
                openInstagram(selectedInfo.link);
              }}
            >
              <InstagramIcon color={colours.lightStroke} />
              <Text
                style={{
                  fontFamily: "Poppins-SemiBold",
                  color: colours.heading,
                  fontSize: 18,
                }}
              >
                {selectedInfo.name}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Text
                style={{ fontFamily: "Poppins-Regular", color: colours.white }}
              >
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: colours.primary,
  },

  modalContent: {
    height: "50%",
    width: "90%",
    backgroundColor: colours.tertiary,
    justifyContent: "space-around",
    alignItems: "center",
    alignSelf: "center",
    borderRadius: 30,
    padding: 15,
    borderWidth: 1,
    borderColor: colours.stroke,
  },

  closeButton: {
    width: 70,
    height: 30,
    backgroundColor: colours.secondary,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colours.stroke,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },

  topBar: {
    marginTop: Platform.OS == "ios" ? "12%" : "6%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  textContainer: {
    marginTop: "1%",
    alignItems: "center",
    justifyContent: "center",
  },

  groupsContainer: {
    margin: "1%",
    alignItems: "center",
  },

  group: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },

  groupLogo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "black",
    margin: 10,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colours.white,
  },

  groupName: {
    fontFamily: "Nunito",
    fontSize: 11,
    color: colours.heading,
  },

  socialLinks: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
  },

  heading2Text: {
    fontFamily: "Poppins-Bold",
    color: colours.heading2,
    fontSize: 18,
    marginLeft: "5%",
    alignSelf: "flex-start",
  },

  storyText: {
    padding: 5,
    fontFamily: "Nunito",
    fontSize: 11,
    textAlign: "center",
  },
});
