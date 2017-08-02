import { Component, Injectable, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
    selector: "director-buttons",
    template: `
           <div class="row" style="margin-top: 130px; margin-bottom: 200px;">
               <div class="col-md-3 offset-md-3">
                <button type="submit" class="btn-primary btn-lg btn-block isclickable" style="margin: 0px; font-size: 1em; padding: 5px;" (click)="navigatedirector()">
                Δηλώσεις<br />Μαθητών
                </button>
                </div>
                <div class="col-md-6">
                 <button type="submit" class="btn-primary btn-lg btn-block isclickable" style="margin: 0px; font-size: 1em; padding: 5px;" (click)="navigatecapacity()">
                Δυναμική<br />Τμημάτων
                </button>
               </div>
            </div>
  `
})

@Injectable() export default class DirectorButtons implements OnInit {

    constructor(
        private router: Router,
    ) {
    };

    ngOnInit() {

    }

    navigatedirector() {
        this.router.navigate(["/school/director-view"]);

    }

    navigatecapacity() {
        this.router.navigate(["/school/director-classcapacity"]);
    }

}
