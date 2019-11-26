import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, Picker, Modal } from 'react-native';

export default function CategoryPicker(props) {
    const [selected, setSelected] = useState('Alcohol/Bars');
    const [visible, setVisible] = useState(false);

    let dropDown = () => {
        setVisible(true);
    };

    let closeModal = () => {
        visible ? setVisible(false) : undefined;
    }

    return (

        <View style={styles.wrapper}>
            <View style={styles.input}>
                <View style={styles.innerWrapper}>
                    <Text>{selected}</Text>

                    <TouchableWithoutFeedback onPress={dropDown}>
                        <View style={styles.arrow}>
                            <Text>▼</Text>
                        </View>
                    </TouchableWithoutFeedback>

                    <Modal  animationType='slide'
                            transparent={true}
                            visible={visible}>
                        <TouchableWithoutFeedback onPress={closeModal}>
                            <View style={styles.pickerWrapper}>
                                <View style={styles.picker}>
                                    <Picker
                                        style={styles.picker}
                                        selectedValue={selected}
                                        onValueChange={(itemValue, itemIndex) => {props.onCategoryChange(itemValue);setSelected(itemValue)}}
                                        itemStyle={styles.item}>

                                        <Picker.Item label='Alcohol/Bars' value='Alcohol/Bars'/>
                                        <Picker.Item label='Food' value='Food'/>
                                        <Picker.Item label='Retail' value='Retail'/>
                                        <Picker.Item label='Other' value='Other'/>

                                    </Picker>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </Modal>
                </View>
            </View>
        </View>

    );
};

const styles = StyleSheet.create({
    wrapper: {

    },
    input: {
        width: '80%',
        height: 30,
        alignSelf: 'center',
        borderRadius: 4,
        backgroundColor: 'grey',
        marginLeft: 4,
        marginRight: 4,
    },
    arrow: {
        paddingLeft: 6,
        borderLeftWidth: StyleSheet.hairlineWidth,
        borderLeftColor: 'black',
    },
    innerWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 5,
        paddingRight: 7,
    },
    pickerWrapper: {
        flex: 1,
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    picker: {
        height: 200,
        width: 200,
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderRadius: 30,
    },
    item: {
        height: 200,
        width: '80%',
        margin: 2,
    },
});