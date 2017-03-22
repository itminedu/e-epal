import 'reflect-metadata';
import 'babel-polyfill';
import 'core-js/es6';
import 'core-js/es7/reflect';
import { NgModule } from '@angular/core';
import { NgReduxModule, DevToolsExtension, NgRedux } from 'ng2-redux';
import {BrowserModule} from '@angular/platform-browser';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

import {RouterModule} from '@angular/router';
import { HttpModule } from '@angular/http';
import {
  APP_BASE_HREF,
  HashLocationStrategy,
  LocationStrategy,
  NgLocalization,
} from '@angular/common';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import Main from './containers/main';
import { APP_ROUTER_PROVIDERS, APP_DECLARATIONS } from './app.routes';

/* Here we import services */
import {HelperDataService} from './services/helper-data-service';
import {LoaderService} from './services/Spinner.service';

import { ACTION_PROVIDERS } from './actions';
import Home from './components/home';
import { Ng2SmartTableModule } from 'ng2-smart-table';

import HeaderComponent from './components/header/header.component';
import NavbarComponent from './components/navbar/navbar.component';
import MainComponent from './components/main/main.component';
import FooterComponent from './components/footer/footer.component';

class MyLocalization extends NgLocalization {
   getPluralCategory(value: any) {
      if (value < 5) {
         return 'few';
      }
   }
}

@NgModule({
  imports:      [
    BrowserModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    APP_ROUTER_PROVIDERS,
    HttpModule,
    Ng2SmartTableModule,
    NgReduxModule,

  ],
  declarations: [
    Main, FooterComponent, HeaderComponent, NavbarComponent, MainComponent,
    APP_DECLARATIONS,
  ],
  bootstrap: [ Main ],
  providers: [
    { provide: APP_BASE_HREF, useValue: '/' },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: NgLocalization, useClass: MyLocalization },
    DevToolsExtension,
    ACTION_PROVIDERS,
    //Service1, again services here
    HelperDataService,
    LoaderService,
  ]
})
class AppModule {}

platformBrowserDynamic().bootstrapModule(AppModule);
