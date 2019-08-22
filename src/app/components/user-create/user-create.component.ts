import { Router } from '@angular/router';
import { ApiService } from './../../service/api.service';
import { Component, OnInit, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs'
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.css']
})
export class UserCreateComponent implements OnInit {
	submitted = false;
	userForm: FormGroup;
  private subscriptions: Subscription = new Subscription();

  constructor(public fb: FormBuilder, private router: Router, private ngZone: NgZone, private api: ApiService, private socket: Socket) { 
  	this.createForm();
  }

  ngOnInit() {
  }

  // Creates User Form with validations
  createForm() {
  	this.userForm = this.fb.group({
  		name: ['', [Validators.required]],
  		email: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$')]]
  	})
  }

  // Allows validations controls.
  get myForm() {
  	return this.userForm.controls;
  }

  // Create a new user. 
  submitUser() {
  	this.submitted = true;
  	if (!this.userForm.valid) {
  		return false;
  	} else {
  	  this.subscriptions.add(
        this.api.createUser(this.userForm.value).subscribe((res) => {
          this.socket.emit('newUserAdded', this.userForm.value);
  				this.ngZone.run(() => this.router.navigateByUrl(`/chatroom/${res._id}`))
      	}, (err) => {
      			console.log(`Subscription Error on user create.`)
      			console.log(err);	
      	})
      )	
  	}
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
