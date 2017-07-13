/**
 * Angular 2 decorators and services
 */
import {
  Component,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import {AppState} from './app.service';

/**
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './app.component.css'
  ],
  template: `<div [ngClass]="[appState.state.isFont, appState.state.isBlackWhite]">
    <nav class="nav-pills nav-fill menu-wrapper" *ngIf="!appState.state.hideMenu">
    <div class="menu-left">
      <div class="menu-item" [routerLink]=" ['./overview'] "
        routerLinkActive="active" [routerLinkActiveOptions]= "{exact: true}">
      <a >
        Übersicht
      </a>
      </div>
       
      
      <div class="menu-item" [routerLink]=" ['./statistic'] "
        routerLinkActive="active" [routerLinkActiveOptions]= "{exact: true}">
      <a >
        Statistik
      </a>
      </div> 
       
      </div>
      <div class="menu-right">  
  
          <div class="menu-item" [routerLink]=" ['./settings'] "
        routerLinkActive="active" [routerLinkActiveOptions]= "{exact: true}">
      <a >
        Einstellungen
      </a>
        </div>
      <div class="menu-item" [routerLink]=" ['./hello'] " routerLinkActive="active" [routerLinkActiveOptions]= "{exact: true}">
          <a >
        Tschüss
      </a> 
        <span class="glyphicon glyphicon-log-out" aria-hidden="true"></span>
      </div>
      </div>
    </nav>

    <main>
      <router-outlet></router-outlet>
    </main>

    <!--<pre class="app-state">this.appState.state = {{ appState.state | json }}</pre>-->

    <!--<footer>-->
      <!--<span>WebPack Angular 2 Starter by <a [href]="url">@AngularClass</a></span>-->
      <!--<div>-->
        <!--<a [href]="url">-->
          <!--<img [src]="angularclassLogo" width="25%">-->
        <!--</a>-->
      <!--</div>-->
    <!--</footer>-->
    </div>
  `
})
export class AppComponent implements OnInit {
  public angularclassLogo = 'assets/img/angularclass-avatar.png';
  public name = 'Angular 2 Webpack Starter';
  public url = 'https://twitter.com/AngularClass';

  constructor(public appState: AppState) {
    this.appState.set('isBlackWhite', '');
    this.appState.set('isFont', '');
  }

  public ngOnInit() {
    console.log('Initial App State', this.appState.state);
  }

}

/**
 * Please review the https://github.com/AngularClass/angular2-examples/ repo for
 * more angular app examples that you may copy/paste
 * (The examples may not be updated as quickly. Please open an issue on github for us to update it)
 * For help or questions please contact us at @AngularClass on twitter
 * or our chat on Slack at https://AngularClass.com/slack-join
 */
