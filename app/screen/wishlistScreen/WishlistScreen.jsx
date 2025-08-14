import {
  Button,
  Dimensions,
  FlatList,
  Image,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import colours from "../../../src/COLOURS";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import AnimalCard from "../../components/AnimalCard";
import AdoptionModal from "../../components/AdoptionModal";
import { BASE_URL } from "@env";
import { HeartIcon } from "../../../assets/SVGs/HeartIcon";
import { BackIcon } from "../../../assets/SVGs/BackIcon";
import ShadowWrapper from "../../components/ShadowWrapper";

const WishlistScreen = () => {
  const navigation = useNavigation();

  const [wishListData, setWishListData] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // const [selectedFilter, setSelectedFilter] = useState('All')

  const handleBack = () => {
    console.log("back pressed");
    navigation.navigate("Home");
  };

  const openModal = useCallback(
    (item) => {
      if (selectedItem !== item) {
        setSelectedItem(item);
        setModalVisible(true);
      }
    },
    [selectedItem]
  );

  const closeModal = () => {
    setModalVisible(false);
    setSelectedItem(null);
  };

  // const filterAnimals = (animals, filter) => {
  //     if (filter == 'All') {
  //         return animals
  //     } else {
  //         return animals.filter(animal => animal.AnimalType === filter)
  //     }

  // }

  // const handleAllFilter = () => {
  //     setSelectedFilter('All')
  // }

  // const handleDogFilter = () => {
  //     setSelectedFilter('Dog')
  // }

  // const handleCatFilter = () => {
  //     setSelectedFilter('Cat')
  // }

  const fetchAnimalsById = async (animalIDs) => {
    try {
      const res = await axios.get(`${BASE_URL}/get-data-byIDs`, {
        params: { animalIDs },
      });
      return res.data.data;
    } catch (error) {
      console.error("Error fetching animals: ", error);
      if (error.code === "ECONNABORATED") {
        console.error("Timeout issue");
      }
    }
  };

  const fetchWishlist = async () => {
    try {
      const wishlistString = await AsyncStorage.getItem("wishlist");
      const wishlist = wishlistString ? JSON.parse(wishlistString) : [];

      if (wishlist.length > 0) {
        const animalIDs = wishlist;
        console.log(animalIDs);
        const animals = await fetchAnimalsById(animalIDs);

        // console.log("Animal Data: ", animals)
        setWishListData(animals);
      } else {
        console.log("Wishlist is empty");
      }
    } catch (error) {
      console.error("Error fetching wishlist: ", error);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  // const filteredAnimals = filterAnimals(wishListData, selectedFilter)

  // console.log("Filtered Animals: ", filteredAnimals)

  return (
    <View style={styles.main}>
      <View style={styles.cont}>
        <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
          <BackIcon />
        </TouchableOpacity>

        <Text
          style={{
            fontSize: 25,
            color: "black",
            fontFamily: "Poppins-Bold",
            marginTop: "18%",
            alignSelf: "center",
          }}
        >
          Meet your Best Friend
        </Text>

        {wishListData.length == 0 && (
          <View
            style={{ alignItems: "center", marginTop: "10%", width: "100%" }}
          >
            <ShadowWrapper style={styles.dropShadowStyle}>
              <View style={styles.messageBox}>
                <Text
                  style={{
                    fontFamily: "Poppins-SemiBold",
                    fontSize: 15,
                    color: colours.heading2,
                    textAlign: "center",
                    padding: 10,
                  }}
                >
                  Why haven’t you favorited any animals yet? Your perfect match
                  could be waiting!
                </Text>
                <Image
                  source={require("../../../assets/images/heart-paw-icon.png")}
                  style={{ width: 60, height: 60 }}
                />
              </View>
            </ShadowWrapper>
          </View>
        )}

        {wishListData.length >= 0 && (
          <View style={{ marginTop: "10%" }}>
            <FlatList
              showsHorizontalScrollIndicator={false}
              snapToAlignment="start"
              decelerationRate={"fast"}
              horizontal={false}
              numColumns={2}
              // snapToInterval={Dimensions.get("window").height}
              keyExtractor={(item, index) => item.id || index.toString()}
              data={wishListData}
              renderItem={({ item }) => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      openModal(item);
                    }}
                  >
                    <AnimalCard item={item} layout={"grid"} />
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        )}

        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={false}
          onRequestClose={closeModal}
        >
          <AdoptionModal selectedItem={selectedItem} onClose={closeModal} />
        </Modal>
      </View>
    </View>
  );
};

export default WishlistScreen;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: colours.primary,
    // alignItems:'center',
  },

  topBar: {
    marginTop: Platform.OS == "ios" ? "12%" : "6%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  picContainer: {
    width: 50,
    height: 50,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "black",
    margin: "5%",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },

  messageBox: {
    height: "80%",
    width: 300,
    borderRadius: 20,
    backgroundColor: colours.white,
    justifyContent: "center",
    alignItems: "center",
    marginTop: "4%",
  },

  backBtn: {
    width: 60,
    height: 60,
    position: "absolute",
    left: 0,
    top: 50,
  },

  filterCont: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: "6%",
  },

  filterBtn: {
    width: 110,
    height: 40,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colours.brownStroke,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colours.tertiary,
  },

  dropShadowStyle: {
    shadowColor: colours.dropShadowColour,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.7,
    shadowRadius: 1,
  },
});
