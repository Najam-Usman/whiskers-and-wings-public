import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Modal,
  Button,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import colours from "../../../src/COLOURS";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import AnimalCard from "../../components/AnimalCard";
import { useNavigation } from "@react-navigation/native";
import AdoptionModal from "../../components/AdoptionModal";
import { BASE_URL } from "@env";
import LoadingIndicator from "../../components/LoadingIndicator";
import TopBar from "../../components/TopBar";
import { HeartIcon } from "../../../assets/SVGs/HeartIcon";
import ShadowWrapper from "../../components/ShadowWrapper";
import { Grid } from "../../../assets/SVGs/Grid";
import { Carousel } from "../../../assets/SVGs/Carousel";

export default function ActualAdoptionScreen() {
  const [AdoptionAnimalData, setAdoptionAnimalData] = useState([]);
  const [filteredAnimals, setFilteredAnimals] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("All");

  const [loading, setLoading] = useState(false);

  const [layout, setLayout] = useState("grid");

  const navigation = useNavigation();

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

  async function getAllData() {
    setLoading(true);
    axios.get(`${BASE_URL}/get-data`).then((res) => {
      setAdoptionAnimalData(res.data.data);
      setFilteredAnimals(res.data.data);
    });
    setLoading(false);
  }

  const handleProfile = () => {
    navigation.navigate("Profile");
  };

  const handleWishList = () => {
    navigation.navigate("Wishlist");
  };

  const filterAnimals = (animals, filter) => {
    // setIsLoading(true)

    if (filter == "All") {
      // return animals
      setFilteredAnimals(animals);
    } else {
      // console.log("Filtering animals for: " + filter)
      const toReturn = animals.filter((animal) => animal.AnimalType === filter);
      // setIsLoading(false)
      setFilteredAnimals(toReturn);
      // return toReturn
    }
  };

  const handleAllFilter = () => {
    setSelectedFilter("All");
  };

  const handleDogFilter = () => {
    console.log("Dog Filter Pressed");
    setSelectedFilter("Dog");
    filterAnimals(AdoptionAnimalData, "Dog");
  };

  const handleCatFilter = () => {
    console.log("Cat Filter Pressed");
    setSelectedFilter("Cat");
    filterAnimals(AdoptionAnimalData, "Cat");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${BASE_URL}/get-data`);
        setAdoptionAnimalData(res.data.data);
        setFilteredAnimals(res.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // const filteredAnimals = filterAnimals(AdoptionAnimalData, selectedFilter)
  // setIsLoading(false)

  return (
    <View style={styles.main}>
      <TopBar
        handleProfile={handleProfile}
        handleWishList={handleWishList}
      ></TopBar>

      <Text
        style={{
          fontFamily: "Poppins-SemiBold",
          marginTop: "5%",
          alignSelf: "center",
          fontSize: 22,
        }}
      >
        Meet your BestFriend
      </Text>

      <View style={styles.filterCont}>
        <ShadowWrapper
          style={[
            styles.dropShadowStyle,
            { shadowOpacity: selectedFilter === "Dog" ? 0.7 : 0 },
          ]}
        >
          <TouchableOpacity style={styles.filterBtn} onPress={handleDogFilter}>
            <Text style={[styles.btnText]}> Dogs</Text>
          </TouchableOpacity>
        </ShadowWrapper>

        <TouchableOpacity
          style={[
            styles.picContainer,
            { borderWidth: 0, margin: 0, marginTop: -5 },
          ]}
          onPress={handleWishList}
        >
          <HeartIcon height={42} width={42} />
        </TouchableOpacity>

        <ShadowWrapper
          style={[
            styles.dropShadowStyle,
            { shadowOpacity: selectedFilter === "Cat" ? 1 : 0 },
          ]}
        >
          <TouchableOpacity style={styles.filterBtn} onPress={handleCatFilter}>
            <Text style={styles.btnText}> Cats</Text>
          </TouchableOpacity>
        </ShadowWrapper>
      </View>

      <View style={styles.layoutCont}>
        <TouchableOpacity
          onPress={() => {
            setLayout("grid");
          }}
        >
          <Grid />
        </TouchableOpacity>

        <TouchableOpacity
          style={{ marginLeft: 20 }}
          onPress={() => {
            setLayout("carousel");
          }}
        >
          <Carousel />
        </TouchableOpacity>
      </View>

      <View style={styles.flatListContainer}>
        {loading && <LoadingIndicator message={"Looking for Animals 🐾🏡"} />}

        {filteredAnimals.length === 0 && !loading && (
          <View
            style={{
              alignItems: "center",
              marginTop: "5%",
              width: "100%",
            }}
          >
            <ShadowWrapper style={styles.dropShadowStyle}>
              <View style={styles.messageBox}>
                <Text
                  style={{
                    fontFamily: "Poppins-Regular",
                    fontSize: 16,
                    color: colours.heading2,
                    textAlign: "center",
                  }}
                >
                  Oops! There are no animals for this category right now.{" "}
                </Text>
                <Image
                  source={require("../../../assets/images/heart-paw-icon.png")}
                  style={{ width: 60, height: 60 }}
                />
              </View>
            </ShadowWrapper>
          </View>
        )}

        {filteredAnimals.length != 0 && !loading && (
          <FlatList
            key={layout === "grid" ? "Grid" : "Carousel"}
            showsHorizontalScrollIndicator={false}
            snapToAlignment={layout === "grid" ? "start" : "center"}
            decelerationRate={"fast"}
            horizontal={false}
            numColumns={layout === "grid" ? 2 : 1}
            snapToInterval={
              layout === "grid" ? Dimensions.get("window").height : 410
            }
            keyExtractor={(item, index) => item.id || index.toString()}
            data={filteredAnimals}
            removeClippedSubviews={true}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    openModal(item);
                  }}
                >
                  <AnimalCard item={item} layout={layout} />
                </TouchableOpacity>
              );
            }}
          />
        )}
      </View>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={closeModal}
      >
        <AdoptionModal selectedItem={selectedItem} onClose={closeModal} />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: colours.primary,
  },

  topBar: {
    marginTop: Platform.OS == "ios" ? "12%" : "6%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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

  btnText: {
    fontSize: 15,
    justifyContent: "space-between",
    fontFamily: "Poppins-SemiBold",
  },

  filterCont: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: "6%",
  },

  layoutCont: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: "6%",
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

  flatListContainer: {
    marginTop: "3%",
    alignItems: "center",
    justifyContent: "center",
    height: "60%",
    width: "100%",
  },

  dropShadowStyle: {
    shadowColor: colours.dropShadowColour,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.7,
    shadowRadius: 1,
  },

  messageBox: {
    height: "100%",
    width: 300,
    borderRadius: 20,
    backgroundColor: colours.white,
    justifyContent: "center",
    alignItems: "center",
    marginTop: "4%",
  },
});
