import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Image,
  Platform,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import React, { useContext, useEffect, useState, useRef } from "react";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import colours from "../../../src/COLOURS";
import axios from "axios";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useNavigation } from "@react-navigation/native";
import LoadingIndicator from "../../components/LoadingIndicator";
import NoLocationScreen from "../../components/NoLocationScreen";
import { BASE_URL, GOOGLE_API_KEY } from "@env";
import TopBar from "../../components/TopBar";
import ShadowWrapper from "../../components/ShadowWrapper";
import { AuthContext } from "../../contexts/AuthContext";
import Geocoder from "react-native-geocoding";
import { Slider as RNESlider } from "@miblanchard/react-native-slider";
import * as ImagePicker from "expo-image-picker";
import cld from "../../contexts/CloudinaryInstance";
import { upload } from "cloudinary-react-native";
import {
  Modal,
  Animated,
  Keyboard,
  TouchableWithoutFeedback,
  Dimensions,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import ConfettiCannon from "react-native-confetti-cannon";

export default function ReportScreen() {
  const { userToken } = useContext(AuthContext);

  const questions = [
    { text: "Description of the Animal", type: "text" },
    {
      text: "Upload photos (optional):",
      type: "image",
    },
    {
      text: "Visible Signs of Pain",
      type: "button",
      options: ["Yes", "I don't know", "No"],
    },

    {
      text: "Bleeding or Swelling",
      type: "button",
      options: ["Yes", "I don't know", "No"],
    },
    {
      text: "Changes in Behaviour",
      type: "button",
      options: ["Yes", "I don't know", "No"],
    },
    {
      text: "Nature of Wound",
      type: "button",
      options: ["Wounds", "Fractures", "None"],
      last: true,
    },
  ];

  const [signsIndex, setSignsIndex] = useState(null);
  const [bleedingIndex, setBleedingIndex] = useState(null);
  const [changesIndex, setChangesIndex] = useState(null);
  const [natureIndex, setNatureIndex] = useState(null);

  const [location, setLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [locationPerm, setLocationPerm] = useState(true);

  const [street, setStreet] = useState("Awaiting Location....");
  const [urgency, setUrgency] = useState(1);

  const [currentIndex, setCurrentIndex] = useState(0);

  const currentQuestion = questions[currentIndex];

  const [signs, setSigns] = useState("");
  const [bleeding, setBleeding] = useState("");
  const [changes, setChanges] = useState("");
  const [nature, setNature] = useState("");

  const [description, setDescription] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  const [userData, setUserData] = useState("");

  const scrollRef = useRef(null);
  const descriptionInputRef = useRef(null);

  const navigation = useNavigation();

  const [modalVisible, setModalVisible] = useState(false);

  const [showConfetti, setShowConfetti] = useState(false);

  const handleTextChange = (text) => {
    setDescription(text);
  };

  const handleSliderChange = (value) => {
    setUrgency(Array.isArray(value) ? value[0] : value);
  };

  const handleAnswer = (question, option) => {
    switch (question.text) {
      case "Visible Signs of Pain":
        setSigns(option);
        break;

      case "Bleeding or Swelling":
        setBleeding(option);
        break;

      case "Changes in Behaviour":
        setChanges(option);
        break;

      case "Nature of Wound":
        setNature(option);
        break;
    }
  };

  const pickImage = async () => {
    if (selectedImages.length >= 3) {
      Alert.alert("You can only upload up to 3 images.");
      return;
    }

    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission to access media library is required!");
      return;
    }

    const remaining = 3 - selectedImages.length;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      quality: 0.7,
      selectionLimit: remaining,
    });

    if (!result.canceled) {
      setSelectedImages((prev) => {
        const newUris = result.assets.map((asset) => asset.uri);
        const combined = [...prev, ...newUris];
        return combined.slice(0, 3);
      });
    }
  };

  const uploadImage = async () => {
    let urlArray = [];
    if (selectedImages.length === 0) return urlArray;

    const options = {
      upload_preset: "Reported Animals",
      unsigned: true,
    };

    for (const imageUri of selectedImages) {
      await upload(cld, {
        file: imageUri,
        options: options,
        callback: (err, res) => {
          if (res?.secure_url) {
            urlArray.push(res.secure_url);
          }
        },
      });
    }
    return urlArray;
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handleSubmit = async () => {
    if (
      description !== "" &&
      signs !== "" &&
      bleeding !== "" &&
      changes !== "" &&
      nature !== ""
    ) {
      setUploading(true);
      const imageUrls = await uploadImage();

      const formData = {
        Location: {
          lattitude: location.latitude,
          longitude: location.longitude,
        },
        Urgency: urgency,
        Description: description,
        SignsOfDistress: signs,
        BleedingOrSwelling: bleeding,
        ChangesInBehaviour: changes,
        NatureOfWound: nature,
        email: userData.email,
        Phone: userData.mobile,
        reportImages: imageUrls,
      };

      try {
        const res = await axios.post(`${BASE_URL}/report-animal`, formData);
        if (res.data.status == "ok") {
          setModalVisible(false);
          setShowConfetti(true);
          Alert.alert("Reported Successfully!");
          setTimeout(() => setShowConfetti(false), 5000);
          setDescription("");
          setSigns("");
          setBleeding("");
          setChanges("");
          setNature("");
          setUrgency(1);
          setCurrentIndex(0);
          setSelectedImages([]);
          setSignsIndex(null);
          setBleedingIndex(null);
          setChangesIndex(null);
          setNatureIndex(null);
        } else {
          Alert.alert("Sorry, something went wrong! We're working on it!");
          console.log(JSON.stringify(res.data));
        }
      } catch (e) {
        console.log(e);
        Alert.alert("Upload failed. Please try again.");
      }
      setUploading(false);
    } else {
      Alert.alert("Please fill in the form fully.");
    }
  };

  Geocoder.init(GOOGLE_API_KEY);

  const handleLocation = async () => {
    try {
      setIsLoading(true);

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert("Location permission not granted");
        setLocationPerm(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);

      Geocoder.from(location.coords.latitude, location.coords.longitude)
        .then((json) => {
          const address = json.results[0].formatted_address;
          setStreet(address);
        })
        .catch((error) => console.warn(error));

      setIsLoading(false);
    } catch (error) {
      console.error("Error in reverse geocoding:", error);
    }
  };

  const handleProfile = () => {
    navigation.navigate("Profile");
  };

  const handleWishList = () => {
    navigation.navigate("Wishlist");
  };

  async function getUserData() {
    if (userToken) {
      axios.post(`${BASE_URL}/userdata`, { token: userToken }).then((res) => {
        setUserData(res.data.data);
      });
    }
  }

  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    getUserData();
    handleLocation();
    console.log(`Location perm: ${locationPerm}`);
  }, []);

  // Progress Bar Animation
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: (currentIndex + 1) / questions.length,
      duration: 400,
      useNativeDriver: false,
    }).start();
  }, [currentIndex, questions.length]);

  return (
    <View style={styles.mainContainer}>
      <TopBar handleProfile={handleProfile} handleWishList={handleWishList} />

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        statusBarTranslucent
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View
            style={{
              flex: 1,
              justifyContent: "flex-end",
              backgroundColor: "rgba(0,0,0,0.4)",
            }}
          >
            <View
              style={{
                height: "90%",
                backgroundColor: "#2B1107",
                borderTopLeftRadius: 32,
                borderTopRightRadius: 32,
                padding: 24,
                alignItems: "center",
                position: "relative",
              }}
            >
              {/* Close (X) button in top left */}
              <View
                style={{
                  alignSelf: "flex-start",
                  marginBottom: "10%",
                }}
              >
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Text
                    style={{
                      fontSize: 32,
                      color: "#fff",
                      fontWeight: "bold",
                    }}
                  >
                    ×
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Progress Bar */}
              <View
                style={{
                  width: "80%",
                  height: 8,
                  backgroundColor: "#827570",
                  borderRadius: 4,
                  marginBottom: "10%",
                  overflow: "hidden",
                }}
              >
                <Animated.View
                  style={{
                    width: progressAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["0%", "100%"],
                    }),
                    height: "100%",
                    backgroundColor: "#ECE3D5",
                  }}
                />
              </View>

              {/* Question Content*/}
              <View style={{ width: "100%", alignItems: "center" }}>
                <Text
                  style={{
                    color: "#fff",
                    fontSize: 30,
                    fontWeight: "bold",
                    textAlign: "center",
                    marginBottom: "10%",
                    fontFamily: "Poppins-SemiBold",
                  }}
                >
                  {currentQuestion.text}
                </Text>

                {currentQuestion.type === "text" && (
                  <TextInput
                    ref={descriptionInputRef}
                    multiline={true}
                    style={[styles.descriptionInput, { maxHeight: "60%" }]}
                    scrollEnabled
                    onChangeText={handleTextChange}
                    value={description}
                    placeholder="Type your answer..."
                    placeholderTextColor="#a89b8a"
                  />
                )}

                {currentQuestion.type === "image" && (
                  <View
                    style={{ alignItems: "center", justifyContent: "center" }}
                  >
                    <TouchableOpacity
                      style={{
                        backgroundColor: "#A66E3A",
                        borderRadius: 10,
                        alignItems: "center",
                        marginBottom: "5%",
                        width: 250,
                        height: 80,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      onPress={pickImage}
                      disabled={uploading}
                    >
                      <Text
                        style={{
                          color: "#fff",
                          fontFamily: "Poppins-SemiBold",
                          fontSize: 20,
                        }}
                      >
                        {selectedImages.length > 0
                          ? "Add More Photos"
                          : "Upload Photos"}
                      </Text>
                    </TouchableOpacity>
                    <View style={{ flexDirection: "row", gap: 8 }}>
                      {selectedImages.map((uri, idx) => (
                        <View key={idx} style={{ position: "relative" }}>
                          <Image
                            source={{ uri }}
                            style={{
                              width: 50,
                              height: 50,
                              borderRadius: 8,
                              marginRight: 6,
                            }}
                          />
                          <TouchableOpacity
                            style={{
                              position: "absolute",
                              top: -8,
                              right: -8,
                              backgroundColor: "#442D21",
                              borderRadius: 10,
                              padding: 2,
                              zIndex: 2,
                            }}
                            onPress={() => {
                              setSelectedImages(
                                selectedImages.filter((_, i) => i !== idx)
                              );
                            }}
                          >
                            <Ionicons name="close" size={16} color="#fff" />
                          </TouchableOpacity>
                        </View>
                      ))}
                      {uploading && (
                        <ActivityIndicator
                          color="#fff"
                          style={{ marginLeft: 10 }}
                        />
                      )}
                    </View>
                  </View>
                )}

                {currentQuestion.type === "button" && (
                  <View style={styles.buttonContainer}>
                    {currentQuestion.options.map((option, idx) => {
                      let selected =
                        (currentQuestion.text === "Visible Signs of Pain" &&
                          signsIndex === idx) ||
                        (currentQuestion.text === "Bleeding or Swelling" &&
                          bleedingIndex === idx) ||
                        (currentQuestion.text === "Changes in Behaviour" &&
                          changesIndex === idx) ||
                        (currentQuestion.text === "Nature of Wound" &&
                          natureIndex === idx);

                      return (
                        <TouchableOpacity
                          style={[
                            styles.button,
                            selected ? styles.buttonSelected : null,
                          ]}
                          key={option}
                          onPress={() => {
                            if (
                              currentQuestion.text === "Visible Signs of Pain"
                            )
                              setSignsIndex(idx);
                            else if (
                              currentQuestion.text === "Bleeding or Swelling"
                            )
                              setBleedingIndex(idx);
                            else if (
                              currentQuestion.text === "Changes in Behaviour"
                            )
                              setChangesIndex(idx);
                            else if (currentQuestion.text === "Nature of Wound")
                              setNatureIndex(idx);
                            handleAnswer(currentQuestion, option);
                          }}
                        >
                          <Text style={styles.btnText} numberOfLines={2}>
                            {option}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              </View>

              {/*Navigation Content*/}
              <View
                style={{
                  position: "absolute",
                  bottom: 40,
                  left: 24,
                  right: 0,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                  paddingHorizontal: 24,
                  zIndex: 10,
                }}
              >
                {currentIndex > 0 ? (
                  <TouchableOpacity
                    onPress={handlePrevious}
                    style={styles.nextPrevBtn}
                  >
                    <Text
                      style={[
                        styles.btnText,
                        { fontSize: 32, color: colours.primary },
                      ]}
                    >
                      <Ionicons
                        name="arrow-back"
                        size={28}
                        color={colours.primary}
                      />
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <View style={{ width: 40 }} />
                )}

                {currentQuestion.last && (
                  <View style={{ flex: 1, alignItems: "center" }}>
                    <TouchableOpacity
                      style={styles.submitBtn}
                      onPress={handleSubmit}
                    >
                      <Text
                        style={[
                          styles.btnText,
                          { fontSize: 14, color: "black" },
                        ]}
                      >
                        Submit
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}

                {currentIndex < questions.length - 1 ? (
                  <TouchableOpacity
                    onPress={handleNext}
                    style={styles.nextPrevBtn}
                  >
                    <Text
                      style={[
                        styles.btnText,
                        { fontSize: 32, color: colours.primary },
                      ]}
                    >
                      <Ionicons
                        name="arrow-forward"
                        size={28}
                        color={colours.primary}
                      />
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <View style={{ width: 40 }} />
                )}
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {uploading && (
        <LoadingIndicator message={"🏃‍♂️‍➡️Submitting your report..."} />
      )}

      {!uploading &&
        (!locationPerm ? (
          <NoLocationScreen />
        ) : !isLoading && locationPerm && userToken ? (
          <View
            style={{
              flex: 1,
              justifyContent: "space-evenly",
              alignItems: "center",
              marginBottom: "25%",
            }}
          >
            {/* Map Box */}
            <View style={styles.mapBox}>
              <MapView
                showsUserLocation={false}
                region={{
                  latitude: location?.latitude,
                  longitude: location?.longitude,
                  latitudeDelta: 0.0422,
                  longitudeDelta: 0.0421,
                }}
                style={styles.map}
              >
                <Marker
                  coordinate={{
                    latitude: location?.latitude,
                    longitude: location?.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                  }}
                  draggable
                  onDragEnd={(e) => {
                    const { latitude, longitude } = e.nativeEvent.coordinate;
                    setLocation({ ...location, latitude, longitude });

                    Geocoder.from(latitude, longitude)
                      .then((json) => {
                        const address = json.results[0].formatted_address;
                        setStreet(address);
                      })
                      .catch((error) => console.warn(error));
                  }}
                />
              </MapView>
            </View>

            {/* Location Container */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                source={require("../../../assets/images/location-icon.png")}
                style={{ height: 40, width: 25 }}
              />
              <Text
                style={[
                  styles.normalText,
                  {
                    fontSize: 15,
                    alignSelf: "center",
                    textAlign: "center",
                    color: colours.heading,
                    marginBottom: 0,
                  },
                ]}
              >
                {" "}
                Location: {street}{" "}
              </Text>
            </View>

            {/* Urgency Container */}
            <ShadowWrapper style={styles.dropShadowStyle}>
              <View id="Urgency-Level" style={styles.sliderCont}>
                <Text
                  style={[
                    styles.normalText,
                    {
                      fontSize: 15,
                      marginTop: "4%",
                      color: "#FFFFFF",
                      fontFamily: "Poppins-SemiBold",
                    },
                  ]}
                >
                  Urgency Level
                </Text>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: 300,
                    marginLeft: 10,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Righteous",
                      color: "#A66E3A",
                      opacity: urgency == 1 ? 1 : 0.4,
                    }}
                  >
                    01
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Righteous",
                      color: "#A66E3A",
                      opacity: urgency == 2 ? 1 : 0.4,
                    }}
                  >
                    02
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Righteous",
                      color: "#A66E3A",
                      opacity: urgency == 3 ? 1 : 0.4,
                    }}
                  >
                    03
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Righteous",
                      color: "#A66E3A",
                      opacity: urgency == 4 ? 1 : 0.4,
                    }}
                  >
                    04
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Righteous",
                      color: "#A66E3A",
                      opacity: urgency == 5 ? 1 : 0.4,
                    }}
                  >
                    05
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Righteous",
                      color: "#A66E3A",
                      opacity: urgency == 6 ? 1 : 0.4,
                    }}
                  >
                    06
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Righteous",
                      color: "#A66E3A",
                      opacity: urgency == 7 ? 1 : 0.4,
                    }}
                  >
                    07
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Righteous",
                      color: "#A66E3A",
                      opacity: urgency == 8 ? 1 : 0.4,
                    }}
                  >
                    08
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Righteous",
                      color: "#A66E3A",
                      opacity: urgency == 9 ? 1 : 0.4,
                    }}
                  >
                    09
                  </Text>
                  <Text
                    style={{
                      fontFamily: "Righteous",
                      color: "#A66E3A",
                      opacity: urgency == 10 ? 1 : 0.4,
                    }}
                  >
                    10
                  </Text>
                </View>

                <View style={{ width: 310, margin: 0 }}>
                  <RNESlider
                    value={urgency}
                    minimumTrackTintColor="#A66E3A"
                    maximumTrackTintColor="#83796e"
                    minimumValue={1}
                    maximumValue={10}
                    step={1}
                    onValueChange={handleSliderChange}
                    thumbStyle={{ width: 24, height: 24 }}
                    renderThumbComponent={() => (
                      <Image
                        source={require("../../../assets/images/slider-thumb-resized.png")}
                        style={{ width: 24, height: 24 }}
                      />
                    )}
                  />
                </View>
              </View>
            </ShadowWrapper>

            {/* Form Opener */}
            <ShadowWrapper style={styles.dropShadowStyle}>
              <View id="form" style={styles.form}>
                <Text
                  style={[
                    styles.normalText,
                    {
                      color: "#FFFFFF",
                      fontSize: 16,
                      marginBottom: 18,
                      marginTop: "5%",
                      textAlign: "center",
                      fontFamily: "Poppins-SemiBold",
                    },
                  ]}
                >
                  Complete The Form
                </Text>

                <TouchableOpacity
                  style={{
                    width: "75%",
                    height: "42%",
                    backgroundColor: "#442D21",
                    borderRadius: 25,
                    borderWidth: 3,
                    borderColor: "#ECE3D5",
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: "5%",
                  }}
                  onPress={() => setModalVisible(true)}
                >
                  <Text
                    style={{
                      fontFamily: "Nunito",
                      fontSize: 15,
                      fontWeight: "bold",
                      color: "#FFFFFF",
                    }}
                  >
                    Continue
                  </Text>
                </TouchableOpacity>
              </View>
            </ShadowWrapper>
          </View>
        ) : !userToken ? (
          <LoadingIndicator message={"Please login to use this function!"} />
        ) : (
          <LoadingIndicator message={"Awaiting your location... 🐶"} />
        ))}

      {showConfetti && (
        <>
          <ConfettiCannon
            count={250}
            origin={{ x: 0, y: 0 }} // left side
            fadeOut={true}
            fallSpeed={3000}
            explosionSpeed={350}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 9999,
            }}
          />
          <ConfettiCannon
            count={250}
            origin={{ x: Dimensions.get("window").width, y: 0 }} // right side
            fadeOut={true}
            fallSpeed={3000}
            explosionSpeed={350}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 9999,
            }}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colours.primary,
  },

  normalText: {
    color: "#fff",
    fontFamily: "Poppins-Regular",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
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

  textContainer: {
    marginTop: "1%",
    alignItems: "center",
    justifyContent: "center",
  },

  mapBox: {
    width: 350,
    height: 200,
    alignSelf: "center",
    borderRadius: 40,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colours.stroke,

    overflow: "hidden",
  },

  map: {
    height: "100%",
    width: "100%",
    borderRadius: 40,
  },

  sliderCont: {
    backgroundColor: "#31200F",
    width: 350,
    height: 120,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },

  form: {
    width: 350,
    height: 137,
    borderRadius: 36,
    backgroundColor: "#3A2612",
    marginTop: "5%",
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    shadowColor: colours.dropShadowColour,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: "#A66E3A44",
    overflow: "hidden",
  },

  descriptionInput: {
    width: "90%",
    height: "60%",
    borderWidth: 3,
    borderColor: "#ECE3D5",
    borderRadius: 18,
    padding: 12,
    color: "#fff",
    fontFamily: "Poppins-Regular",
    marginTop: "-4%",
    textAlignVertical: "top",
  },

  buttonContainer: {
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 18,
    width: "100%",
    gap: 8,
  },

  button: {
    width: "80%",
    height: "22%",
    // backgroundColor: "#F0EEDD",
    alignItems: "center",
    borderRadius: 25,
    marginHorizontal: 4,
    justifyContent: "center",
    borderColor: "#ECE3D5",
    borderWidth: 4,
  },

  buttonSelected: {
    backgroundColor: "#786559", // same as unselected
    borderColor: "#ECE3D5", // your highlight color
    borderWidth: 4,
  },

  btnText: {
    fontFamily: "Nunito",
    fontWeight: "bold",
    color: "#FFFFFF",
    fontSize: 18,
    flexWrap: "wrap",
    textAlign: "center",
    width: "100%",
    includeFontPadding: false,
    paddingHorizontal: 2,
  },

  nextprevCont: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 0,
  },

  nextPrevBtn: {
    height: 40,
    width: 40,
    backgroundColor: "#442D21",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#ECE3D5",
    borderWidth: 3,
  },

  submitBtn: {
    backgroundColor: colours.white,
    height: 40,
    width: 80,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    elevation: 2,
  },

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },

  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },

  dropShadowStyle: {
    shadowColor: colours.dropShadowColour,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.7,
    shadowRadius: 1,
  },
});
