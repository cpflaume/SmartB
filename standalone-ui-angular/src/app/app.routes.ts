import { Routes } from '@angular/router';
import { HomeComponent } from './home';
import { HelloComponent } from './hello';
import { AboutComponent } from './about';
import { NoContentComponent } from './no-content';

import { DataResolver } from './app.resolver';
import {OverviewComponent} from "./overview/overview.component";
import {SettingsComponent} from "./settings/settings.component";
import {StatisticComponent} from "./statistic/statistic.component";

export const ROUTES: Routes = [

  { path: '',      component: HelloComponent },
  { path: 'hello',  component: HelloComponent },
  { path: 'home',  component: HomeComponent },
  { path: 'settings',  component: SettingsComponent },
  { path: 'statistic',  component: StatisticComponent },
  { path: 'overview',  component: OverviewComponent },
  { path: 'about', component: AboutComponent },
  { path: 'detail', loadChildren: './+detail#DetailModule'},
  { path: 'barrel', loadChildren: './+barrel#BarrelModule'},
  { path: '**',    component: NoContentComponent },
];
