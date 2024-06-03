import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CubeComponent } from './cube/cube.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CubeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
}
