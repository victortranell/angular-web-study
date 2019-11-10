import { Component, OnInit, Input } from '@angular/core';
import { isValid } from 'date-fns';
import { Todo, TodoService } from 'src/app/services/todo-service.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})

export class TodoListComponent implements OnInit {

  @Input() showTodo: boolean;
  newLabel: string;
  newPriority: number;
  newDueDate: Date;
  todos = new BehaviorSubject<Todo[]>([]);

  constructor(
    private todoService: TodoService
    ) { }

  ngOnInit() {
    this.todoService.subscribe(this.todos)
  }

  ngOnChanges(changes) {
    console.log(this.todos)
  }

  validateTodo(todo) {
    return this.isLabel(todo.label) && this.isPriority(todo.priority) && this.isDueDate(todo.dueDate);
  }

  isLabel(label) {
    return label && typeof label === 'string';
  }
  
  isPriority(priority) {
    return priority && !isNaN(Number(priority));
  }
  
  isDueDate(dueDate) {
    return dueDate && isValid(dueDate);
  }

  setNewLabel(event) {
    if(this.isLabel(event.target.value)) {
      this.newLabel = event.target.value;
    } else {
      this.newLabel = null;
    }
  }
  setNewPriority(event) {
    if(this.isPriority(event.target.value)) {
      this.newPriority = event.target.value;
    } else {
      this.newPriority = null;
    }
  }
  setNewDueDate(event) {
    const date = new Date(event.target.value)
    if(date && this.isDueDate(date)) {
      this.newDueDate = date;
    } else {
      this.newDueDate = null;
    }
  }

  addTodo() {
    this.todoService.addTodo(this.newLabel, this.newPriority, this.newDueDate);
  }
}
