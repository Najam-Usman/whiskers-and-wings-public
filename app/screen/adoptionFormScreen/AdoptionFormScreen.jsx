import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import colours from "../../../src/COLOURS";
// import { WebView } from 'react-native-webview'
import { BackIcon } from "../../../assets/SVGs/BackIcon";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import InputField from "../../components/InputField";
import axios from "axios";
import { BASE_URL } from "@env";
import * as ImagePicker from "expo-image-picker";
import cld from "../../contexts/CloudinaryInstance";
import { upload } from "cloudinary-react-native";

const AdoptionFormScreen = () => {
  const navigation = useNavigation();

  // const [formLink, setFormLink] = useState('https://docs.google.com/forms/d/e/1FAIpQLSfiZ4OTzKMBhccYSXgmCrgGLnm5qVNFA2rYGO2hg8BeGS46Ng/viewform')

  const handleBack = () => {
    navigation.navigate("Home");
  };

  // const handleFormLink = (formType) => {
  //     if (formType === 'Oman') {
  //         setFormLink('https://docs.google.com/forms/d/e/1FAIpQLSfiZ4OTzKMBhccYSXgmCrgGLnm5qVNFA2rYGO2hg8BeGS46Ng/viewform')
  //     } else if (formType === 'UK') {
  //         setFormLink('https://docs.google.com/forms/d/e/1FAIpQLSf7KkIfcQrJ2_PMPAfEA1vnFevg8oquwr87-MvcsHHyPqeE6g/viewform')
  //     } else if (formType === 'US') {
  //         setFormLink('https://docs.google.com/forms/d/e/1FAIpQLSf5DuvoZAvz_0D338aLeHZBJ4UhiYfq963x8UR4YDelCOunmw/viewform')
  //     } else if (formType === 'Foster') {
  //         setFormLink('https://docs.google.com/forms/d/e/1FAIpQLSdvMwE3E16YZPk55leuAyJgggo-a3KsPdPLXgYJ05DmjnFKwg/viewform')
  //     }
  // }

  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [address, setAddress] = useState("");
  const [country, setCountry] = useState("");
  const [animal, setAnimal] = useState("");
  const [pets, setPets] = useState("");
  const [procedure, setProcedure] = useState("");
  const [propertyDescription, setPropertyDescription] = useState("");
  const [jobHours, setJobHours] = useState("");
  const [socialize, setSocialize] = useState("");
  const [vacationArrangements, setVacationArrangements] = useState("");
  const [feed, setFeed] = useState("");
  const [afford, setAfford] = useState("");
  const [selectedImage, setSelectedImage] = useState([]);
  const [imageError, setImageError] = useState(true);

  let urlArray = [];

  const resetFields = () => {
    setFullName("");
    setMobile("");
    setEmail("");
    setAge("");
    setAddress("");
    setCountry("");
    setAnimal("");
    setPets("");
    setProcedure("");
    setPropertyDescription("");
    setJobHours("");
    setSocialize("");
    setVacationArrangements("");
    setFeed("");
    setAfford("");
  };

  const handleFormSubmit = async () => {
    if (selectedImage.length == 0) {
      Alert.alert(
        "Please upload images of your living situation. These are important in order to help us review your application"
      );
      return;
    }

    await uploadImage();

    console.log("In submit form, url array: ", urlArray);

    if (
      fullName !== "" &&
      mobile !== "" &&
      email !== "" &&
      age !== "" &&
      address !== "" &&
      country !== "" &&
      animal !== "" &&
      pets !== "" &&
      procedure !== "" &&
      propertyDescription !== "" &&
      jobHours !== "" &&
      socialize !== "" &&
      vacationArrangements !== "" &&
      feed !== "" &&
      afford !== "" &&
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email) &&
      /^\+([1-9]\d{0,2})[-\s]?(\d{6,14})$/.test(mobile) &&
      !imageError &&
      urlArray.length != 0
    ) {
      const data = {
        fullName: fullName,
        mobile: mobile,
        age: age,
        address: address,
        country: country,
        animal: animal,
        pets: pets,
        procedure: procedure,
        propertyDescription: propertyDescription,
        jobHours: jobHours,
        socialize: socialize,
        vacationArrangements: vacationArrangements,
        feed: feed,
        afford: afford,
        livingArrangementsImages: urlArray,
      };

      axios
        .post(`${BASE_URL}/request-adoption`, data)
        .then((res) => {
          if (res.data.status == "ok") {
            Alert.alert("Request Submitted Successfully!");
            resetFields();
            setSelectedImage([]);
            urlArray = [];
            console.log("Reset url array and selected image array");
          } else {
            Alert.alert(JSON.stringify(res.data));
          }
        })
        .catch((e) => console.log("Error: " + e));
    } else {
      console.log("Invalid Data");
      Alert.alert("Invalid Data");
    }
  };

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert("Permission to access media library is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      // console.log("Selected Image: ", result.assets[0].uri)
      setSelectedImage((prevImages) => [...prevImages, result.assets[0].uri]);
      setImageError(false);
    }
  };

  useEffect(() => {
    console.log("------------------------------------------");
    console.log("Selected Image Array: ", selectedImage);
    console.log("URL Image Array: ", urlArray);
    console.log("------------------------------------------");
    if (selectedImage.length == 0) {
      setImageError(true);
    }
  }, [selectedImage, urlArray]);

  const uploadImage = async () => {
    if (selectedImage.length == 0) {
      return;
    }

    const options = {
      upload_preset: "Living Situation",
      unsigned: true,
    };

    for (const imageUri of selectedImage) {
      await upload(cld, {
        file: imageUri,
        options: options,
        callback: (error, response) => {
          urlArray.push(response.secure_url);
          // console.log("Error: ", error)
          // console.log("Response: ", response)
          console.log("URL: ", response.secure_url);
        },
      });
    }
  };

  return (
    <View style={styles.main}>
      <View style={styles.top}>
        <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
          <BackIcon />
        </TouchableOpacity>

        <Text
          style={{
            fontSize: 26,
            color: "black",
            fontFamily: "Poppins-Bold",
            letterSpacing: 1,
            marginLeft: "2%",
          }}
        >
          Adopt or Foster
        </Text>
      </View>

      {/* <View style={styles.formTypeCont}>

            <TouchableOpacity style={styles.formTypeBtn} onPress={() => {handleFormLink('Oman')}}>
                <Text style={styles.formTypeBtnText}>🇴🇲 Oman Adopters</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.formTypeBtn} onPress={() => {handleFormLink('UK')}}>
                <Text style={styles.formTypeBtnText}>🇬🇧 UK Adopters</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.formTypeBtn} onPress={() => {handleFormLink('US')}}>
                <Text style={styles.formTypeBtnText}>🇺🇸 US Adopters</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.formTypeBtn} onPress={() => {handleFormLink('Foster')}}>
                <Text style={styles.formTypeBtnText}>🏡 Foster</Text>
            </TouchableOpacity>

        </View>


        <View style={styles.formCont}>
            <WebView source={{ uri: formLink }} />
        </View> */}

      <View style={styles.formCont}>
        <KeyboardAwareScrollView resetScrollToCoords={{ x: 0, y: 0 }}>
          <Text style={styles.textFont}>
            Here’s how our adoption process works for international users:
          </Text>

          <Text style={styles.textFont}>
            1. Application:{" "}
            <Text style={{ fontFamily: "Nunito", fontWeight: "normal" }}>
              Complete the online application form. This helps us evaluate if
              you're a good match for the dog you're interested in adopting.
            </Text>
          </Text>

          <Text style={styles.textFont}>
            2. Virtual Meeting:{" "}
            <Text style={{ fontFamily: "Nunito", fontWeight: "normal" }}>
              If your application is approved, we'll arrange a virtual meeting
              with you and the adoption coordinator to introduce you to the dog.
              We may have follow-up virtual meetings if needed.
            </Text>
          </Text>

          <Text style={styles.textFont}>
            3. Home Check:{" "}
            <Text style={{ fontFamily: "Nunito", fontWeight: "normal" }}>
              Instead of a physical home check, we will request photos and a
              video tour of your home to ensure it’s suitable and secure for the
              dog. This also gives you an opportunity to ask any questions about
              the dog.
            </Text>
          </Text>

          <Text style={styles.textFont}>
            4. Final Adoption:{" "}
            <Text style={{ fontFamily: "Nunito", fontWeight: "normal" }}>
              If the trial is successful, you'll complete the adoption by
              finalizing the paperwork and signing the adoption agreement
              online.
            </Text>
          </Text>

          <Text style={styles.textFont}>
            Please note, we do not adopt out to homes where the animal will be
            kept outside.
          </Text>

          <View style={styles.fieldCont}>
            <InputField
              value={fullName}
              onChange={setFullName}
              inputStyle={styles.inputStyle}
              title={"Full Name"}
            />
            <InputField
              value={mobile}
              onChange={setMobile}
              inputStyle={styles.inputStyle}
              title={"Phone Number with country code"}
            />
            <InputField
              value={email}
              onChange={setEmail}
              inputStyle={styles.inputStyle}
              title={"Email"}
            />
            <InputField
              value={age}
              onChange={setAge}
              inputStyle={styles.inputStyle}
              title={"Age"}
            />
            <InputField
              value={address}
              onChange={setAddress}
              inputStyle={styles.inputStyle}
              title={"Address"}
            />
            <InputField
              value={country}
              onChange={setCountry}
              inputStyle={styles.inputStyle}
              title={"Which country are you from?"}
            />
            <InputField
              value={animal}
              onChange={setAnimal}
              inputStyle={styles.inputStyle}
              multiline={true}
              title={
                "The animal you are interested in adopting and why do you think you would be a good home for this particular animal?"
              }
            />
            <InputField
              value={pets}
              onChange={setPets}
              inputStyle={styles.inputStyle}
              multiline={true}
              title={
                "Do you already have pets? If so, how would you introduce them?"
              }
            />
            <InputField
              value={procedure}
              onChange={setProcedure}
              inputStyle={styles.inputStyle}
              multiline={true}
              title={
                "If Oman is not your home country, what is the procedure to take the animal back with you to your home country?"
              }
            />
            <InputField
              value={propertyDescription}
              onChange={setPropertyDescription}
              inputStyle={styles.inputStyle}
              multiline={true}
              title={
                "Can you describe your property, including your garden or outdoor area, and provide information about the people you live with, including any children and their ages?"
              }
            />
            <InputField
              value={jobHours}
              onChange={setJobHours}
              inputStyle={styles.inputStyle}
              multiline={true}
              title={
                "What are your job and work hours, who will be home with the animal during the day, and how many hours will the dog be left alone?"
              }
            />
            <InputField
              value={socialize}
              onChange={setSocialize}
              inputStyle={styles.inputStyle}
              multiline={true}
              title={
                "How will you socialize the animal and deal with any reactivity or other problems that may arise?"
              }
            />
            <InputField
              value={vacationArrangements}
              onChange={setVacationArrangements}
              inputStyle={styles.inputStyle}
              multiline={true}
              title={
                "What arrangements will you make for your animal if you go on vacation or face hospitalization?"
              }
            />
            <InputField
              value={feed}
              onChange={setFeed}
              inputStyle={styles.inputStyle}
              multiline={true}
              title={
                "What will you feed the animal? How often will you feed the animal?"
              }
            />
            <InputField
              value={afford}
              onChange={setAfford}
              inputStyle={styles.inputStyle}
              multiline={true}
              title={
                "Can you afford any unexpected veterinary bills due to illness or injury of the animal?"
              }
            />

            <View style={styles.imagePickerCont}>
              <Text
                style={{
                  fontFamily: "Nunito",
                  fontWeight: "semibold",
                  fontSize: 15,
                  marginBottom: 10,
                }}
              >
                Please upload images of your living situation (Max 5):
              </Text>

              <View style={{ flexDirection: "row", gap: 8, marginTop: 8 }}>
                <TouchableOpacity
                  style={styles.uploadBtn}
                  onPress={pickImage}
                  disabled={selectedImage.length >= 5}
                >
                  <Text
                    style={{
                      fontFamily: "Nunito",
                      fontWeight: "bold",
                      fontSize: 11,
                    }}
                  >
                    Upload Photos
                  </Text>
                </TouchableOpacity>

                {selectedImage.map((uri, idx) => (
                  <Image
                    key={idx}
                    source={{ uri }}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 8,
                      marginRight: 6,
                    }}
                  />
                ))}
              </View>
            </View>

            <Text style={styles.textFont}>
              Thank you for completing the adoption application form and for you
              interest in adopting one of our animals. One of the adoption
              coordinators will contact you soon🐾
            </Text>
          </View>

          <TouchableOpacity style={styles.submitBtn} onPress={handleFormSubmit}>
            <Text style={styles.formTypeBtnText}>Submit</Text>
          </TouchableOpacity>
        </KeyboardAwareScrollView>
      </View>
    </View>
  );
};

