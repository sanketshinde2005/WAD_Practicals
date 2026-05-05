import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';   // ✅ REQUIRED
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, CommonModule],   // ✅ ADD FormsModule HERE
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  newTask: string = '';
  tasks: string[] = [];
  editIndex: number = -1;

  // Add Task
  addTask() {
    if (this.newTask.trim() !== '') {
      this.tasks.push(this.newTask);
      this.newTask = '';
    }
  }

  // Delete Task
  deleteTask(index: number) {
    this.tasks.splice(index, 1);
  }

  // Edit Task
  editTask(index: number) {
    this.newTask = this.tasks[index];
    this.editIndex = index;
  }

  // Update Task
  updateTask() {
    if (this.editIndex !== -1) {
      this.tasks[this.editIndex] = this.newTask;
      this.editIndex = -1;
      this.newTask = '';
    }
  }
}