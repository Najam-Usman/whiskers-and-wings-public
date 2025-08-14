import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import colours from "../../src/COLOURS";

const ShadowWrapper = ({ children, style, shadowStyle, ...props}) => {

    return (
        <View style={[styles.shadow, style, shadowStyle]} {...props}>
            {children}
        </View>
    )

}

const styles = StyleSheet.create({

    shadow : {
        ...Platform.select({
            ios : {
                shadowColor: colours.dropShadowColour,
                shadowOffset : {width : 0, height: 5},
                shadowOpacity : 0.7,
                shadowRadius : 1
            },

            android : {
                elevation : 30,
                shadowColor: colours.dropShadowColour
            }
        })
    }


})

export default ShadowWrapper;