import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './../../service/api.service';
import { Subscription } from 'rxjs'
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-user-all',
  templateUrl: './user-all.component.html',
  styleUrls: ['./user-all.component.css']
})
export class UserAllComponent implements OnInit {
	users = [];
  private subscriptions: Subscription = new Subscription(); 

  constructor(private api: ApiService, private router: Router, private socket: Socket) {
  	// Load all Users
  	this.subscriptions.add(
      this.api.allUsers().subscribe((res) => {
    		this.users = res;
    	}, (err) => {
    		console.log('Subscription Error on user get all.');
        console.log(err);
    	})
    );
  };

  // If user is logs in.
  loginUser(user) {
    this.socket.emit('userLoggedIn', user);
    this.router.navigateByUrl(`/chatroom/${user._id}`);
  };

  // Delete Selected User
  deleteUser(user, i) {
  	this.subscriptions.add(
      this.api.deleteUser(user._id).subscribe((res) => {
    		this.users.splice(i, 1)
    	}, (err) => {
    		console.log(`Subscription Error on user delete.`);
        console.log(err);
    	})
    );

  };

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

}
