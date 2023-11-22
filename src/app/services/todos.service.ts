import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { ITodo } from '../models/todo';
import { finalize, switchMap } from 'rxjs';
import { EFilterTodos } from '../models/enums';

@Injectable({
  providedIn: 'root',
})
export class TodosService {
  public http = inject(HttpClient);

  #todos = signal<ITodo[]>([]);
  todos = this.#todos.asReadonly();

  #loading = signal(false);
  loading = this.#loading.asReadonly();

  #filterTodos = signal<EFilterTodos>(EFilterTodos.all);

  public filterTodos = this.#filterTodos.asReadonly();

  changeFilter(filterName: EFilterTodos): void {
    this.#filterTodos.set(filterName);
  }

  public addTodo(description: string) {
    this.#loading.set(true);
    const todo: ITodo = {
      description,
      completed: false,
      _id: undefined,
    };

    return this.http
      .post<ITodo>('http://localhost:3000/todos', todo)
      .pipe(finalize(() => this.#loading.set(false)))
      .subscribe((todo: ITodo) => {
        this.#todos.update((todos) => [...todos, todo]);
      });
  }

  public getTodo(id: string) {
    return this.http.get<ITodo>(`http://localhost:3000/todos/${id}`);
  }

  public getTodos() {
    this.#loading.set(true);
    return this.http
      .get<ITodo[]>('http://localhost:3000/todos')
      .pipe(finalize(() => this.#loading.set(false)))
      .subscribe((todos: ITodo[]) => this.#todos.set(todos));
  }

  public updateTodo(id: string | undefined, description: string) {
    this.#loading.set(true);
    return this.http
      .put<ITodo>(`http://localhost:3000/todos/${id}`, { description })
      .pipe(finalize(() => this.#loading.set(false)))
      .subscribe((res: ITodo) =>
        this.#todos.update((todos) => {
          return todos.map((todo) => (todo._id === id ? res : todo));
        })
      );
  }

  public patchTodo(id: string | undefined, todo: Partial<ITodo>) {
    this.#loading.set(true);
    return this.http
      .patch<ITodo>(`http://localhost:3000/todos/${id}`, todo)
      .pipe(finalize(() => this.#loading.set(false)));
  }

  public deleteTodo(id: string | undefined) {
    this.#loading.set(true);
    return this.http
      .delete<boolean>(`http://localhost:3000/todos/${id}`)
      .pipe(finalize(() => this.#loading.set(false)))
      .subscribe((res: boolean) => {
        if (res) {
          this.#todos.update((todos) =>
            todos.filter((todo) => todo._id !== id)
          );
        }
      });
  }

  public mutateTodo(inputTodo: ITodo) {
    this.#todos.update((todos) => {
      return todos.map((todo) =>
        todo._id === inputTodo._id ? inputTodo : todo
      );
    });
  }
}
