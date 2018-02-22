import { Component, OnInit } from '@angular/core';
import { ParkingLot } from '../model/parking-lot';
import { ParkdService, UserStateType } from '../parkd.service';

@Component({
  selector: 'app-park-d-page',
  templateUrl: './park-d-page.component.html',
  styleUrls: ['./park-d-page.component.css']
})
export class ParkDPageComponent implements OnInit {

  parkingLotStatusList: ParkingLot[];

  constructor(private parkdService: ParkdService) {
    this.parkingLotStatusList = parkdService.getParkingList();
  }


  ngOnInit() {
  }

  get userState() {
    return this.parkdService.userState;
  }

  showEnter() : boolean{
      return (this.parkdService.userState == UserStateType.enter);
  }
}
