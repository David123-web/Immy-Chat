type TNotification = {
  title: string;
  body: string;
  click_action: string;
  icon: string;
};

export class PushNotificationHelper {
    async send(token: string, notification: TNotification, data: Object) {}

    async sendMulti() {}
}
