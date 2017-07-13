import {
  Component,
  OnInit
} from '@angular/core';

import {AppState} from '../app.service';
import {Title} from './title';
import {XLargeDirective} from './x-large';
import {Router} from "@angular/router";
import {Http} from "@angular/http";

@Component({
  selector: 'overview',
  providers: [],
  styleUrls: ['./overview.component.scss'],
  templateUrl: './overview.component.html'
})
export class OverviewComponent implements OnInit {

  bottleIntervalId: any;
  bottleState: any;
  /**
   * Set our default values tandalone-ui-angular/src/assets/audio/glas-einschenken.m4a
   */
  public localState = {value: ''};
  public isShowImage = false;
  public isShowVideo = false;
  public isPlaySound = false;
  public audiofile = "assets/audio/glas-einschenken.m4a";
  public audiofile2 = "assets/audio/trinken_aus_voller_flasche.m4a";
  public audiofile_example = "assets/audio/example.mp3";
  public bottleImagePath = "assets/img/b_empty.png";
  public bottleValue = 10;
  public bottleText = "Die Flasche ist leer, fülle sie wieder auf!";
  public dringkingValue = 60;
  public progressstyle = {height: '50px'};


  /**
   * TypeScript public modifiers
   */
  constructor(public appState: AppState, private router: Router, private http: Http) {

  }

  public ngOnInit() {
    console.log('hello `overview` component');
    if (this.appState.state.user && this.appState.state.user.needsToBeReminded != null) {
      this.showReminder(this.appState.state.user.needsToBeReminded == true);
    }

    var that = this;
    this.bottleIntervalId = setInterval(function () {
      that.getBottleData();
      that.getDrinkingValue();
      that.getMediaData();
    }, 1000);
  }

  public ngOnDestroy() {
    clearInterval(this.bottleIntervalId);
  }

  public showImage() {
    this.isShowImage = !this.isShowImage;

  }

  public showVideo() {
    this.isShowVideo = !this.isShowVideo;
  }

  public playSound() {
    this.isPlaySound = !this.isPlaySound;
  }

  public getDrinkingValue() {
    // --------------------------------------------------------------------------
    var itemName = "Drinking_Value"
    // var itemName = "SmartBottle"
    var path = "/rest/items/" + itemName + "/state";
    // --------------------------------------------------------------------------
    console.log("calling rest api with path: " + path);

    this.http.get(path)
      .subscribe(res => {
          console.log("got data", res);
          let data = res.text();
          var value = data ? parseInt(data) : 0;
          // this.dringkingValue =  100 - (value  / 1.5);
          this.dringkingValue = value;
          this.determineIfMailToBeSend(value);
        },
        error => {
          console.log(error)
        })

    return this.dringkingValue;
  }

  getBottleData() {
    // --------------------------------------------------------------------------
    var itemName = "SmartBottle"
    var path = "/rest/items/" + itemName + "/state";
    // --------------------------------------------------------------------------
    console.log("calling rest api with path: " + path);

    this.http.get(path)
      .subscribe(res => {
          // console.log("got data", res);
          let data = res.text();
          this.bottleValue = data ? parseInt(data) : 0;
          this.setBottleImage(this.bottleValue);
        },
        error => {
          console.log(error)
        })
  }

  setBottleImage(value: number) {
    var lover_is_empty = 20;
    var higher_is_full = 70;
    if (value <= lover_is_empty) {
      this.bottleImagePath = "assets/img/b_empty.png";
      this.bottleText = "Die Flasche ist leer, fülle sie wieder auf!";
    } else if (value > lover_is_empty && value < higher_is_full) {
      this.bottleImagePath = "assets/img/b_half.png";
      this.bottleText = "Die Flasche halb voll, trinke noch ein bisschen mehr!";
    } else {
      this.bottleImagePath = "assets/img/b_full.png";
      this.bottleText = "Die Flasche ist voll.";
    }
  }

