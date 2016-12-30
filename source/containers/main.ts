import { Component, Inject, OnInit, OnDestroy }
 from '@angular/core';
import {
  Router,
  ActivatedRoute,
}
 from '@angular/router';
import './globalstyles.css';

@Component({
  selector: 'main',
  template: `
  <div class="row">
    <div class="col-md-3">
      <ul class="nav nav-pills nav-stacked">
      <li [ngClass]="{active: path=='course-fields-select'}">
        <a [routerLink]="['/course-fields-select']">Επιλογή Ειδικότητας</a>
      </li>
      <li [ngClass]="{active: path=='form3'}">
        <a [routerLink]="['/form3']">Αίτηση</a>
      </li>
      <li [ngClass]="{active: path=='students-list'}">
        <a [routerLink]="['/students-list']">Μαθητές</a>
      </li>
      </ul>
    </div>
    <div class="col-md-9">
      <div class="panel panel-primary">
        <div class="panel-heading">
          <h3 class="panel-title">{{path || 'home' | camelcase }}</h3>
        </div>
        <div class="panel-body">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  </div>
  `
})
export default class Main {
  public path: string = '';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    router.events.subscribe((data) => {
      this.path = data.url.substr(1);
    });
  }

}
