import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { AccountService } from '@app/_services';
import { User } from '@app/_models';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
  users: User[] = new Array<User>()
  items = [];
  pageOfItems: Array<any>;

    constructor(private accountService: AccountService) {}

    ngOnInit() {
        this.accountService.getAll()
            .pipe(first())
            .subscribe(users => this.users = users);
      this.items = this.users;
    }

    onChangePage(pageOfItems: Array<any>) {
      // update current page of items
      this.pageOfItems = pageOfItems;
      this.items = pageOfItems
    }

    deleteUser(id: string) {
        const user = this.users.find(x => x.id === id);
        user.isDeleting = true;
        this.accountService.delete(id)
            .pipe(first())
            .subscribe(() => this.users = this.users.filter(x => x.id !== id));
    }
}
