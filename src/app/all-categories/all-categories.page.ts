import { Component, OnInit } from '@angular/core';
import { SendReceiveRequestsService } from '../providers/send-receive-requests.service';
import { LoadingController } from '@ionic/angular';
import { NavigationExtras } from '@angular/router';
@Component({
  selector: 'app-all-categories',
  templateUrl: './all-categories.page.html',
  styleUrls: ['./all-categories.page.scss'],
})

export class AllCategoriesPage implements OnInit 
{
  public ResultData:any = [];
  public queryString: any=[];
  constructor(private SendReceiveRequestsService : SendReceiveRequestsService, private LoadingCtrl : LoadingController)
  { }

  ngOnInit()
  { }

  async ionViewWillEnter()
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

  SelectedOption(CategoryType:any,CategoryID:any)
  {
    //console.log(CategoryType,CategoryID);    
    this.queryString = 
    {
      category_type:CategoryType,
      category_id:CategoryID,
    };
    let navigationExtras: NavigationExtras = 
    {
      queryParams: 
      {
        special: JSON.stringify(this.queryString)
      }
    };
    this.SendReceiveRequestsService.router.navigate(['/all-locations'],{queryParams: this.queryString});
  }
}
