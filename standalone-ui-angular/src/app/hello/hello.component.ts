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
  selector: 'hello',  // <hello></hello>
  /**
   * We need to tell Angular's Dependency Injection which providers are in our app.
   */
  providers: [],
  /**
   * Our list of styles in our component. We may add more to compose many styles together.
   */
  styleUrls: ['./hello.component.scss'],
  /**
   * Every Angular template is first compiled by the browser before Angular runs it's compiler.
   */
  templateUrl: './hello.component.html'
})
export class HelloComponent implements OnInit {
  /**
   * Set our default values
   */
  public localState = {value: ''};


  public users = [
    {
      id: 2,
      name: 'Mr. Traussen',
      needsToBeReminded: false,
      drinkingLevel: 70,
      bottleValue: 10,
      role: 'patient',
      reminder: 1
    },
    {
      id: 1,
      name: 'Luise INSEL',
      needsToBeReminded: true,
      drinkingLevel: 20,
      bottleValue: 90,
      role: 'patient',
      reminder: 3,
      isFont: 'root-style-font-large',
      isBlackWhite: ''
    },
    {
      id: 3,
      name: 'Frieder Insel',
      role: 'supervisor',
      email: 'constantin.pflaume@gmail.com',
      isBlackWhite: 'root-style-black-white'
    },
    {
      id: 4,
      name: 'Pfleger',
      role: 'supervisor',
      email: 'constantin.pfaefflin@gmail.com'
    },
  ];

  /**
   * TypeScript public modifiers
   */
  constructor(public appState: AppState, private router: Router) {
    this.appState.set("hideMenu", true);
  }

  public ngOnInit() {
    console.log('hello `hello` component');
    /**
     * this.title.getData().subscribe(data => this.data = data);
     */

    // reset data
    this.appState.set("isBlackWhite", '');
    this.appState.set("isFont", '');

  }

  ngOnDestroy() {
    this.appState.set("hideMenu", false);
    if (this.appState.state.user) {
      var font = this.appState.state.user.isFont ? this.appState.state.user.isFont : '';
      var color = this.appState.state.user.isBlackWhite ? this.appState.state.user.isBlackWhite : '';
      console.log(font)
      this.appState.set("isFont", font);
      this.appState.set("isBlackWhite", color);
    }


  }

  public submitState(value: string) {
    console.log('submitState', value);
    this.appState.set('value', value);
    this.localState.value = '';
  }

  public cardClicked(value: any) {
    console.log("card clicked");
    console.log(value);

    var user = this.users.find(u => u.id == value.id);
    this.appState.set("user", user);
    this.router.navigate(['/overview']);
  }
}
