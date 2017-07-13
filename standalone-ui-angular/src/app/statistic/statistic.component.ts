import {
  Component,
  OnInit
} from '@angular/core';
import  {DatePipe} from '@angular/common';

import {AppState} from '../app.service';
import {Title} from './title';
import {XLargeDirective} from './x-large';
import {Router} from "@angular/router";
import {Http} from "@angular/http";
import {Observable} from "rxjs/Observable";

@Component({
  selector: 'statistic',
  providers: [DatePipe],
  styleUrls: ['./statistic.component.scss'],
  templateUrl: './statistic.component.html'
})
export class StatisticComponent implements OnInit {
  public chartLabels: Array<any>;
  public chartData: Array<any>;
  bottleData: any;
  private labelsCount: number;
  public secondsPerStep: number = 10;
  private startTimeMS: number;

  public daysBack: number = 0;
  public hoursBack: number = 1;


  constructor(public appState: AppState, private http: Http, private router: Router, private datePipe: DatePipe) {
    this.init();
  }

  private init() {
    if (this.appState.state.hoursBack) {
      this.hoursBack = this.appState.state.hoursBack;
    }
    if (this.appState.state.secondsPerStep) {
      this.secondsPerStep = this.appState.state.secondsPerStep;
    }

    var daysBack = this.daysBack;
    var hoursBack = this.hoursBack;


    this.chartLabels = this.getLabels(daysBack, hoursBack, new Date());
    this.chartData = [{data: [], label: ''}];

    console.log("Going back " + daysBack + " days and " + hoursBack + " hours.");
    this.startTimeMS = this.increaseDate(new Date(), -daysBack, -hoursBack).getTime();
  }

  public ngOnInit() {
    console.log('hello `statistic` component');
    this.getPersistenceData();
  }

  public onSecondsChange(e) {
    this.appState.set("secondsPerStep", e.target.value);
  }

  public change() {
    this.appState.set("hoursBack", this.hoursBack);
    this.router.navigateByUrl('/settings', true).then(() => {
        this.router.navigate(["statistic"]);
      }
    )
    ;
  }


  private getPersistenceData() {
    // --------------------------------------------------------------------------
    var persistencePath = "/rest/persistence/items/";
    var itemName = "SmartBottle"
    var preparedDate = this.datePipe.transform(new Date(this.startTimeMS), "yyyy-MM-dd'T'HH:mm:ss.Z");
    // --------------------------------------------------------------------------

    console.log("fetching persistence of item: " + itemName + ".  The prepared startTime is " + preparedDate);
    var path = persistencePath + itemName + "?starttime=" + preparedDate;
    console.log("calling rest api with path: " + path);

    this.http.get(path)
      .subscribe(res => {
          console.log("got data", res);
          let data = res.json();
          this.bottleData = data ? data.data : [];
          console.log(this.bottleData);
          this.prepareData(data);
        },
        error => {
          console.log(error)
        })
  }

  private getHelperArray() {
    var array = [];
    var globalStart = this.startTimeMS;
    var step = this.secondsPerStep * 1000;

    for (let i = 0; i < this.labelsCount; i++) {
      var endTime = globalStart + (i * step);
      var startTime = endTime - step;
      array.push({
        startTime: startTime,
        endTime: endTime,
        chunks: [],
        cumulateValue: -1
      })
    }
    return array;
  }

  private prepareData(data) {
    var label = data.name;
    console.log("prepare data-----------------------");
    // generate array with element for each label
    var helper = this.getHelperArray();

    // fill helper with sensor data
    for (let i = 0; i < data.data.length; i++) {
      var state = data.data[i].state;
      var time = data.data[i].time;
      for (let j = 0; j < helper.length; j++) {
        if (helper[j].startTime < time && helper[j].endTime >= time) {
          helper[j].chunks.push(parseInt(state));
          break;
        }
      }
    }

    //addregate the sensordata and get middle
    var dataPoints = [];
    for (let j = 0; j < helper.length; j++) {
      helper[j].cumulateValue = (helper[j].chunks.length > 0) ? (helper[j].chunks.reduce((a, b) => a + b, 0) / helper[j].chunks.length) : 0;
      dataPoints.push(helper[j].cumulateValue);
    }

    // console.log(helper);
    // publish the data
    this.chartData = [{data: dataPoints, label: label}];
  }

  /*
   * generate all the labels
   */
  private getLabels(d, h, date) {
    var dateTime = date.getTime();
    this.labelsCount = h * 60 * 60 / this.secondsPerStep;
    if (d && d != 0) {
      this.labelsCount = this.labelsCount * d * 24;
    }

    // go into past
    dateTime = dateTime - (this.labelsCount * this.secondsPerStep * 1000);

    var array = [];
    for (let i = 0; i < this.labelsCount; i++) {
      if (i % (this.labelsCount / 10) == 0) {
        var tempDate = new Date();
        tempDate.setTime(dateTime + i * this.secondsPerStep * 1000);
        var test = this.datePipe.transform(tempDate, "HH:mm");
        console.log(test);
        array.push(".." + test);
      }
      else {
        array.push("");
      }
    }
    return array;
  }

  private increaseDate(date, d, h) {
    if (h == undefined)
      h = 0
    if (d == undefined)
      d = 0
    date.setTime(date.getTime() + (h * 60 * 60 * 1000) + (d * 24 * 60 * 60 * 1000));
    return date;
  }


  public lineChartOptions: any = {
    responsive: true
  };
  public lineChartColors: Array<any> = [
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // dark grey
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    },
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  public lineChartLegend: boolean = true;
  public lineChartType: string = 'line';

  // events
  public chartClicked(e: any): void {
    // console.log(e);
  }

  public chartHovered(e: any): void {
    // console.log(e);
  }


}
//
// private handleError(error: Response | any) {
//   // In a real world app, you might use a remote logging infrastructure
//   let errMsg: string;
//   if (error instanceof Response) {
//     const body: any = error.json() || '';
//     const err = body.error || JSON.stringify(body);
//     errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
//   } else {
//     errMsg = error.message ? error.message : error.toString();
//   }
//   console.error(errMsg);
//   return Observable.throw(errMsg);
// }
