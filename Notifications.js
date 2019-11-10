const PushNotification = require("react-native-push-notification");

export default class Notifications {
    app;
    constructor(app) {
        this.app = app;
        this.setup();
    }

    setup() {
        PushNotification.configure({
            onRegister: function (token) {
                console.log("TOKEN:", token);
            },

            onNotification: function (notification) {
                console.log(notification);
            },

            senderID: "YOUR GCM (OR FCM) SENDER ID",

            permissions: {
                alert: true,
                badge: true,
                sound: true
            },

            popInitialNotification: true,

            requestPermissions: true
        });
    }

    send(title, message) {
        PushNotification.localNotification({
            /* Android Only Properties */
            id: '0',
            ticker: "My Notification Ticker",
            autoCancel: true,
            largeIcon: "ic_launcher",
            smallIcon: "ic_notification",
            color: "red",
            vibrate: true,
            vibration: 300,
            tag: 'some_tag',
            group: "group",
            ongoing: false,
            priority: "high",
            visibility: "private",
            importance: "high",

            /* iOS and Android properties */
            title: title,
            message: message,
            playSound: true,
            soundName: 'default',
            number: '10',
        });
    }
}
