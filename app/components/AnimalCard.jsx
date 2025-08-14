import React, { useState, memo, useEffect } from "react";
import {
  Alert,
  FlatList,
  Image,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import colours from "../../src/COLOURS";
import { MaleIcon } from "../../assets/SVGs/MaleIcon";
import { FemaleIcon } from "../../assets/SVGs/FemaleIcon";
import { Shadow } from "react-native-shadow-2";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { HeartFilledIcon } from "../../assets/SVGs/HeartFilledIcon";
import { HeartIcon } from "../../assets/SVGs/HeartIcon";

const AnimalCard = memo(({ item, layout }) => {
  const [wishlist, setWishlist] = useState(false);

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
    renderWishlist(item?._id);
  }, []);

  return (
    <Shadow
      startColor={"rgba(166, 110, 58, 0.7)"}
      offset={[7.5, 5]}
      distance={1}
      style={[
        styles.card,
        {
          width: layout === "grid" ? 180 : 300,
          height: layout === "grid" ? 220 : 400,
        },
      ]}
    >
      <View
        style={{
          width: "85%",
          height: "65%",
          backgroundColor: "white",
          borderRadius: 20,
          alignSelf: "center",
          marginTop: "5%",
        }}
      >
        {item?.AnimalType === "Cat" && (
          <Image
            source={{
              uri:
                item?.imageURL ||
                "https://i.natgeofe.com/n/548467d8-c5f1-4551-9f58-6817a8d2c45e/NationalGeographic_2572187_3x4.jpg",
            }}
            style={{ width: "100%", height: "100%", borderRadius: 20 }}
          />
        )}

        {item?.AnimalType === "Dog" && (
          <Image
            source={{
              uri:
                item?.imageURL ||
                "https://hips.hearstapps.com/hmg-prod/images/dog-puppy-on-garden-royalty-free-image-1586966191.jpg?crop=0.752xw:1.00xh;0.175xw,0&resize=1200:*",
            }}
            style={{ width: "100%", height: "100%", borderRadius: 20 }}
          />
        )}
      </View>

      <View style={styles.bottomCard}>
        <View
          style={{
            height: "80%",
            width: "50%",
            marginTop: "3%",
            borderRadius: 20,
            justifyContent: "space-evenly",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                letterSpacing: 1,
                marginLeft: "15%",
                fontFamily: "Poppins-Regular",
                fontSize: layout === "grid" ? 11 : 18,
                color: colours.stroke,
              }}
            >
              {item?.Breed || ""}
            </Text>

            {item?.Gender === "Male" && (
              <MaleIcon
                height={layout === "grid" ? 20 : 40}
                width={layout === "grid" ? 20 : 40}
              />
            )}
            {item?.Gender === "Female" && (
              <FemaleIcon
                height={layout === "grid" ? 20 : 40}
                width={layout === "grid" ? 20 : 40}
              />
            )}
          </View>

          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{
              letterSpacing: 1,
              marginLeft: "15%",
              fontFamily: "Poppins-SemiBold",
              fontSize: layout === "grid" ? 14 : 24,
              color: colours.stroke,
            }}
          >
            {item?.Name || "Name"}
          </Text>
        </View>

        <View
          style={{
            height: layout === "grid" ? 25 : 50,
            width: layout === "grid" ? 25 : 50,
            marginTop: "5%",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 60,
            marginRight: "8%",
          }}
        >
          <TouchableOpacity
            style={{ width: "50%", height: "100%" }}
            onPress={() =>
              wishlist ? removeWishlist(item?._id) : saveWishlist(item?._id)
            }
          >
            {wishlist ? (
              <HeartFilledIcon
                height={layout === "grid" ? 25 : 45}
                width={layout === "grid" ? 25 : 45}
              />
            ) : (
              <HeartIcon
                height={layout === "grid" ? 25 : 45}
                width={layout === "grid" ? 25 : 45}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Shadow>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: colours.white,
    marginHorizontal: 8,
    borderRadius: 20,
    marginBottom: 15,
    // alignItems:'center',
  },

  bottomCard: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  cardText: {
    fontFamily: "Poppins",
    color: "white",
    fontSize: 10,
    flex: 1,
  },
});

export default AnimalCard;
