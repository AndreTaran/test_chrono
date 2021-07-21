import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';

import { Subscription, interval, timer, Observable, fromEvent, Subject } from 'rxjs';
import { buffer, bufferTime, debounceTime, filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy{
  title = 'chronometer';

  Minutes_In_Hours = 60;
  Seconds_In_Minutes = 60;
  Double_Click = 300

  private subscription!: Subscription;

  hours: number = 0;
  minutes: number = 0;
  seconds: number = 0;

  time: number = 0;
  isRunning: boolean = false;

  calcTime(time: number) {
    this.hours = Math.floor(time / this.Minutes_In_Hours / this.Seconds_In_Minutes);
    this.minutes = Math.floor(time / this.Seconds_In_Minutes) % this.Minutes_In_Hours;
    this.seconds = time % this.Seconds_In_Minutes;
  }

  chrono = timer(0, 1000);
  ngOnInit() {
    this.startChrono()
  }

  public clickStream: any;
  
  startChrono() {
    this.isRunning = true;
    this.subscription = this.chrono.subscribe(() => {
      if(this.isRunning) {
        this.time++;
        this.calcTime(this.time);
      }
    })
  }

  stopChrono() {
    this.isRunning = false;
    this.time = 0;
    this.calcTime(this.time);
    this.subscription.unsubscribe();
  }

  dblCl(event: any) {
    this.clickStream = fromEvent(event.target, 'click');
    const doubleClick = this.clickStream.pipe(
      bufferTime(this.Double_Click),
      map((arr: any) => arr.length),
      filter((num :any) => num === 2)
    );
    
    const oneClick = this.clickStream.pipe(
      bufferTime(500),
      map((arr: any) => arr.length),
      filter((num :any) => num === 1)
    );

    doubleClick.subscribe(() => {
      this.pauseChrono();
      console.log('aga');
      
    })

    oneClick.subscribe(() => {
      console.log('one click');
      
    })
  }
  pauseChrono() {
    this.isRunning = false;
    this.subscription.unsubscribe();
  }

  reset() {
    this.subscription.unsubscribe();
    this.time = 0;
    this.startChrono();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
