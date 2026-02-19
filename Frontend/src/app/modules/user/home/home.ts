import { Component,OnInit } from '@angular/core';
import { RouterModule,Router } from '@angular/router';
import { UserHeader } from '../header/header';

@Component({
  selector: 'app-home',
  imports: [RouterModule, UserHeader],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

  userName : string = 'User'

  constructor(router : Router) {}


  ngOnInit(): void {
    const userStr = localStorage.getItem('user');

    if (userStr) {
        const user = JSON.parse(userStr);
        this.userName = user.username || 'User'
    }else{
      console.log("No user found");
    }
  }

}
