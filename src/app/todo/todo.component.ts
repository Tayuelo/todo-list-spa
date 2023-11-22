import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ITodo } from '../models/todo';
import { TodosService } from '../services/todos.service';
import { SubDestroyService } from '../services/utils';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'todo-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoItemComponent implements OnChanges {
  @ViewChild('textInput') textInput?: ElementRef;

  @Input({ required: true }) todo!: ITodo;
  @Input({ required: true }) editing!: boolean;
  @Output() setEditingId = new EventEmitter<string | null>();

  private todosService = inject(TodosService);
  private destroy$ = inject(SubDestroyService);

  public editingText = signal('');
  public loading = this.todosService.loading;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['editing'].currentValue) {
      setTimeout(() => {
        this.textInput?.nativeElement.focus();
      }, 0);
    }
  }

  toggleTodo(): void {
    this.todosService
      .patchTodo(this.todo?._id, { completed: !this.todo.completed })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: ITodo) => {
        this.todosService.mutateTodo(res);
      });
  }

  setTodoInEditMode() {
    this.editingText.set(this.todo.description);
    this.setEditingId.emit(this.todo._id);
  }

  removeTodo() {
    this.todosService.deleteTodo(this.todo?._id);
  }

  changeText(event: Event) {
    const target = event.target as HTMLInputElement;
    this.editingText.set(target.value);
  }

  changeTodo() {
    this.todosService
      .patchTodo(this.todo?._id, { description: this.editingText() })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: ITodo) => {
        this.todosService.mutateTodo(res);
        this.editingText.set('');
        this.setEditingId.emit(null);
      });
  }
}
