import React, { Component } from 'react';
import {
  StyleSheet,
  Button,
  FlatList,
  View,
  Text,
  Image,
  TextInput
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
const uuidv4 = require('uuid/v4');

class GuerillaRadio {
  app;
  radioModule;
  foundPeers;
  constructor(app) {
    this.app = app;
    this.radioModule = require("react-native-bluetooth-cross-platform");
    this.foundPeers = [];
  }

  broadcast() {
    this.radioModule.advertise("WIFI-BT");
  }

  listenForPeers() {
    self = this;
    this.radioModule.addPeerDetectedListener(function (peer) {
      console.log("Found peer!");
      self.foundPeers.push(peer);
    });
  }

  listenForMessage(receivedMessages) {
    self = this;
    this.radioModule.addReceivedMessageListener(function (peerMessage) {
      console.log("Received Message!");
      let message = JSON.parse(peerMessage.message);
      message.userId = peerMessage.id;
      for (let i = 0; i < receivedMessages.length; i++) {
        if (receivedMessages[i].id === message.id) {
          return;
        }
      }
      receivedMessages.push(message);
      self.app.setState({
        refresh: !self.app.state.refresh
      });
    });
  }

  sendMessage(messageToSend) {
    if (!messageToSend || messageToSend.length === 0) {
      return alert("Please type in a message.");
    }
    let message = JSON.stringify({ text: messageToSend, id: uuidv4().toString() });
    for (let i = 0; i < this.foundPeers.length; i++)
      this.radioModule.sendMessage(message, this.foundPeers[i].id);
  }
}

function Item({ message }) {
  return (
    <View style={styles.item}>
      <Text style={styles.title}>
        {message}
      </Text>
    </View>
  )
}

class App extends Component {
  state = {};
  guerillaRadio;
  constructor(params) {
    super(params);
    this.state.messageToSend = null;
    this.state.receivedMessages = [{ text: "MESSAGES:", id: '0' }];
    this.state.refresh = false;
    this.guerillaRadio = new GuerillaRadio(this);
    this.guerillaRadio.broadcast();
    this.guerillaRadio.listenForPeers();
    this.guerillaRadio.listenForMessage(this.state.receivedMessages);
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.containerCenter}>
          <Image
            style={styles.image}
            source={require('./library/components/logo.png')}
          />
        </View>
        <FlatList
          data={this.state.receivedMessages}
          renderItem={({ item }) => <Item message={item.text} />}
          keyExtractor={item => item.id}
          extraData={this.state.refresh}
        />
        <View>
          <TextInput
            style={styles.textInputStyle}
            placeholder="type your message"
            onChangeText={(messageToSend) => this.setState({ messageToSend })}
            value={this.state.messageToSend}
          />
          <Button
            style={styles.bottom}
            title="Send"
            onPress={() => {
              this.guerillaRadio.sendMessage(this.state.messageToSend);
            }}
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
