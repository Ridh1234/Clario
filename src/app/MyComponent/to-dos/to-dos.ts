import { Component, OnInit } from '@angular/core';
import { ToDo } from '../../todo';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodoItem } from "../todo-item/todo-item";
import { AddTodo } from "../add-todo/add-todo";
import { TodoService } from '../../services/todo.service';

@Component({
  selector: 'app-to-dos',
  standalone: true,
  imports: [CommonModule, FormsModule, TodoItem, AddTodo],
  templateUrl: './to-dos.html',
  styleUrl: './to-dos.css'
})
export class ToDos implements OnInit { 

  todos: ToDo[] = [];
  filteredTodos: ToDo[] = [];
  selectedCategory: string = 'All';
  categories: string[] = ['All', 'Work', 'Personal', 'Study', 'Today', 'This Week'];
  showCompleted: boolean = false;
  
  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.loadTodos();
  }

  loadFromLocalStorage(): void {
    const localItem = localStorage.getItem("todos");
    if (localItem != null) {
      this.todos = JSON.parse(localItem);
    } else {
      this.todos = [];
    }
  }

  saveToLocalStorage(): void {
    localStorage.setItem("todos", JSON.stringify(this.todos));
  }

  loadTodos(): void {
    this.todoService.getTodos().subscribe({
      next: (todos) => {
        this.todos = todos;
        this.filterTodos();
      },
      error: () => {
        this.loadFromLocalStorage();
        this.filterTodos();
      }
    });
  }

  filterTodos(): void {
    if (this.selectedCategory === 'All') {
      this.filteredTodos = this.todos.filter(todo => todo.active);
    } else {
      this.filteredTodos = this.todos.filter(todo => todo.category === this.selectedCategory && todo.active);
    }
  }

  onCategoryChange(): void {
    this.filterTodos();
  }

  deleteToDo(todo: ToDo): void {
    if (todo._id) {
      this.todoService.deleteTodo(todo._id).subscribe({
        next: () => {
          const index = this.todos.indexOf(todo);
          this.todos.splice(index, 1);
          this.filterTodos();
        },
        error: () => {
          const index = this.todos.indexOf(todo);
          this.todos.splice(index, 1);
          this.saveToLocalStorage();
          this.filterTodos();
        }
      });
    }
  }

  addToDo(todo: ToDo): void {
    this.todoService.createTodo({ title: todo.title, desc: todo.desc, category: todo.category }).subscribe({
      next: (newTodo) => {
        this.todos.unshift(newTodo); // Add to beginning of array
        this.filterTodos();
      },
      error: () => {
        todo.sno = this.todos.length + 1;
        todo.active = true;
        this.todos.unshift(todo);
        this.saveToLocalStorage();
        this.filterTodos();
      }
    });
  }

  toggleCheck(todo: ToDo): void {
    if (todo._id) {
      this.todoService.toggleTodo(todo._id).subscribe({
        next: (updatedTodo) => {
          const index = this.todos.indexOf(todo);
          this.todos[index] = updatedTodo;
          this.filterTodos();
        },
        error: () => {
          todo.active = !todo.active;
          this.saveToLocalStorage();
          this.filterTodos();
        }
      });
    }
  }

  // New methods for enhanced functionality
  getCompletedTodos(): ToDo[] {
    if (this.selectedCategory === 'All') {
      return this.todos.filter(todo => !todo.active);
    } else {
      return this.todos.filter(todo => todo.category === this.selectedCategory && !todo.active);
    }
  }

  getCompletedCount(): number {
    return this.getCompletedTodos().length;
  }

  toggleCompletedVisibility(): void {
    this.showCompleted = !this.showCompleted;
  }

  trackByTodo(index: number, todo: ToDo): any {
    return todo._id || todo.sno || index;
  }
}
