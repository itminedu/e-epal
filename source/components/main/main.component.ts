import {Component} from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'reg-main',
  templateUrl: 'main.component.html'
})
export default class MainComponent { 

	constructor(
        private router: Router
    ) {}

navigatelegal() {
  this.router.navigate(['/legal-info']);
    }

}
