import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { Time } from '@app/_models';

//const baseUrl = `${environment.apiUrl}/time`;
//const baseUrl = `${environment.apiUrl}/current_time`;

@Injectable({ providedIn: 'root' })
export class TimeService {
  private timeSubject: BehaviorSubject<Time>;
  public time: Observable<Time>;

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
      this.timeSubject = new BehaviorSubject<Time>(JSON.parse(localStorage.getItem('time')));
      this.time = this.timeSubject.asObservable();
    }

  public get timeValue(): Time {
    console.log("TimeService timeValue timeSubject.value ", this.timeSubject.value);
    return this.timeSubject.value;
  }

  getCurrentTime() {
      console.log("BEF TimeService getAll apiUrl ", environment.apiUrl);
      //return this.http.get<Time[]>(`${environment.apiUrl}/current_time`);
      let res = this.http.get<Time[]>(`${environment.apiUrl}/current_time`);
      console.log("AFT TimeService getAll apiUrl ", res);
      return res;
    }
}
