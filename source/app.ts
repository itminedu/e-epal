import { NgModule } from '@angular/core';

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
// import { TodoService, FormatService } from './components/todo-app/todo-service';

/* Here we import services */
// import Service1 from './services/service1';

import Home from './components/home';
import { Ng2SmartTableModule } from 'ng2-smart-table';
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
    Ng2SmartTableModule
  ],
  declarations: [
    Main,
    APP_DECLARATIONS,
  ],
  bootstrap: [ Main ],
  providers: [
    { provide: APP_BASE_HREF, useValue: '/' },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: NgLocalization, useClass: MyLocalization },
//    Service1, again services here
  ]
})
class AppModule {}

platformBrowserDynamic().bootstrapModule(AppModule);
