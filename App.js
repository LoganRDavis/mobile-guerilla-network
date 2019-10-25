import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Button,
  FlatList,
  View,
  Text,
  Image,
  TextInput,
  StatusBar,
  Alert,
} from 'react-native';
import { statement } from '@babel/template';



console.log("Starting app...");
let BluetoothCP = require("react-native-bluetooth-cross-platform")
BluetoothCP.advertise("WIFI-BT")
BluetoothCP.addPeerDetectedListener(function (user) {
  console.log("Peer Detected!");
});

const DATA = [
  {
    id: 1,
    title: 'First message',
  },
  {
    id: 2,
    title: 'Second message',
  },
  {
    id: 3,
    title: 'Third message',
  },
];

function Item({message}){
  return (
    <View style={styles.item}>
      <Text style={styles.title}>
        {message}
      </Text>
    </View>
  )
}


class App extends Component {
  state = {
    text: ''
  }
  render(){
    return (
        <View style={styles.container}>
          <View style={styles.containerCenter}>
            <Image
              style={styles.image}
              source={require('./library/components/logo.png')}
              />
            </View>
          <FlatList
            data={DATA}
            renderItem = {({ item }) => <Item message = {item.title} /> }
            keyExtractor={item => item.id}
          />
          <View>
            <TextInput
              //id='myTextInput'
              style={styles.textInputStyle}
              placeholder="type your message"
              onChangeText={(text)=> this.setState({text})}
              value = {this.state.text}
              //console.log(this.state.text);
              />
            <Button
              style = {styles.bottom}
              title="Send" 
              onPress={() => Alert.alert('not yet implemented')}
              /> 
            
          </View>
        </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerCenter: {
    alignItems: 'center',
  },
  textInputStyle: {
    height: 40,   
    textAlign: 'left', 
    marginBottom: 10
  },
  image: {
    alignItems: 'center',
    alignContent: 'center',
    marginBottom: 20
  },
  title: {
    textAlign: 'left',
  },
  fixToText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  item: {
    marginVertical: 2,
    marginHorizontal: 10,
  },
  bottom: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 36,
    alignItems: 'center'
  }
});

export default App;
