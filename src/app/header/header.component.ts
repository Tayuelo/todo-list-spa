import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodosService } from '../services/todos.service';

@Component({
  selector: 'todo-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class TodoHeaderComponent {
  
  todosService = inject(TodosService);
  public description = '';

  changeText(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.description = target.value;
  }

  addTodo(): void {
    this.todosService.addTodo(this.description);
    this.description = '';
  }
}
