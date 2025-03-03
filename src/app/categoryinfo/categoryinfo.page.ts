import { Component, OnInit } from '@angular/core';
import { SendReceiveRequestsService } from '../providers/send-receive-requests.service';
import { LoadingController, ModalController } from '@ionic/angular';
import { NavigationExtras } from '@angular/router';
import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';

@Component({
  selector: 'app-categoryinfo',
  templateUrl: './categoryinfo.page.html',
  styleUrls: ['./categoryinfo.page.scss'],
})
export class CategoryinfoPage implements OnInit 
{
  public ResultData:any = [];
  public queryString: any=[];
  
  constructor(private SendReceiveRequestsService : SendReceiveRequestsService, private LoadingCtrl : LoadingController, private StatusBar: StatusBar, public modalCtrl: ModalController) 
  { }

  ngOnInit() 
  { }

  async ionViewWillEnter()
  { 
    this.StatusBar.backgroundColorByHexString('#FFFFFF');//BEFORE::e6e6e6/BEFORE::000000
    //LOADER
		const loading = await this.LoadingCtrl.create({
			spinner: null,
			message: 'Just a moment please...',
			translucent: true,
			cssClass: 'custom-class custom-loading'
		});
		await loading.present();
		//LOADER
    await this.SendReceiveRequestsService.GetAllCategories().then((result:any) => 
    {
      loading.dismiss();//DISMISS LOADER
      this.ResultData = result;
      console.log(this.ResultData);
    },
    (error:any) => 
    {
      loading.dismiss();//DISMISS LOADER
      this.SendReceiveRequestsService.showMessageToast(error);
    });
  }

  dismissModal()
  {
    this.modalCtrl.dismiss({
			'dismissed': true				
		});
  }
}
