import React, { useState, useCallback } from 'react';
import { Alert, StyleSheet, Text, View, TouchableOpacity, Image, TouchableWithoutFeedback, Keyboard, AsyncStorage, ScrollView, RefreshControl, Modal, TextInput } from 'react-native';
import PurchaseInput from './components/PurchaseInput';

function wait(timeout) {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}

var purchases = [];

export default function App() {

  const [allowance, setAllowance] = useState(20);
  const [balance, setBalance] = useState(allowance);
  const [modal, setModal] = useState(false);
  const [allowanceReset, updateReset] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [settings, setSettings] = useState(false);

  var color_ratio = balance / allowance;
  var red = color_ratio > 1/2 ? Math.floor(255 - (255 * color_ratio)) * 2 : 255;
  var green = color_ratio < 1/2 ? Math.floor(255 * color_ratio) * 2 : 255;
  var color = 'rgb(' + red + ',' + green + ', 0)';

  let _getStateAsync = async () => {
    try {
      const b = await AsyncStorage.getItem('@Fundfair:balance');
      if (b !== null) {
        setBalance(parseInt(b));
      }
      const a = await AsyncStorage.getItem('@Fundfair:allowance');
      if (a !== null) {
        setAllowance(parseInt(a));
      }
      const r = await AsyncStorage.getItem('@Fundfair:reset');
      if (r !== null) {
        updateReset(parseInt(r));
      }
      const p = await AsyncStorage.getItem('@Fundfair:purchases');
      if (p !== null) {
        purchases = JSON.parse(p);
      }
    } catch (error) {
      console.log(error);
    }
  };

  let _setStateAsync = async () => {
    try {
      await AsyncStorage.setItem('@Fundfair:balance', balance.toString());
      await AsyncStorage.setItem('@Fundfair:allowance', allowance.toString());
      await AsyncStorage.setItem('@Fundfair:reset', allowanceReset.toString());
      await AsyncStorage.setItem('@Fundfair:purchases', JSON.stringify(purchases));
    } catch (error) {
      console.log(error);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, [refreshing]);

  if (!loaded) {
      _getStateAsync();
      setLoaded(true);
  }

  let async_alert = async (text) => {
    return new Promise((resolve) => {
      Alert.alert(
        text,
        '',
        [
          {
            text: 'Ok',
            onPress: () => {
              resolve('YES');
            },
          },
        ],
        { cancelable: false },
      );
    })
  };

  let updateBalance = () => {
    setBalance(balance + allowance);
    purchases = [];
  };

  let resetAllowanceDate = (change) => {
    var date = new Date();
    var nextDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() + (7 - date.getDay()), 0, 0, 0, 0);
    updateReset(nextDate.valueOf())
    if (change) updateBalance();
    
    _setStateAsync();
  };

  let checkReset = () => {
    if (allowanceReset == 0 || Date.now() >= allowanceReset) {
      resetAllowanceDate(!(allowanceReset == 0))
    }
  };

  let handle_purchase = () => {
    setModal(!modal);
  };

  let closeModal = () => {
    modal ? setModal(!modal) : undefined;
  };

  let handle_settings = () => {
    setSettings(!settings);
  };

  let toggleSettings = () => {
    setSettings(false);
    _setStateAsync();
  };

  let makePurchase = async (cost, label, category) => {
    if (balance >= cost) {
      setBalance(balance - cost);;
      purchases.push({'cost':cost, 'label':label, 'cat':category});
    } else {
      await async_alert("You can't afford that, dumby.");
    }
    closeModal();
    _setStateAsync()
  };

  let section =  (
  
    <View>
        <PurchaseInput modal={modal} closeModal={closeModal} makePurchase={makePurchase}/>
        <TouchableOpacity style={{...styles.wrapper, ...styles.purchase}} onPress={handle_purchase}>
          <Text style={{
                          fontSize: 56,
                          fontWeight: '900',
                          color: '#666',
                      }}>
            +
          </Text>
        </TouchableOpacity>
    </View>
    
  );

  checkReset();

  return (
    <ScrollView contentContainerStyle={styles.scrollView}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
      }>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.hairlineBorder}>
          <View style={styles.header}>
            <Text style={{
                          fontSize: 42,
                          fontWeight: '800',
                          color: 'white',
                        }}>
              Fundfair!</Text>

              <TouchableOpacity onPress={handle_settings}>
                <Image source={require('./assets/settings.png')} style={{width: 40, height: 40, marginTop: 7}}/>
              </TouchableOpacity>
          </View>
        </View>
        
        <Modal
          animationType='slide'
          transparent={true}
          visible={settings} >

          <TouchableWithoutFeedback onPress={toggleSettings}>
            <View style={styles.formWrapper}>
            
            <TouchableWithoutFeedback onPress={undefined}>


              <View style={styles.lilWrap}>
                <View style={styles.form}>
                  <View style={styles.setting}>
                      <Text style={styles.settingText}>Allowance:</Text>
                      <TextInput style={styles.settingInput} placeholder={allowance.toString()} keyboardType='numeric' onChangeText={text => {setAllowance(parseInt(text))}}/>
                  </View>
                </View>
              </View>

              </TouchableWithoutFeedback>

            </View>
          </TouchableWithoutFeedback>

        </Modal>

        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          
          <View style={{...styles.container, flex: 7}}>

              {/* Balance */}
              <View style={{...styles.wrapper, ...styles.balance, marginTop: 0}}>
                <Text style={{
                                fontSize: 36,
                                fontWeight: '800',
                                color: color,  
                              }}>
                    ${balance.toFixed(2)}
                </Text>
              </View>

              {/* Add a purchase */}
              {section}
            
          </View>

        </TouchableWithoutFeedback>           

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#333',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
  },
  hairlineBorder: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    paddingBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: 'black',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  formWrapper: {
    flex: 1,
    flexDirection :'column',
    alignContent: 'center',
    justifyContent: 'center', 
  },
  lilWrap: {
    height: '30%',
    width: 200,
    alignSelf: 'center',
    alignContent: 'center',
    justifyContent: 'center',
  },
  form: {
    flex: 1,
    flexDirection: 'column',
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: 'grey',
    borderRadius: 30,
    borderWidth: 2,
    borderColor: 'black',
    borderStyle: 'solid',
  },
  setting: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: 50,
    borderRadius: 4,
    backgroundColor: '#666',
    margin: 4,
  },
  settingText: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  settingInput: {
    backgroundColor: '#888',
    padding: 10,
    borderRadius: 4,
  },
  modal: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,1)',
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    alignContent: 'center',
    justifyContent: 'space-between',
    textAlign: 'center',
    marginTop: 30,
    paddingLeft: 60,
    paddingRight: 20,
  },
  wrapper: {
    alignSelf: 'center',
    justifyContent: 'space-between',
    margin: 25,
  },
  balance: {
    height: 125,
    width: 200,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#666',
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
  purchase: {
    height: 100,
    width: 100,
    marginTop:25,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#222',
  },
  input: {
    width: '80%',
    height: 30,
    alignSelf: 'center',
    borderRadius: 4,
    backgroundColor: 'grey',
    margin: 4,
  },
});
