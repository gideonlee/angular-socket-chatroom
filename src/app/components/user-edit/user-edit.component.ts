import { Component, OnInit, NgZone } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from './../../service/api.service';
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {
	submitted = false;
	editUserForm: FormGroup;
  private subscription: Subscription = new Subscription();

  constructor(public fb: FormBuilder, private router: Router, private ngZone: NgZone, private api: ApiService, private ar: ActivatedRoute) { }

	// Creates User form with validations
  editForm() {
  	this.editUserForm = this.fb.group({
  		name: ['', [Validators.required]],
  		email: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$')]]
  	});
  }

  // Allows validations controls.
  get myForm() {
  	return this.editUserForm.controls;
  }

  // Gets User by _id
  getUser(id) {
    this.subscription.add(
      this.api.getUser(id).subscribe(res => {
    		this.editUserForm.setValue({
    			name: res.name,
    			email: res.email
    		})
    	})
    );	
  }

  ngOnInit() {
  	this.editForm();
  	// let id = this.ar.snapshot.paramMap.get('id');
  	let id = this.ar.snapshot.params.id;
  	this.getUser(id);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  // Update User
  updateUser() {
  	this.submitted = true;
  	if (!this.editUserForm.valid) {
  		return false;
  	} else {
	  	let id = this.ar.snapshot.params.id;
	    this.subscription.add(
        this.api.updateUser(id, this.editUserForm.value).subscribe(res => {
  	  		this.ngZone.run(() => this.router.navigateByUrl('/users/all'))
  	  	}, (err) => {
  	  			console.log(`Subscription Error on user update.`)
  	  			console.log(err);	
  	  	})  		
      );	  	
    }
  };
}
