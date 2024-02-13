import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { LeftContainerComponent } from "./left-container/left-container.component";
import { RightContainerComponent } from "./right-container/right-container.component";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HttpClientModule } from '@angular/common/http';
@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [CommonModule, RouterOutlet, LeftContainerComponent, RightContainerComponent,FontAwesomeModule,HttpClientModule]
})
export class AppComponent {
  title = 'weather';
}
