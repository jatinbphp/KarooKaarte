import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { IonSlides, LoadingController } from '@ionic/angular';
import { SendReceiveRequestsService } from '../providers/send-receive-requests.service';
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
  constructor(private SendReceiveRequestsService : SendReceiveRequestsService, private LoadingCtrl : LoadingController)
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
      if(this.ResultDataResponse['status']=="true")
      {
        this.ResultData = this.ResultDataResponse['data'];
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
}
