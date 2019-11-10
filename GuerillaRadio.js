const uuidv4 = require('uuid/v4');
const notifications = new Notifications();
import Notifications from './Notifications';
import { AppState, Text } from 'react-native';


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

    getPeersLength() {
        return this.foundPeers.length;
    }

    listenForPeers() {
        self = this;
        console.log("Listening...");
        this.radioModule.addPeerDetectedListener(function (peer) {
            console.log("Found peer!");
            console.log(peer);
            self.foundPeers.push(peer);
            self.app.setState({
              refresh: !self.app.state.refresh
            });
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
            message.text = 'Other: ' + message.text;
            receivedMessages.unshift(message);
            self.app.setState({
                refresh: !self.app.state.refresh
            });
            if (AppState.currentState !== 'active') {
                notifications.send('New Message', message.text);
            }
        });
    }

    sendMessage(messageToSend, receivedMessages) {
        if (!messageToSend || messageToSend.length === 0) {
            return alert("Please type in a message.");
        }
        let message = JSON.stringify({ text: messageToSend, id: uuidv4().toString() });
        for (let i = 0; i < this.foundPeers.length; i++)
            this.radioModule.sendMessage(message, this.foundPeers[i].id);

        receivedMessages.unshift({
            text: 'Me: ' + messageToSend,
            id: uuidv4().toString()
        });
        self.app.setState({
            refresh: !self.app.state.refresh
        })
    }
}