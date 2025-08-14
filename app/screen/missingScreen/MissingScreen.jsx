import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  Image,
  FlatList,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import colours from "../../../src/COLOURS";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "@env";
import TopBar from "../../components/TopBar";
import ShadowWrapper from "../../components/ShadowWrapper";
import { Shadow } from "react-native-shadow-2";
import LoadingIndicator from "../../components/LoadingIndicator";
import { Grid } from "../../../assets/SVGs/Grid";
import { Carousel } from "../../../assets/SVGs/Carousel";
import AnimalCard from "../../components/AnimalCard";

export default function MissingScreen() {
  const navigation = useNavigation();

  const handleProfile = () => {
    navigation.navigate("Profile");
  };

  const handleWishList = () => {
    navigation.navigate("Wishlist");
  };

  const [missingAnimals, setMissingAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [layout, setLayout] = useState("grid");

  useEffect(() => {
    const fetchMissingAnimals = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/get-missing-animals`);
        setMissingAnimals(response.data.data);
      } catch (error) {
        console.error("Error fetching missing animals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMissingAnimals();
    console.log(missingAnimals);
  }, []);

  return (
    <View style={styles.main}>
      <TopBar
        handleProfile={handleProfile}
        handleWishList={handleWishList}
      ></TopBar>

      <View style={{ alignItems: "center", marginTop: "5%", width: "100%" }}>
        <Text
          style={{
            fontFamily: "Poppins-Bold",
            fontSize: 25,
            color: colours.heading2,
          }}
        >
          Missing Animals
        </Text>

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

        {loading && <LoadingIndicator message={"Fetching Missing Animals"} />}

        {missingAnimals.length === 0 && !loading && (
          <ShadowWrapper style={styles.messageBox}>
            <Text
              style={{
                fontFamily: "Poppins-Regular",
                fontSize: 15,
                color: colours.white,
              }}
            >
              YAY! There are no missing animals!
            </Text>
            <Image
              source={require("../../../assets/images/adoptions-static-icon.png")}
              style={{ width: 60, height: 60 }}
            />
          </ShadowWrapper>
        )}

        {missingAnimals.length !== 0 && !loading && (
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
            data={missingAnimals}
            removeClippedSubviews={true}
            renderItem={({ item }) => {
              return <AnimalCard item={item} layout={layout} />;
            }}
          />
        )}
      </View>
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

  messageBox: {
    height: "75%",
    width: 300,
    borderRadius: 20,
    backgroundColor: "#462D14",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "4%",
  },

  dropShadowStyle: {
    shadowColor: colours.dropShadowColour,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.7,
    shadowRadius: 1,
  },

  layoutCont: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: "6%",
  },
});
