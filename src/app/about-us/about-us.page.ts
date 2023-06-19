import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { SendReceiveRequestsService } from '../providers/send-receive-requests.service';
import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';

@Component({
  selector: 'app-about-us',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './about-us.page.html',
  styleUrls: ['./about-us.page.scss'],
})
export class AboutUsPage implements OnInit 
{
  public ResultDataResponse:any=[];
  public ResultData:any=[];
  constructor(private SendReceiveRequestsService : SendReceiveRequestsService, private LoadingCtrl: LoadingController, private StatusBar: StatusBar)
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
      }
      console.log(this.ResultData);
    },
    (error:any) => 
    {
      loading.dismiss();//DISMISS LOADER
      this.SendReceiveRequestsService.showMessageToast(error);
    });
  }

  ionViewWillEnter()
  {
    this.StatusBar.backgroundColorByHexString('#FFFFFF');//BEFORE::e6e6e6/BEFORE::000000
  }
}
