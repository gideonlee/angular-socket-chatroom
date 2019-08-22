import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserCreateComponent } from './components/user-create/user-create.component';
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { ChatroomComponent } from './components/chatroom/chatroom.component';
import { UserAllComponent } from './components/user-all/user-all.component'; 

const APP_ROUTES: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'users/new' },
	{ path: 'users/new', component: UserCreateComponent },
	{ path: 'users/all', component: UserAllComponent },
	{ path: 'chatroom/:id', component: ChatroomComponent },
	{ path: 'users/:id/edit', component: UserEditComponent }
];

@NgModule({
	imports: [RouterModule.forRoot(APP_ROUTES)],
	exports: [RouterModule]
})

export class AppRoutingModule {}