export default AdoptionFormScreen;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: colours.primary,
  },

  textFont: {
    fontFamily: "Nunito",
    fontSize: 14,
    letterSpacing: 1.2,
    marginTop: 20,
    fontWeight: "bold",
  },

  top: {
    width: "100%",
    height: "10%%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "15%",
    flexDirection: "row",
  },

  backBtn: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: colours.primary,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    left: "2%",
  },

  formCont: {
    height: "80%",
    padding: "3%",
    backgroundColor: colours.white,
    width: "90%",
    borderRadius: 10,
    alignSelf: "center",
    marginTop: "10%",
  },

  formTypeCont: {
    width: "100%",
    height: "15%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: "5%",
  },

  formTypeBtn: {
    height: "35%",
    width: "45%",
    backgroundColor: colours.tertiary,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    borderWidth: 1,
    borderColor: colours.brownStroke,
  },

  formTypeBtnText: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 15,
    letterSpacing: 1.5,
  },

  inputStyle: {
    width: "85%",
    padding: 10,
    borderWidth: 2,
    borderRadius: 10,
    marginTop: 5,
  },

  submitBtn: {
    width: 100,
    height: 50,
    backgroundColor: colours.tertiary,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 20,
    borderWidth: 1,
    borderColor: colours.brownStroke,
  },

  fieldCont: {
    // marginTop:20,
  },

  imagePickerCont: {
    marginTop: 20,
  },

  uploadBtn: {
    width: 90,
    height: 35,
    borderWidth: 1,
    backgroundColor: colours.tertiary,
    borderColor: colours.brownStroke,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
});
