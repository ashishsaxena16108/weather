import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faLocation } from '@fortawesome/free-solid-svg-icons';
import { faSun } from '@fortawesome/free-solid-svg-icons';
import { WeatherService } from '../service/weatherservice.service';

@Component({
  selector: 'app-left-container',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './left-container.component.html',
  styleUrl: './left-container.component.css'
})
export class LeftContainerComponent {
  faMagnifyingGlass:any = faMagnifyingGlass;
  faLocation:any = faLocation;
  faSun:any = faSun;
  constructor(public weatherService : WeatherService){}
  onSearch(location:string){
    this.weatherService.cityName = location;
    this.weatherService.getData();
  }
}
