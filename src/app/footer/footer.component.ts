import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodosService } from '../services/todos.service';
import { EFilterTodos } from '../models/enums';

@Component({
  selector: 'todo-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class TodoFooterComponent {
  todosService = inject(TodosService);
  filterEnum = EFilterTodos;
  filterSig = this.todosService.filterTodos;
  noTodosClass = computed(() => this.todosService.todos().length === 0);

  activeCount = computed(() => {
    return this.todosService.todos().filter((todo) => !todo.completed).length;
  });

  itemsLeftText = computed(
    () => `item${this.activeCount() !== 1 ? 's' : ''} left`
  );

  changeFilter(event: Event, filterName: EFilterTodos): void {
    event.preventDefault();
    this.todosService.changeFilter(filterName);
    this.toggle();
  }

  isOpen = true;

  toggle() {
    this.isOpen = !this.isOpen;
  }

  value: any;

  justifyOptions: any[] = [
      { icon: 'pi pi-align-left', justify: 'Left' },
      { icon: 'pi pi-align-right', justify: 'Right' },
      { icon: 'pi pi-align-center', justify: 'Center' },
      { icon: 'pi pi-align-justify', justify: 'Justify' }
  ];
}
