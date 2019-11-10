export default class GuerillaRadio {
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
      console.log("Listening...");
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
        receivedMessages.unshift(message);
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