import { Component } from '@angular/core';

import { AccountService } from './_services';
import { User } from './_models';
import { Time } from './_models';

// tslint:disable-next-line:component-selector
@Component({ selector: 'app', templateUrl: 'app.component.html' })
export class AppComponent {
  user: User;
  time: Time;
  items = [];
  pageOfItems: Array<any>;

  constructor(private accountService: AccountService) {
    this.accountService.user.subscribe(x => this.user = x);
    this.accountService.time.subscribe(x => this.time = x);
  }

  ngOnInit() {
    // an example array of 150 items to be paged
    this.items = Array(150).fill(0).map((x, i) => ({ id: (i + 1), name: `Item ${i + 1}`}));
  }

  onChangePage(pageOfItems: Array<any>) {
    // update current page of items
    this.pageOfItems = pageOfItems;
  }

  logout() {
        this.accountService.logout();
    }

}
