import { Injectable } from '@angular/core';
import { ParkingLot } from './model/parking-lot';
import { ParkingUser } from './model/parking-user';
import { UserAction, ActionType } from './model/user-action';
import { HttpClient } from '@angular/common/http';

import 'rxjs/add/operator/toPromise';
import { User } from './model/user';
import { MatDialog } from '@angular/material';
import { InfoDialogComponent } from './info-dialog/info-dialog.component';



@Injectable()
export class ParkdService {

   userState: UserStateType;
  private userId: number = null;
  userName: string = null;
  parkingLotList: ParkingLot[] = [];
  private userList: User[] = [];

  //private parkingUserList: ParkingUser[];
  //private userActionList: UserAction[];
   parkingLotToExitFrom: ParkingLot;

  constructor(private http: HttpClient, public dialog: MatDialog) { 

    this.getUsersList();
    this.getParkingList();
    this.parkingLotToExitFrom = null;
    this.setUserState();
  }
 
  public resetAppState(){
    this.userId = null;
    this.userName = null;
    this.setUserState();
    this.getParkingList();
  }

 
  showErrDialog(message: string, error: any){
    console.log(error);
    var fullMsg:string = message + "  " + error;

    let dialogRef = this.dialog.open(InfoDialogComponent, {
      width: '430px',
      disableClose: true,
      data: { errorMsg: fullMsg }
    });
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
    try {
      var response = await this.http.get("/api/getParkingLotToExitFrom/"+userId).toPromise(); 
      return response as ParkingLot;    
    }
    catch(err){
      this.showErrDialog("שגיאה בקבלת פרטי חניון לפינוי", err);
    }
  }
  

  async getUsersList(): Promise<User[]> {
    try{
      var response = await this.http.get("/api/getUserList").toPromise(); 
      this.userList = response as User[];
      return this.userList;
    }
    catch(err){
      this.showErrDialog("שגיאה בקבלת רשימת עובדים", err);
    }
  }

  async getParkingList(){
    try{
      var response = await this.http.get("/api/getParkingLots").toPromise(); 
      this.parkingLotList = response as ParkingLot[];
      //return this.parkingLotList;
    }
    catch(err){
      this.showErrDialog("שגיאה בקבלת רשימת חונים", err);
    }
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

    try{
      var response = await this.http.get("/api/addUserAction/"+JSON.stringify(userAction)).toPromise();    
      console.log(response);
      
      let dialogRef = this.dialog.open(InfoDialogComponent, {
        width: '420px',
        disableClose: true,
        data: { actionType: ActionType.enter, parkingLotName: parkingLot.name, userName: this.getUserNameById(this.userId) }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        this.resetAppState();
        //location.reload();
      });
  
    }
    catch(err){
      this.showErrDialog("שגיאה בשריון חניה", err);
    }
  }

  async exitFromParking(parkingLot: ParkingLot){
    const userAction = {
      id: 1,
      userId: this.userId,
      parkId: parkingLot.id,
      actionType: ActionType.exit,
      actionTime: new Date()
    };

    try{
      var response = await this.http.get("/api/addUserAction/"+JSON.stringify(userAction)).toPromise();    
   
      let dialogRef = this.dialog.open(InfoDialogComponent, {
        width: '430px',
        disableClose: true,
        data: { actionType: ActionType.exit, parkingLotName: parkingLot[0].name, userName: this.getUserNameById(this.userId) }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        this.resetAppState();
        //location.reload();
      });
  
    }
    catch(err){
      this.showErrDialog("שגיאה בהוספת פינוי חניה", err);
    }
  }

  async getOut(parkingLot: ParkingLot){

    const barrierInput = {
      userId: this.userId,
      parkId: parkingLot.id
    };
    console.log("/api/getOut/"+JSON.stringify(barrierInput));
    try{
      var response = await this.http.get("/api/getOut/"+JSON.stringify(barrierInput)).toPromise(); 

      let dialogRef = this.dialog.open(InfoDialogComponent, {
        width: '430px',
        disableClose: true,
        data: { isSimulator: true, actionType: "getOut" ,response: response, parkingLotName: parkingLot.name, userName: this.getUserNameById(this.userId) }
      });
  
      dialogRef.afterClosed().subscribe(result => {});
    }
    catch(err){
      this.showErrDialog("שגיאה בתהליך יציאה מחניון", err);
    }

  }


  async getIn(parkingLot: ParkingLot){

    const barrierInput = {
      userId: this.userId,
      parkId: parkingLot.id
    };
    console.log("/api/getIn/"+JSON.stringify(barrierInput));
    try{

      var response = await this.http.get("/api/getIn/"+JSON.stringify(barrierInput)).toPromise(); 

      let dialogRef = this.dialog.open(InfoDialogComponent, {
        width: '430px',
        disableClose: true,
        data: { isSimulator: true, actionType: "getIn" ,response: response, parkingLotName: parkingLot.name, userName: this.getUserNameById(this.userId) }
      });
  
      dialogRef.afterClosed().subscribe(result => {});

    }
    catch(err){
      this.showErrDialog("שגיאה בתהליך כניסה לחניון", err);
    }
    
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