  determineIfMailToBeSend(value) {
    // send a mail if the value is under 20 and no mail has been send yet
    if ( value <= 20) {
      if (this.appState.state.user && this.appState.state.user.email && !this.appState.state.user.emailSent) {
        console.log("sending mail")
        this.sendEmailReminder(this.appState.state.user.email);
        var user = this.appState.state.user;
        user.emailSent = true;
        this.appState.set('user', user);
      } else {
        console.log("no email present. or already sent? " + (this.appState.state.user && this.appState.state.user.emailSent))
      }
    }

    if (value >= 70) {
      if (this.appState.state.user) {
        var user = this.appState.state.user;
        user.emailSent = false;
        this.appState.set('user', user);
      }
    }

    // reset the mail has been send flag if over 70


  }


  sendEmailReminder(to) {

    // --------------------------------------------------------------------------
    var itemName = "EmailReminder"
    var path = "/rest/items/" + itemName ;
    // --------------------------------------------------------------------------
    console.log("----------------------------------------------------------------------calling rest api with path: " + path + " and body : " + to );

    this.http.post(path, to)
      .subscribe(res => {
          console.log("got data from email sending: ", res);

        },
        error => {
          console.log(error)
        })
  }

  getMediaData() {

    // Switch Reminder_Show_Image "Zeige Bild [%d]" (SmartDrinking) {mqtt="<[mosquitto:Reminder_Show_Image:state:default]"}
    // Switch Reminder_Show_Video "Zeige Video [%d]" (SmartDrinking) {mqtt="<[mosquitto:Reminder_Show_Video:state:default]"}
    // Switch Reminder_Play_Sound "Spiele Sound [%d]" (SmartDrinking) {mqtt="<[mosquitto:Reminder_Play_Sound:state:default]"}
    //
    // --------------------------------------------------------------------------
    var itemName = "Show_Reminder"
    var path = "/rest/items/" + itemName + "/state";
    // --------------------------------------------------------------------------
    console.log("calling rest api with path: " + path);

    this.http.get(path)
      .subscribe(res => {
          // console.log("got data", res);
          let data = res.text();
          // console.log("data", data);
          if (this.appState.state.user && this.appState.state.user.needsToBeReminded != (data == "ON")) {
            this.showReminder((data == "ON"));
          }
        },
        error => {
          console.log(error)
        })
  }

  private showReminder(show) {
    console.log("show reminder ------------------------------------------------------------------")
    if (this.appState.state.user) {
      this.appState.state.user.needsToBeReminded = show;
      0
    }
    if (show == false) {
      this.isShowImage = false;
      this.isShowVideo = false;
      this.isPlaySound = false;
    } else {
      // which reminder to show?
      if (this.appState.state.user && this.appState.state.user.reminder != null) {
        this.startReminder(this.appState.state.user.reminder);
      } else {
        console.log("no user.reminder")
        this.startRandomReminder();
      }
    }
  }

  private startReminder(val) {
    console.log("shor reminder ", val);
    switch (val) {
      case 0 :
        this.isShowImage = true;
        break;
      case 1 :
        this.isShowVideo = true;
        break;
      case 2 :
        this.isPlaySound = true;
        break;
      case 3 :
        this.startRandomReminder();
        break;
      default :
        console.log("unvalid reminder val: " + val);
        this.isShowImage = true;
        break;
    }
  }

  private startRandomReminder() {
    console.log("start random reminder");
    this.startReminder(Math.floor(Math.random() * 3))
  }

  // // --------------------------------------------------------------------------
  // var itemName = "Reminder_Show_Video"
  // var path = "/rest/items/" + itemName + "/state";
  // // --------------------------------------------------------------------------
  // console.log("calling rest api with path: " + path);
  //
  // this.http.get(path)
  //   .subscribe(res => {
  //       console.log("got data", res);
  //       let data = res.text();
  //       this.isShowVideo = (data == "ON") ? true : false;
  //     },
  //     error => {
  //       console.log(error)
  //     })
  //
  // // --------------------------------------------------------------------------
  // var itemName = "Reminder_Play_Sound"
  // var path = "/rest/items/" + itemName + "/state";
  // // --------------------------------------------------------------------------
  // console.log("calling rest api with path: " + path);
  //
  // this.http.get(path)
  //   .subscribe(res => {
  //       console.log("got data", res);
  //       let data = res.text();
  //       this.isPlaySound = (data == "ON") ? true : false;
  //     },
  //     error => {
  //       console.log(error)
  //     })
  //

}
