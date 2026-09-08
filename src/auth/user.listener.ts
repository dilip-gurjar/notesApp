import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class UserListener {

//   @OnEvent('user.registered')
//   handleUserRegistered(payload: any) {

//     console.log('User Registered');

//     console.log(payload);

//   }
//   @OnEvent('user.registered')
// sendNotification(user) {
//   console.log('Notification sent');
// }


@OnEvent('user.registered')
createActivityLog(user) {
  console.log('Activity logged');
}

}