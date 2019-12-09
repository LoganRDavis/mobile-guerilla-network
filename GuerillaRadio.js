const uuidv4 = require('uuid/v4');
const notifications = new Notifications();
const RNFS = require('react-native-fs');
const messagesPath = RNFS.DocumentDirectoryPath + '/messages.txt';
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
            let alreadyExists = false;
            for (let i = 0; i < self.foundPeers.length; i++) {
                if (peer.id === self.foundPeers[i].id) {
                    alreadyExists = true;
                    break;
                }
            }
            if (!alreadyExists) {
                self.foundPeers.push(peer);
                self.app.setState({
                    refresh: !self.app.state.refresh
                });
            }
        });
    }

    listenForMessage(receivedMessages) {
        self = this;
        self.retrieveMessages(receivedMessages);
        this.radioModule.addReceivedMessageListener(function (peerMessage) {
            console.log("Received Message!");
            let message = JSON.parse(peerMessage.message);
            message.userId = peerMessage.id;
            for (let i = 0; i < receivedMessages.length; i++) {
                if (receivedMessages[i].id === message.id) {
                    return;
                }
            }
            console.log(message);
            receivedMessages.unshift(message);
            self.app.setState({
                refresh: !self.app.state.refresh
            });
            if (AppState.currentState !== 'active') {
                notifications.send('New Message', message.text);
            }
            self.saveMessages(receivedMessages);
            for (let i = 0; i < self.foundPeers.length; i++) {
                self.radioModule.sendMessage(peerMessage.message, self.foundPeers[i].id);
            }
        });
    }

    sendMessage(messageToSend, receivedMessages, username) {
        if (!messageToSend || messageToSend.length === 0) {
            return alert("Please type in a message.");
        }
        let message = { text: `${username}: ${messageToSend}`, id: uuidv4().toString() };
        receivedMessages.unshift(message);
        for (let i = 0; i < this.foundPeers.length; i++) {
            this.radioModule.sendMessage(JSON.stringify(message), this.foundPeers[i].id);
        }
        self.app.setState({
            refresh: !self.app.state.refresh
        });
        self.saveMessages(receivedMessages);
    }

    saveMessages(receivedMessages) {
        let jsonToSave = JSON.stringify(receivedMessages);
        RNFS.writeFile(messagesPath, jsonToSave, 'utf8')
            .then((success) => {
                console.log('FILE WRITTEN!');
            })
            .catch((err) => {
                console.log(err.message);
            });
    }

    retrieveMessages(receivedMessages) {
        RNFS.readFile(messagesPath, 0, 0, 'utf8')
            .then((previousMessages) => {
                console.log('FILE READ!');
                previousMessages = JSON.parse(previousMessages);
                for (let i = 0; i < previousMessages.length; i++) {
                    receivedMessages.push(previousMessages[i]);
                }
            })
            .catch((err) => {
                console.log(err.message);
            });
    }
}