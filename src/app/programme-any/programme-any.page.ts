import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { SendReceiveRequestsService } from '../providers/send-receive-requests.service';

@Component({
  selector: 'app-programme-any',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './programme-any.page.html',
  styleUrls: ['./programme-any.page.scss'],
})

export class ProgrammeAnyPage implements OnInit 
{
  public ResultDataResponse:any=[];
  public ResultData:any=[];
  constructor(private SendReceiveRequestsService : SendReceiveRequestsService, private LoadingCtrl: LoadingController)
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

}
