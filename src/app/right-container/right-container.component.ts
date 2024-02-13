import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { WeatherService } from '../service/weatherservice.service';


@Component({
  selector: 'app-right-container',
  standalone: true,
  imports: [CommonModule,FontAwesomeModule],
  templateUrl: './right-container.component.html',
  styleUrl: './right-container.component.css'
})
export class RightContainerComponent {
  constructor(public weatherService : WeatherService) {};
  faThumbsUp:any = faThumbsUp;
  faThumbsDown:any = faThumbsDown;
   
   onTodayClick(){
    this.weatherService.today = true;
    this.weatherService.week = false;
   }
   onWeekClick(){
    this.weatherService.today = false;
    this.weatherService.week = true;
   }
   onCelsiusClick(){
     this.weatherService.celsius=true;
     this.weatherService.fahrenheit=false;
   }
   onFahrenheitClick(){
     this.weatherService.celsius=false;
     this.weatherService.fahrenheit=true;
   }
}
