import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.html'
})
export class RegisterComponent {

  user = {
    name: '',
    email: '',
    password: ''
  };

  register() {
    localStorage.setItem('user', JSON.stringify(this.user));
    alert('Registration Successful');
  }
}