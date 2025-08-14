import {
  Alert,
  Button,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { memo, useEffect, useState } from "react";
import colours from "../../src/COLOURS";
import { useNavigation } from "@react-navigation/native";
import CountryFlag from "react-native-country-flag";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaleIcon } from "../../assets/SVGs/MaleIcon";
import { FemaleIcon } from "../../assets/SVGs/FemaleIcon";
import { HeartIcon } from "../../assets/SVGs/HeartIcon";
import { HeartFilledIcon } from "../../assets/SVGs/HeartFilledIcon";
import { BackIcon } from "../../assets/SVGs/BackIcon";

const AdoptionModal = memo(({ selectedItem, onClose }) => {
  const navigation = useNavigation();
  const [wishlist, setWishlist] = useState(false);

  const handleAdopt = () => {
    onClose();
    navigation.navigate("AdoptionForm");
  };

  const saveWishlist = async (itemID) => {
    setWishlist(true);
    await AsyncStorage.getItem("wishlist").then((token) => {
      const res = JSON.parse(token);
      if (res !== null) {
        let data = res.find((val) => val === itemID);
        if (data == null) {
          res.push(itemID);
          AsyncStorage.setItem("wishlist", JSON.stringify(res));
          Alert.alert("Animal Favourited!");
        }
      } else {
        let wishlist = [];
        wishlist.push(itemID);
        AsyncStorage.setItem("wishlist", JSON.stringify(wishlist));
        Alert.alert("Animal Favourited!");
      }
    });
  };

  const removeWishlist = async (itemID) => {
    setWishlist(false);
    const wishlist = await AsyncStorage.getItem("wishlist").then((token) => {
      const res = JSON.parse(token);
      return res.filter((id) => id !== itemID);
    });

    await AsyncStorage.setItem("wishlist", JSON.stringify(wishlist));
    Alert.alert("Animal Unfavourited :(");
  };

  const renderWishlist = async (itemID) => {
    await AsyncStorage.getItem("wishlist").then((token) => {
      const res = JSON.parse(token);
      if (res != null) {
        let data = res.find((val) => val === itemID);
        return data == null ? setWishlist(false) : setWishlist(true);
      }
    });
  };

  useEffect(() => {
    renderWishlist(selectedItem?._id);
  }, []);

  return (
    <View style={styles.modalContainer}>
      <View style={styles.top}>
        <Image
          source={{
            uri:
              selectedItem?.imageURL ||
              "https://hips.hearstapps.com/hmg-prod/images/dog-puppy-on-garden-royalty-free-image-1586966191.jpg?crop=0.752xw:1.00xh;0.175xw,0&resize=1200:*",
          }}
          style={{ width: "100%", height: "100%" }}
        />

        <TouchableOpacity style={styles.backBtn} onPress={onClose}>
          <BackIcon />
        </TouchableOpacity>
      </View>

      <View style={styles.bottom}>
        <View style={styles.header}>
          <Text
            style={{
              fontFamily: "Poppins-Bold",
              color: colours.heading2,
              fontSize: 38,
              letterSpacing: 4.2,
            }}
          >
            {selectedItem?.Name}
          </Text>

          <View style={styles.rightHeader}>
            <TouchableOpacity
              style={{ width: "50%", height: "100%", marginRight: -20 }}
              onPress={() =>
                wishlist
                  ? removeWishlist(selectedItem?._id)
                  : saveWishlist(selectedItem?._id)
              }
            >
              {wishlist ? (
                <HeartFilledIcon height={45} width={45} />
              ) : (
                <HeartIcon height={45} width={45} />
              )}
            </TouchableOpacity>

            <View style={{ width: "50%", height: "100%" }}>
              {selectedItem?.Gender === "Male" && (
                <MaleIcon height={45} width={45} />
              )}
              {selectedItem?.Gender === "Female" && (
                <FemaleIcon height={45} width={45} />
              )}
            </View>
          </View>
        </View>

        <Text
          style={{
            fontFamily: "Poppins-Regular",
            color: colours.secondary,
            fontSize: 18,
            letterSpacing: 2,
            paddingHorizontal: "5%",
          }}
        >
          {selectedItem?.Age || ""}
        </Text>

        <View style={styles.countryCont}>
          <Text
            style={{
              fontFamily: "Poppins-Regular",
              color: colours.secondary,
              fontSize: 18,
              letterSpacing: 2,
            }}
          >
            Country:{" "}
          </Text>
          <Text
            style={{
              fontFamily: "Poppins-Regular",
              color: "black",
              fontSize: 18,
              letterSpacing: 2,
            }}
          >
            {selectedItem?.Country}
          </Text>
          <CountryFlag isoCode={"om"} size={20} style={{ marginLeft: "2%" }} />
        </View>

        <View style={styles.line} />

        <ScrollView contentContainerStyle={styles.descriptionCont}>
          <Text style={styles.descriptionText}>
            {selectedItem?.Description}
          </Text>
        </ScrollView>

        {selectedItem?.Shelter === "Muscat Dog Adoption" && (
          <TouchableOpacity style={styles.adoptBtn} onPress={handleAdopt}>
            <Text
              style={{
                color: colours.heading2,
                fontFamily: "Poppins-SemiBold",
                fontSize: 25,
              }}
            >
              Adopt
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
});

export default AdoptionModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
  },

  top: {
    width: "100%",
    height: "55%",
    justifyContent: "center",
    alignItems: "center",
  },

  backBtn: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: colours.primary,
    justifyContent: "center",
    alignItems: "center",

    position: "absolute",
    top: "8%",
    left: "2%",
  },

  bottom: {
    width: "100%",
    height: "55%",
    position: "absolute",
    top: "45%",
    borderRadius: 20,
    backgroundColor: colours.white,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: "5%",
    paddingHorizontal: "5%",
    height: "16%",
  },

  rightHeader: {
    flexDirection: "row",
    width: "40%",
    height: "100%",
    marginTop: 10,
    marginRight: -40,
    // alignItems:'flex-end'
  },

  countryCont: {
    flexDirection: "row",
    paddingHorizontal: "5%",
  },

  line: {
    marginVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "black",
  },

  descriptionCont: {
    paddingHorizontal: "5%",
    // height:'90%',
    width: "100%",
    // backgroundColor:'black'
  },

  descriptionText: {
    fontFamily: "Nunito",
    fontSize: 15,
    color: colours.heading2,
    marginBottom: "5%",
  },

  adoptBtn: {
    height: 60,
    width: 200,
    backgroundColor: colours.tertiary,
    borderWidth: 2,
    borderColor: colours.brownStroke,
    borderRadius: 20,
    marginBottom: "7%",
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
