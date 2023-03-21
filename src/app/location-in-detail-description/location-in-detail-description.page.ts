import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { LoadingController, ModalController, NavParams } from '@ionic/angular';
import { SendReceiveRequestsService } from '../providers/send-receive-requests.service';

@Component({
  selector: 'app-location-in-detail-description',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './location-in-detail-description.page.html',
  styleUrls: ['./location-in-detail-description.page.scss'],
})

export class LocationInDetailDescriptionPage implements OnInit 
{
  public Language:any='';
  public ID:any='';
  public ResultDataResponse:any=[];
  public ResultData:any=[];
  public ResultDataForEnglish:any=[];
  public ResultDataForAfrikaans:any=[];
  public ResultDataForXhosa:any=[];
  public CategoryNM:any=null;
  public CategorySNM:any=null;
  constructor(private SendReceiveRequestsService : SendReceiveRequestsService, private LoadingCtrl: LoadingController, private ModalCtrl: ModalController, private NavParams: NavParams)
  { }

  ngOnInit()
  { }

  async ionViewWillEnter()
  {
    this.Language=this.NavParams.get('language');
    this.ID=this.NavParams.get('id');
    //LOADER
		const loading = await this.LoadingCtrl.create({
			spinner: null,
			message: 'Just a moment please...',
			translucent: true,
			cssClass: 'custom-class custom-loading'
		});
		await loading.present();
		//LOADER
    let DataAllDetails = {id:this.ID}
    await this.SendReceiveRequestsService.GetLocationDetail(DataAllDetails).then((result:any) => 
    {
      loading.dismiss();//DISMISS LOADER
      this.ResultDataResponse = result;
      if(this.ResultDataResponse['status'] == true)
      {
        this.ResultData = this.ResultDataResponse['data'];
        this.CategoryNM = this.ResultData['category']['category_name'];
        this.CategorySNM = this.ResultData['sub_category']['subcategory_name'];

        this.ResultDataForEnglish = this.ResultData['english'];
        this.ResultDataForAfrikaans = this.ResultData['Afrikaans'];
        this.ResultDataForXhosa = this.ResultData['xhosa'];
      }
      console.log(this.ResultData);
    },
    (error:any) => 
    {
      loading.dismiss();//DISMISS LOADER
      this.SendReceiveRequestsService.showMessageToast(error);
    });
  }

  DismissModal()
	{
		this.ModalCtrl.dismiss({
			'dismissed': true
		});
  }
}
