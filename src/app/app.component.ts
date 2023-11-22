import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { TodoHeaderComponent } from './header/header.component';
import { TodoListComponent } from './list/list.component';
import { TodoFooterComponent } from './footer/footer.component';
import { TodosService } from './services/todos.service';

@Component({
  selector: 'todo-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    TodoHeaderComponent,
    TodoListComponent,
    TodoFooterComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [ TodosService ],
})
export class AppComponent {}
