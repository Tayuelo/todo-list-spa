import { ChangeDetectionStrategy, Component, OnInit, computed, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { TodosService } from '../services/todos.service';
import { EFilterTodos } from '../models/enums';
import { TodoItemComponent } from '../todo/todo.component';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'todo-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule, TodoItemComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
  animations: [
    trigger('flyInOut', [
      state('in', style({ transform: 'translateX(0)' })),
      transition(':enter', [
        style({ transform: 'translateX(-20%)' }),
        animate(100),
      ]),
      transition(':leave', [
        animate(100, style({ transform: 'translateX(100%)' }))
      ])
    ]),
  ],
})
export class TodoListComponent implements OnInit {
  public todosService = inject(TodosService);
  public loading = this.todosService.loading;

  public editingId: string | null = '';

  public visibleTodos = computed(() => {
    const todos = this.todosService.todos();
    const filter = this.todosService.filterTodos();

    if (filter === EFilterTodos.active) {
      return todos.filter((todo) => !todo.completed);
    } else if (filter === EFilterTodos.completed) {
      return todos.filter((todo) => todo.completed);
    }
    return todos;
  });

  constructor() {
    effect(() => {
      console.log(`Todos: `, this.todosService.todos());
    })
  }
  
  ngOnInit(): void {
    this.todosService.getTodos();
  }

  setEditingId(id: string | null) {
    this.editingId = id;
  }

  removeTodo(id: string | undefined) {
    this.todosService.deleteTodo(id);
  }
}
