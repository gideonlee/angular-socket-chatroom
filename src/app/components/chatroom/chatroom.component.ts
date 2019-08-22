import { Component, OnInit } from '@angular/core';
import { User } from './../../model/User';
import { ApiService } from './../../service/api.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs'
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.css']
})
export class ChatroomComponent implements OnInit {
	user: User = {
		_id: '',
  	name: '',
  	email: '',
	}
  admin: User = {
    _id: '',
    name: '',
    email: '',
  }
	messages: [];
  chatForm: FormGroup;
  private subscriptions: Subscription = new Subscription();

  constructor(public fb: FormBuilder, private socket: Socket, private api: ApiService, private ar: ActivatedRoute) {
  	// Chat Form Setup
  	this.chatForm = this.fb.group({
  		message: ['', [Validators.required]]
  	})

  	// Get User's id from URL params.
  	let id = this.ar.snapshot.params.id;
  	this.subscriptions.add(
      this.api.getUser(id).subscribe((res) => {
    		this.user = res;
      }, (err) => {
        console.log('Subscription Error on user get by id.');
        console.log(err);
      })
    );

		// Gets all messages for chatroom. 
    this.subscriptions.add(
      this.api.getAllMessages().subscribe((res) => {
        this.messages = res; 
      }, (err) => {
        console.log('Subscription Error on messages get all');
        console.log(err);
      })
    );

    // Socket that announces a user has entered the chatroom.
    this.socket.on('announceUser', (user) => {
      console.log(`User ${user.name} entered.`);
    });

  	// Socket that displays a new message once a User creates one. 
  	this.socket.on('displayNewMessage', (message) => {
  		this.subscriptions.add(
        this.api.getAllMessages().subscribe((res) => {
    			this.messages = res; 
    		}, (err) => {
          console.log('Subscription Error on messages get all.');
          console.log(err);
        })
      )
  	});
  	
  	// Socket that displays all the messages once a User deletes one. 
  	this.socket.on('displayMessages', () => {
  		this.subscriptions.add(
        this.api.getAllMessages().subscribe((res) => {
    			this.messages = res; 
    		}, (err) => {
          console.log('Subscription Error on messages get all.');
          console.log(err);
        })
      )
  	});
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    console.log(`Exiting ${this.user.name}`);
    this.subscriptions.unsubscribe();
  }

  // Post a new Message
  submitChat() {
  	if (!this.chatForm.valid) {
  		return false;
  	}	else {
  		this.subscriptions.add(
        this.api.createMessage(this.user, this.chatForm.value).subscribe((res) => {
    			// Socket that recognizes a successfully added message. 
    			this.socket.emit('newMessage', { user: this.user, text: this.chatForm.value })
    		}, (err) => {
    			console.log(`Subscription Error message submit.`);
    			console.log(err);
    		})
      );

	  	this.chatForm.reset();  		
  	}
  }

  // Delete Message
  deleteMessage(msg_id) {
		this.subscriptions.add(
      this.api.deleteMessage(msg_id).subscribe((res) => {
  			this.socket.emit('reloadMessages');
  		}, (err) => {
    		console.log(`Subscription Error on message delete.`);
    		console.log(err);
  		})
    );
  }
}
