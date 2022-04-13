import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { AccountService } from '@app/_services';
import { TimeService } from '@app/_services';
import {Time} from '@app/_models';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
  times: Time[] = new Array<Time>();

    constructor(private timeService: TimeService,
                private accountService: AccountService) {}

    ngOnInit() {
      const timesObservable = this.accountService.getCurrentTime();
      timesObservable.subscribe((times: []) => {
        this.times = times;
      });
    }
}
