import { Component, OnInit } from '@angular/core';
import { ParkingLot } from '../model/parking-lot';
import { ParkdService } from '../parkd.service';

@Component({
  selector: 'app-park-simulation-page',
  templateUrl: './park-simulation-page.component.html',
  styleUrls: ['./park-simulation-page.component.css']
})
export class ParkSimulationPageComponent implements OnInit {

  parkingLotStatusList: ParkingLot[];

  get parkingLotToExitFrom(): ParkingLot {
    return this.parkingLotStatusList[0];
  }

  constructor(private parkdService: ParkdService) { 
    this.parkdService.resetUser();
  }

  async ngOnInit() {
    this.parkingLotStatusList = await this.parkdService.getParkingList();
    console.log(this.parkingLotStatusList);
  }

  //ngOnInit() {
  //}
  get userState() {
    return this.parkdService.userState;
  }

  onGetIn(parkingLot: ParkingLot){
    this.parkdService.getIn(parkingLot);
  }

  onGetOut(parkingLot: ParkingLot){
    this.parkdService.getOut(parkingLot);
  }


}
