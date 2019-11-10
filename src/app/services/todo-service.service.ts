import { Injectable } from '@angular/core';
import { BehaviorSubject, Observer } from 'rxjs';

export class Todo {
  id: number;
  label: string;
  priority: number;
  dueDate: Date;
}

@Injectable({
  providedIn: 'root'
})

export class TodoService {

  private todos: Todo[];
  private nextId = 0;
  private todosSubject = new BehaviorSubject<Todo[]>([]);

  constructor() {
    this.todos = JSON.parse(localStorage.getItem('todos')) || [];
    for (const todo of this.todos) {
      if (todo.id >= this.nextId) this.nextId = todo.id+1;
    }
    this.update();
  }

  subscribe(observer: Observer<Todo[]>) {
    this.todosSubject.subscribe(observer);
  }

  addTodo(label: string, priority: number, dueDate: Date): Todo {
    const todo = {id: this.nextId++, label, priority, dueDate};
    this.todos.push(todo);
    this.update();
    return todo;
  }

  getTodo(id: number): Todo {
    const index = this.findIndex(id);
    return this.todos[index];
  }

  updateTodo(id: number, label: string, priority: number, dueDate: Date) {
    const index = this.findIndex(id);
    this.todos[index] = {id, label, priority, dueDate};
    this.update();
  }

  deleteTodo(id: number) {
    const index = this.findIndex(id);
    this.todos.splice(index, 1);
    this.update();
  }

  private update() {
    localStorage.setItem('todos', JSON.stringify(this.todos));
    this.todosSubject.next(this.todos.map(
      todo => ({id: todo.id, label: todo.label, priority: todo.priority, dueDate: todo.dueDate})
    ));
  }

  private findIndex(id: number): number {
    const index = this.todos.findIndex(todo => todo.id === id)
    if (index > -1){
      return index;
    } else {
      throw new Error(`Note with id ${id} was not found!`);
    }
  }
}