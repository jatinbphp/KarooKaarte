import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';
@Component({  
  selector: 'app-location-in-detail',
  templateUrl: './location-in-detail.page.html',
  styleUrls: ['./location-in-detail.page.scss'],
})

export class LocationInDetailPage implements OnInit 
{
  @ViewChild('PhotoSlider', { static: false }) PhotoSlider ?  : IonSlides;
  @ViewChild('VideoSlider', { static: false }) VideoSlider ?  : IonSlides;
  @ViewChild('AudioSlider', { static: false }) AudioSlider ?  : IonSlides;
	public PhotoSliderOptions = 
	{
    slidesPerView: 1.5,
    autoplay: false,
    speed: 1000
  };
  public VideoSliderOptions = 
	{
    slidesPerView: 1.5,
    autoplay: false,
    speed: 1000
  };
  public AudioSliderOptions = 
	{
    slidesPerView: 1.5,
    autoplay: false,
    speed: 1000
  };
  constructor()
  { }

  ngOnInit()
  { }  
}
