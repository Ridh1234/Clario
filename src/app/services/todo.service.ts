import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ToDo } from '../todo';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private readonly storageKey = 'todos';

  private readTodos(): ToDo[] {
    const raw = localStorage.getItem(this.storageKey);
    try {
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  private writeTodos(todos: ToDo[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(todos));
  }

  private generateId(): string {
    return Math.random().toString(36).slice(2) + Date.now().toString(36);
  }

  // Get all todos
  getTodos(): Observable<ToDo[]> {
    return of(this.readTodos());
  }

  // Create a new todo
  createTodo(todo: { title: string, desc: string, category: string }): Observable<ToDo> {
    const todos = this.readTodos();
    const newTodo: ToDo = {
      sno: (todos[0]?.sno ?? 0) + 1,
      title: todo.title,
      desc: todo.desc,
      active: true,
      category: todo.category,
      _id: this.generateId()
    };
    todos.unshift(newTodo);
    this.writeTodos(todos);
    return of(newTodo);
  }

  // Update a todo
  updateTodo(id: string, changes: Partial<ToDo>): Observable<ToDo> {
    const todos = this.readTodos();
    const idx = todos.findIndex(t => t._id === id);
    if (idx !== -1) {
      todos[idx] = { ...todos[idx], ...changes } as ToDo;
      this.writeTodos(todos);
      return of(todos[idx]);
    }
    return of(null as unknown as ToDo);
  }

  // Delete a todo
  deleteTodo(id: string): Observable<boolean> {
    const todos = this.readTodos();
    const next = todos.filter(t => t._id !== id);
    this.writeTodos(next);
    return of(true);
  }

  // Toggle todo active status
  toggleTodo(id: string): Observable<ToDo> {
    const todos = this.readTodos();
    const idx = todos.findIndex(t => t._id === id);
    if (idx !== -1) {
      todos[idx] = { ...todos[idx], active: !todos[idx].active } as ToDo;
      this.writeTodos(todos);
      return of(todos[idx]);
    }
    return of(null as unknown as ToDo);
  }
}
