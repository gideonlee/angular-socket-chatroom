import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
	baseUri: string = 'http://localhost:4000/api';
	headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient) { }

  // USERS API
  // Get all Users
  allUsers(): Observable<any> {
  	let url = `${this.baseUri}/users`;
  	return this.http.get(url).pipe(
      catchError(this.errorMgmt));
  }

  // Get selected User by id
  getUser(user_id): Observable<any> {
  	let url = `${this.baseUri}/users/${user_id}`;
  	return this.http.get(url).pipe(
  		catchError(this.errorMgmt));
  }

  // Get User by email
  getUserByEmail(user_email): Observable<any> {
    let url = `${this.baseUri}/users/email/${user_email}`
    return this.http.get(url).pipe(
      catchError(this.errorMgmt));
  }

  // Create User
  createUser(data): Observable<any> {
  	let url = `${this.baseUri}/users`;
  	return this.http.post(url, data).pipe(
      catchError(this.errorMgmt));
  }

  // Edit User
  updateUser(user_id, data): Observable<any> {
  	let url = `${this.baseUri}/users/${user_id}/edit`;
  	return this.http.put(url, data).pipe(
  		catchError(this.errorMgmt));
  }

  // Delete User
  deleteUser(user_id): Observable<any> {
  	let url = `${this.baseUri}/users/${user_id}/delete`;
  	return this.http.delete(url, { headers: this.headers }).pipe(
      catchError(this.errorMgmt));
  }

  // MESSAGES API
  // Get all messages for chatroom.
  getAllMessages(): Observable<any> {
    let url = `${this.baseUri}/messages`;
    return this.http.get(url).pipe(
      catchError(this.errorMgmt));
  }

  // Create a Message
  createMessage(user, msg): Observable<any> {
    let url = `${this.baseUri}/messages`;
    let obj = { 
      _id: user._id, 
      email: user.email, 
      text: msg.message 
    }
    return this.http.post(url, obj).pipe(
      catchError(this.errorMgmt));
  }

  // Delete a Message
  deleteMessage(msg_id): Observable<any> {
    let url = `${this.baseUri}/messages/${msg_id}/delete`;
    return this.http.delete(url, { headers: this.headers }).pipe(catchError(this.errorMgmt));
  }

  // Error Management
  errorMgmt(error: HttpErrorResponse) {
  	let errorMessage = ``;
  	if (error.error instanceof ErrorEvent) {
  		// Get Client-Side Error
  		errorMessage = error.error.message;
  	} else {
  		// Get Server-Side Error
  		errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
  	}
  	console.log(`Error Found on Api Service.`);
  	console.log(errorMessage);
  	return throwError(errorMessage);
  }
}
