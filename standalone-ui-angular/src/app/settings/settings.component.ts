import {
  Component,
  OnInit
} from '@angular/core';

import {AppState} from '../app.service';
import {Title} from './title';
import {XLargeDirective} from './x-large';
import {Router} from "@angular/router";

@Component({
  /**
   * The selector is what angular internally uses
   * for `document.querySelectorAll(selector)` in our index.html
   * where, in this case, selector is the string 'home'.
   */
  selector: 'settings',  // <hello></hello>
  /**
   * We need to tell Angular's Dependency Injection which providers are in our app.
   */
  providers: [],
  /**
   * Our list of styles in our component. We may add more to compose many styles together.
   */
  styleUrls: ['./settings.component.scss'],
  /**
   * Every Angular template is first compiled by the browser before Angular runs it's compiler.
   */
  templateUrl: './settings.component.html'
})
export class SettingsComponent implements OnInit {
  /**
   * Set our default values
   */
  public localState = {value: ''};
  public option = 1;
  public color: number = 0;
  public reminder: number = 0;

  /**
   * TypeScript public modifiers
   */
  constructor(public appState: AppState, private router: Router) {
  }

  public ngOnInit() {
    console.log('hello `settings` component');
    if (this.appState.state.user) {
      this.reminder = this.appState.state.user.reminder;
      if (!this.reminder) {
        this.reminder = 0;
      }
    }

    console.log("reminder set to " + this.reminder)
    /**
     * this.title.getData().subscribe(data => this.data = data);
     *
     */
    if (this.appState.state.isFont == "root-style-font-large") {
      this.option = 2;
    }
    if (this.appState.state.isFont == "root-style-font-x-large") {
      this.option = 3;
    }

  }

  public onColorSelected() {
    console.log("onColorSelected " + this.color)
    if (this.color == 1) {
      this.appState.set('isBlackWhite', 'root-style-black-white');
    }
    if (this.color == 0) {
      this.appState.set('isBlackWhite', '');
    }

  }


  public onOptionSelected() {
    console.log("onOptionSelected")
    if (this.option == 1) {
      this.appState.set('isFont', '');
    }
    if (this.option == 2) {
      this.appState.set('isFont', 'root-style-font-large');
    }
    if (this.option == 3) {
      this.appState.set('isFont', "root-style-font-x-large");
    }
  }

  public onEmailChange(e) {
    console.log("email change",  e.target.value)
    if (this.appState.state.user) {
      this.appState.state.user.email = e.target.value;
      this.appState.set("user", this.appState.state.user);
    }
  }

  public onReminderSelected() {
    if (this.appState.state.user) {
      this.appState.state.user.reminder = this.reminder;
      this.appState.set("user", this.appState.state.user);
    }
    console.log("reminder changed ", this.reminder);
  }

}
