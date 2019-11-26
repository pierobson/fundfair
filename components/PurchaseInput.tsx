import React, { useState } from 'react';
import { TouchableWithoutFeedback, Modal, View, TextInput, StyleSheet, Text, TouchableOpacity, Keyboard } from "react-native";
import CategoryPicker from "./CategoryPicker";


export default function PurchaseInput(props) {
    const [cost, onCostChange] = useState(0)
    const [label, onLabelChange] = useState("")
    const [category, onCategoryChange] = useState("Alcohol/Bars")

    return (
        <Modal 
          animationType="slide"
          transparent={true}
          visible={props.modal}>
          
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.purchaseFormWrapper}>
            
            <TouchableWithoutFeedback onPress={undefined}>


              <View style={styles.purchaseLilWrap}>
                <View style={styles.purchaseForm}>
                  <TextInput placeholder='Amount' keyboardType='numeric' style={styles.input} onChangeText={text => { onCostChange(parseFloat(text)) }} />
                  <TextInput placeholder='Label' style={styles.input} onChangeText={text => { onLabelChange(text) }}/>
                  <CategoryPicker onCategoryChange={onCategoryChange} />

                <View style={styles.buttonContainer}>
                  <View style={styles.buttonsWrapper}>
                    <TouchableOpacity onPress={props.closeModal} style={{...styles.button, backgroundColor: 'red'}}>
                      <Text>XXX</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {props.makePurchase(cost, label, category)}} style={{...styles.button, backgroundColor: 'green'}}>
                      <Text>$$$</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                </View>
              </View>

              </TouchableWithoutFeedback>

            </View>
          </TouchableWithoutFeedback>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modal: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(255,255,255,1)',
    },
    purchaseFormWrapper: {
      flex: 1,
      flexDirection :'column',
      alignContent: 'center',
      justifyContent: 'center', 
    },
    purchaseLilWrap: {
      height: '30%',
      width: 200,
      alignSelf: 'center',
      alignContent: 'center',
      justifyContent: 'center',
    },
    purchaseForm: {
      flex: 1,
      flexDirection: 'column',
      alignContent: 'center',
      justifyContent: 'center',
      backgroundColor: 'white',
      borderRadius: 30,
      borderWidth: 2,
      borderColor: 'black',
      borderStyle: 'solid',
    },
    input: {
      width: '80%',
      height: 30,
      alignSelf: 'center',
      borderRadius: 4,
      backgroundColor: 'grey',
      margin: 4,
    },
    buttonContainer: {
      height: 35,
      width: '80%',
      alignSelf: 'center',
      margin: 4,
    },
    buttonsWrapper: {
      flex: 1,
      flexDirection: 'row',
      alignContent: 'center',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    button: {
      height: 30,
      width: 75,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 4,
      borderColor: 'black',
      borderWidth: StyleSheet.hairlineWidth,
    },
  });
  