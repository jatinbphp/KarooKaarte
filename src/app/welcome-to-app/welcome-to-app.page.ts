import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';
@Component({
  selector: 'app-welcome-to-app',
  templateUrl: './welcome-to-app.page.html',
  styleUrls: ['./welcome-to-app.page.scss'],
})

export class WelcomeToAppPage implements OnInit 
{
  @ViewChild('WelcomeSlider', { static: false }) WelcomeSlider ?  : IonSlides;
  public WelcomeSliderOptions = 
	{
    slidesPerView: 1.5,
    autoplay: false,
    speed: 1000
  };
  constructor()
  { }

  ngOnInit()
  { 
    let ObjectWelcome = {introduced:1};
    localStorage.setItem("app_welcome",JSON.stringify(ObjectWelcome));    
  }
}
