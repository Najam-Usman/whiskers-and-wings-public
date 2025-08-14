import { Platform } from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AdoptionScreen from "../screen/adoptionScreen/AdoptionScreen";
import MissingScreen from "../screen/missingScreen/MissingScreen";
import ReportScreen from "../screen/reportScreen/Reportscreen";
import ActualAdoptionScreen from "../screen/actualAdoptionScreen/ActualAdoptionScreen";
import colours from "../../src/COLOURS";
import { NavbarPaw } from "../../assets/SVGs/NavbarPaw";
import { FlagIcon } from "../../assets/SVGs/FlagIcon";
import { ReportIcon } from "../../assets/SVGs/ReportIcon";
import { HomeIcon } from "../../assets/SVGs/HomeIcon";

export default function TabNavigation() {
  const Tab = createBottomTabNavigator();
  const iconWidth = 30;
  const iconHeight = 30;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          bottom: 15,
          left: 40,
          right: 40,
          backgroundColor: colours.navbar,
          borderRadius: 25,
          height: 65,
          paddingBottom: 20,
          paddingTop: 20,
          shadowColor: colours.dropShadowColour,
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.6,
          shadowRadius: 5,
          elevation: 20,
        },
      }}
    >
      <Tab.Screen
        name="Adopt"
        component={AdoptionScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <HomeIcon
              color={focused ? colours.dropShadowColour : "white"}
              width={iconWidth}
              height={iconHeight}
            />
          ),
        }}
      />
      <Tab.Screen
        name="ActualAdopt"
        component={ActualAdoptionScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <NavbarPaw
              color={focused ? colours.dropShadowColour : "white"}
              width={iconWidth}
              height={iconHeight}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Missing"
        component={MissingScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <FlagIcon
              color={focused ? colours.dropShadowColour : "white"}
              width={iconWidth}
              height={iconHeight}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Report"
        component={ReportScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <ReportIcon
              color={focused ? colours.dropShadowColour : "white"}
              width={iconWidth}
              height={iconHeight}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
