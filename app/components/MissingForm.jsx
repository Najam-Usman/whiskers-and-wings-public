import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'

export default function MissingForm() {

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [breed, setBreed] = useState('')

  return (

    <View style={styles.formContainer}>

      <ScrollView contentContainerStyle={styles.formContent}>
        
        <Text>MissingForm</Text>

        <TextInput style={styles.input} value={name}/>


      </ScrollView>
    
    </View>


  )


}

const styles = StyleSheet.create({

  formContainer : {
    height: '90%',
    width: '100%',
    marginBottom:10
  },

  formContent : {
    justifyContent:'center',
    alignItems:'center'
  },

  input : {
    height:30,
    width:'90%',
    borderWidth:1,
    borderRadius:10,
  }




})

