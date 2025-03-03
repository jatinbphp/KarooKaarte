import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { IonSlides, LoadingController } from '@ionic/angular';
import { SendReceiveRequestsService } from '../providers/send-receive-requests.service';
import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';

@Component({
  selector: 'app-welcome-to-app',
  encapsulation: ViewEncapsulation.None,
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
  public ResultDataResponse:any=[];
  public ResultData:any=[];
  public ResultDataImages:any=[];
  constructor(private SendReceiveRequestsService : SendReceiveRequestsService, private LoadingCtrl : LoadingController, private StatusBar: StatusBar)
  { }

  async ngOnInit()
  { 
    //LOADER
		const loading = await this.LoadingCtrl.create({
			spinner: null,
			message: 'Just a moment please...',
			translucent: true,
			cssClass: 'custom-class custom-loading'
		});
		await loading.present();
		//LOADER
    await this.SendReceiveRequestsService.GetWelcomeText().then((result:any) => 
    {
      loading.dismiss();//DISMISS LOADER
      this.ResultDataResponse = result;
      let ObjDefaultLatLng = 
      {
        lat:(this.ResultDataResponse.hasOwnProperty('lat')==true) ? this.ResultDataResponse['lat'] : -33.600733,
        lng:(this.ResultDataResponse.hasOwnProperty('lon')==true) ? this.ResultDataResponse['lon'] : 22.224845,
      }
      localStorage.setItem('all_location_default',JSON.stringify(ObjDefaultLatLng));
      if(this.ResultDataResponse['status']=="true")
      {
        this.ResultData = this.ResultDataResponse['data'];
        this.ResultDataImages = this.ResultData['images'];
        let ObjectContact = {phone:this.ResultData['phone_number'],email:this.ResultData['email']}
        localStorage.setItem('contact_information',JSON.stringify(ObjectContact));
      }
      console.log(this.ResultData);
    },
    (error:any) => 
    {
      loading.dismiss();//DISMISS LOADER
      this.SendReceiveRequestsService.showMessageToast(error);
    });
    let ObjectWelcome = {introduced:1};
    //localStorage.setItem("app_welcome",JSON.stringify(ObjectWelcome));ENABLE THIS LINE IF WELCOME SCREEN NEEDED TO BE SHOW ONLY ONCE
  }

  ionViewWillEnter()
  {
    this.StatusBar.backgroundColorByHexString('#FFFFFF');//BEFORE::e6e6e6/BEFORE::F6F4F8
  }

}
