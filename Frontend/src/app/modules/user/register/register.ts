import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [RouterModule, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

  name : string = ""
  email : string = ""
  password : string = ""
  confirmPassword : string = ""

  constructor(private auth : AuthService, private router : Router) {}

  register(){
    this.auth.register({username : this.name, email : this.email, password : this.password})
    .subscribe(()=>{
      this.router.navigate(['/login'])
    })
  }


  isFormValid(): boolean {
    return !!this.name && !!this.email && !!this.password && !!this.confirmPassword 
           && this.password === this.confirmPassword;
  }

}
