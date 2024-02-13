import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocationDetails } from '../models/LocationDetails';
import { WeatherDetails } from '../models/WeatherDetails';
import { TemperatureData } from '../models/TemperatureData';
import { TodayData } from '../models/TodayData';
import { TodaysHighlight } from '../models/TodaysHighlight';
import { Observable } from 'rxjs';
import { EnvironmentVariables } from '../Environment/EnvironmentVariables';
import { WeekData } from '../models/WeekData';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  today:boolean = false;
  week:boolean = true;
  celsius:boolean = true;
  fahrenheit:boolean = false;
  cityName:string = 'Delhi'

  LocationDetails?: LocationDetails
  WeatherDetails?: WeatherDetails

  temperatureData: TemperatureData = new TemperatureData();
  todayData: TodayData[] = [];
  WeekData: WeekData[] = [];
  todaysHighlight: TodaysHighlight = new TodaysHighlight();

  language:string = 'en-US'
  date:string = '20200622'
  units:string = 'm'

  currentTime:Date


  constructor(private httpClient: HttpClient) { 
    this.getData();
  }
  getSummaryImage(summary:string):string{
    var baseAddress = "assets/";

    var partlyCloudy = "cloudy-day.png";
    var mostlyCloudy = "cloud.png";
    var Sunny = "sun.png";
    var windy = "wind.png";
    var Rainy = "rain.png";
    var Storm = "storm.png";
    if(String(summary).includes("Partly Cloudy") || String(summary).includes("P Cloudy")) return baseAddress+partlyCloudy;
    else if(String(summary).includes("Partly Rainy") || String(summary).includes("P Rainy")) return baseAddress+Rainy;
    else if(String(summary).includes("rain")) return baseAddress+Rainy;
    else if(String(summary).includes("wind")) return baseAddress+windy;
    return baseAddress+Sunny;
  }
  fillTemperatureDataModel(){
    this.currentTime = new Date();
    this.temperatureData.day = this.WeatherDetails['v3-wx-observations-current'].dayOfWeek;
    this.temperatureData.time = `${String(this.currentTime.getHours()).padStart(2,'0')}:${String(this.currentTime.getHours()).padStart(2,'0')}`;
    this.temperatureData.temperature = this.WeatherDetails['v3-wx-observations-current'].temperature;
    this.temperatureData.location = `${this.LocationDetails.location.city[0]},${this.LocationDetails.location.country[0]}`;
    this.temperatureData.rainPercent = this.WeatherDetails['v3-wx-observations-current'].precip24Hour;
    this.temperatureData.summaryPhrase = this.WeatherDetails['v3-wx-observations-current'].wxPhraseShort;
    this.temperatureData.summaryImage = this.getSummaryImage(this.temperatureData.summaryPhrase);
  }
  fillWeekData(){
    var weekCount = 0;
    while(weekCount<7){
    this.WeekData.push(new WeekData());
    this.WeekData[weekCount].day = this.WeatherDetails['v3-wx-forecast-daily-15day'].dayOfWeek[weekCount].slice(0,3);
    this.WeekData[weekCount].tempMax = this.WeatherDetails['v3-wx-forecast-daily-15day'].calendarDayTemperatureMax[weekCount];
    this.WeekData[weekCount].tempMin = this.WeatherDetails['v3-wx-forecast-daily-15day'].calendarDayTemperatureMin[weekCount];
    this.WeekData[weekCount].summaryImage = this.getSummaryImage(this.WeatherDetails['v3-wx-forecast-daily-15day'].narrative[weekCount]);
    weekCount=weekCount+1;
  }
  }
  fillTodayData(){
   var todayCount = 0;
   while(todayCount<7){
    this.todayData.push(new TodayData());
    this.todayData[todayCount].time = this.WeatherDetails['v3-wx-forecast-hourly-10day'].validTimeLocal[todayCount].slice(11,16);
    this.todayData[todayCount].temperature = this.WeatherDetails['v3-wx-forecast-hourly-10day'].temperature[todayCount];
    this.todayData[todayCount].summaryImage = this.getSummaryImage(this.WeatherDetails['v3-wx-forecast-hourly-10day'].wxPhraseShort[todayCount]);
    todayCount++;
   } 
  }
  getTimefromString(localTime:string){
     return localTime.slice(11,16);
  }
  
  fillTodaysHighlight(){
    this.todaysHighlight.airQuality = this.WeatherDetails['v3-wx-globalAirQuality'].globalairquality.airQualityIndex;
    this.todaysHighlight.humidity = this.WeatherDetails['v3-wx-observations-current'].relativeHumidity;
    this.todaysHighlight.sunrise = this.getTimefromString(this.WeatherDetails['v3-wx-observations-current'].sunriseTimeLocal);
    this.todaysHighlight.sunset = this.getTimefromString(this.WeatherDetails['v3-wx-observations-current'].sunsetTimeLocal);
    this.todaysHighlight.uvIndex = this.WeatherDetails['v3-wx-observations-current'].uvIndex;
    this.todaysHighlight.visibility = this.WeatherDetails['v3-wx-observations-current'].visibility;
    this.todaysHighlight.windStatus = this.WeatherDetails['v3-wx-observations-current'].windSpeed;
  }
  prepareData():void{
      this.fillTemperatureDataModel();
      this.fillWeekData();
      this.fillTodayData();
      this.fillTodaysHighlight();
    }

    celsiusToFahrenheit(celcius:number){
      return +((celcius*1.8)+32).toFixed(2);
    }
    fahrenheitToCelsius(fahrenheit:number){
      return +((fahrenheit-32)*0.555).toFixed(2);
    }

  getLocationDetails(cityName:string,language:string):Observable<LocationDetails>{
    return this.httpClient.get<LocationDetails>(EnvironmentVariables.weatherApiLocationBaseURL,{
      headers: new HttpHeaders()
      .set(EnvironmentVariables.xRapidApiKeyName,EnvironmentVariables.xRapidApiKeyValue)
      .set(EnvironmentVariables.xRapidApiHostName,EnvironmentVariables.xRapidApiHostValue),
      params: new HttpParams()
      .set('query',cityName)
      .set('language',language)
    })
  }
  
  getWeatherReport(date:string,latitude:number,longitude:number,language:string,units:string):Observable<WeatherDetails>{
      return this.httpClient.get<WeatherDetails>(EnvironmentVariables.weatherApiLocationForecastBaseURL,{
        headers: new HttpHeaders()
        .set(EnvironmentVariables.xRapidApiKeyName,EnvironmentVariables.xRapidApiKeyValue)
        .set(EnvironmentVariables.xRapidApiHostName,EnvironmentVariables.xRapidApiHostValue),
        params: new HttpParams()
        .set('date',date)
        .set('latitude',latitude)
        .set('longitude',longitude)
        .set('language',language)
        .set('units',units)
      });
  }
  getData(){
    this.todayData = [];
    this.WeekData = [];
    this.temperatureData = new TemperatureData();
    this.todaysHighlight = new TodaysHighlight();
    var latitude=0;
    var longitude=0;
     this.getLocationDetails(this.cityName,this.language).subscribe({
      next:(response)=>{
        this.LocationDetails = response;
        latitude = this.LocationDetails?.location.latitude[0];
        longitude = this.LocationDetails?.location.longitude[0];
      }
     });

     this.getWeatherReport(this.date,latitude,longitude,this.language,this.units).subscribe({
      next:(response)=>{
        this.WeatherDetails = response;

        this.prepareData();
      }
     });
  }

}
