import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, CommonModule],
  template: `
    <h2>User App</h2>
    <nav>
      <a routerLink="/">Register</a> |
      <a routerLink="/login">Login</a> |
      <a routerLink="/profile">Profile</a>
    </nav>
    <router-outlet></router-outlet>
  `
})
export class App {}