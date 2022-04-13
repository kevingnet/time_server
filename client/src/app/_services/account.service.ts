import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient, HttpParams} from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import {environment} from '@environments/environment';
import {User} from '@app/_models';
import {Time} from '@app/_models';

const baseUrl = `${environment.apiUrl}/users`;

@Injectable({providedIn: 'root'})
export class AccountService {
  private userSubject: BehaviorSubject<User>;
  private timeSubject: BehaviorSubject<Time>;
  public user: Observable<User>;
  public time: Observable<Time>;

  public email = '';
  public password = '';

  constructor(
    private router: Router,
    private http: HttpClient
  ) {
    this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
    this.user = this.userSubject.asObservable();
    this.timeSubject = new BehaviorSubject<Time>(JSON.parse(localStorage.getItem('time')));
    this.time = this.timeSubject.asObservable();
  }

  public get userValue(): User {
    return this.userSubject.value;
  }
  public get timeValue(): Time {
    return this.timeSubject.value;
  }

  login(email, password) {
    const reqres = this.http.post<any>(`${environment.apiUrl}/login`, {email: email, password: password})
      .pipe(map(user => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('user', JSON.stringify(user));
        console.log('user', JSON.stringify(user));
        this.userSubject.next(user);
        return user;
      }));
    console.log('reqres', JSON.stringify(reqres));

    return reqres;
  }

  logout() {
    // remove user from local storage and set current user to null
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }

  register(user: User) {
    return this.http.post(`${environment.apiUrl}/register`, user);
  }

  getAll() {
    //return this.http.get<User[]>(`${environment.apiUrl}/users`);
    console.log("BEF AccountService getAll apiUrl ", environment.apiUrl);
    let res = this.http.get<User[]>(`${environment.apiUrl}/users`);
    console.log("AFT AccountService getAll res ", res);
    return res;
  }

  getCurrentTime() {
    const headers = new HttpHeaders({
      'Content-Type':  'application/json',
      //'x-access-token':  'application/json',
      'Authorization': `Bearer test}`
    });
    const options = { headers: headers };

    //return this.http.get<Time[]>(`${environment.apiUrl}/current_time`);
    console.log("BEF AccountService getCurrentTime apiUrl ", environment.apiUrl);
    //return this.http.get<Time[]>(`${environment.apiUrl}/current_time`);
    let res = this.http.get<Time[]>(`${environment.apiUrl}/current_time`, options);
    console.log("AFT AccountService getCurrentTime res ", res);
    return res;

  }

  getById(id: string) {
    return this.http.get<User>(`${environment.apiUrl}/users/${id}`);
  }

  update(id, params) {
    return this.http.put(`${environment.apiUrl}/users/${id}`, params)
      .pipe(map(x => {
        // update stored user if the logged in user updated their own record
        if (id == this.userValue.id) {
          // update local storage
          const user = {...this.userValue, ...params};
          localStorage.setItem('user', JSON.stringify(user));

          // publish updated user to subscribers
          this.userSubject.next(user);
        }
        return x;
      }));
  }

  delete(id: string) {
    return this.http.delete(`${environment.apiUrl}/users/${id}`)
      .pipe(map(x => {
        // auto logout if the logged in user deleted their own record
        if (id == this.userValue.id) {
          this.logout();
        }
        return x;
      }));
  }
}
