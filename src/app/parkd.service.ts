import { Injectable } from '@angular/core';
import { ParkingLot } from './model/parking-lot';
import { ParkingUser } from './model/parking-user';
import { UserAction, ActionType } from './model/user-action';
import { HttpClient } from '@angular/common/http';

import 'rxjs/add/operator/toPromise';
import { User } from './model/user';


@Injectable()
export class ParkdService {

   userState: UserStateType;
  private userId: number = null;
  userName: string = null;
  private parkingLotList: ParkingLot[] = [];
  private userList: User[] = [];

  //private parkingUserList: ParkingUser[];
  //private userActionList: UserAction[];
   parkingLotToExitFrom: ParkingLot;

  constructor(private http: HttpClient) { 

    this.getUsersList();

    this.parkingLotToExitFrom = null;
    this.setUserState();
  }
 
  public resetUser(){
    this.userId = null;
    this.userName = null;
    this.setUserState();
  }

 
  private async setUserState() {
    var parkingUser: ParkingUser;

    if (this.userId == null){
      this.userState = UserStateType.notExist;
      this.userName = "";
    }
    else {
      this.userName = this.getUserNameById(this.userId); 
      if(this.userName == null){
        this.userState = UserStateType.notExist;
      }
      else{
        this.parkingLotToExitFrom = await this.getParkingLotToExitFrom(this.userId);
      
        if (this.parkingLotToExitFrom != null)
          this.userState = UserStateType.exit;
        else
          this.userState = UserStateType.enter;
        }
    }
  }

  private async getParkingLotToExitFrom(userId: number): Promise<ParkingLot> {
    var response = await this.http.get("/api/getParkingLotToExitFrom/"+userId).toPromise(); 
    return response as ParkingLot;    
  }
  

  async getUsersList(): Promise<User[]> {
    var response = await this.http.get("/api/getUserList").toPromise(); 
    this.userList = response as User[];
    return this.userList;
  }

  async getParkingList(): Promise<ParkingLot[]> {
    var response = await this.http.get("/api/getParkingLots").toPromise(); 
    this.parkingLotList = response as ParkingLot[];
    return this.parkingLotList;
  }

  setUserAuth(id: number) {
    this.userId = id;
    this.setUserState();
    console.log(this.userId + " , " + this.userState);
  }

  async reserveParking(parkingLot: ParkingLot){
    const userAction = {
        id: 1,
        userId: this.userId,
        parkId: parkingLot.id,
        actionType: ActionType.enter,
        actionTime: new Date()
    };

    var response = await this.http.get("/api/addUserAction/"+JSON.stringify(userAction)).toPromise();    
    alert (response as string);
  }

  async exitFromParking(parkingLot: ParkingLot){
    const userAction = {
      id: 1,
      userId: this.userId,
      parkId: parkingLot.id,
      actionType: ActionType.exit,
      actionTime: new Date()
  };

  var response = await this.http.get("/api/addUserAction/"+JSON.stringify(userAction)).toPromise();    
  

  }

  async getOut(parkId: number){
    alert(this.userId + " יצאת מחניון "+ parkId);
    // try{
    //     await this.http.post("/api/getOut", 
    //                           {userId: this.userId, 
    //                             parkId: parkId}
    //     ).toPromise();
        
    // }
    // catch (err){
    //   console.log(err);
    // }

  }


  async getIn(parkId: number){
    alert(this.userId + " נכנסת לחניון " + parkId);
    // try{
    //   await this.http.post("/api/getIn", 
    //                         {userId: this.userId, 
    //                          parkId: parkId}
    //   ).toPromise();
      
    // }
    // catch (err){
    //   console.log(err);
    // }
    
  }

  getUserNameById(userId: number): string {
    var foundUser = this.userList.find(x => x.userId == userId);
    if(foundUser != null) {
      return foundUser.userName;
    }

    return null;
  }

}

export enum UserStateType {
  notExist = 0,
  enter = 1,
  exit  = 2,
}
