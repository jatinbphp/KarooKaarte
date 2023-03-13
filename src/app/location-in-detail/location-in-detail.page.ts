import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, LoadingController } from '@ionic/angular';
import { SendReceiveRequestsService } from '../providers/send-receive-requests.service';
import { DomSanitizer } from '@angular/platform-browser';

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
  public Language:any="english";
  public CategoryNM:any=null;
  public CategorySNM:any=null;
  public StorageData:any=[];
	public ResultDataResponse:any=[];
  public ResultData:any=[];
  public ResultDataForEnglish:any=[];
  public ResultDataForAfrikaans:any=[];
  public ResultDataForXhosa:any=[];
  public ResultDataImages:any=[];
  public ResultDataVideos:any=[];
  public ResultDataAudios:any=[];
  public PhotoSliderOptions = 
	{
    slidesPerView: 1.5,
    autoplay: false,
    speed: 1000
  };
  public VideoSliderOptions = 
	{
    slidesPerView: 1,
    autoplay: false,
    speed: 1000
  };
  public AudioSliderOptions = 
	{
    slidesPerView: 1.5,
    autoplay: false,
    speed: 1000
  };
  constructor(private SendReceiveRequestsService : SendReceiveRequestsService, private LoadingCtrl : LoadingController, public  sanitizer:DomSanitizer)
  { }

  ngOnInit()
  { }  

  async ionViewWillEnter()
  {
    this.StorageData = (localStorage.getItem('selected_options')) ? localStorage.getItem('selected_options') : [];
    if(this.StorageData.length > 0)
    {
      this.StorageData = JSON.parse(this.StorageData);
    }
    console.log(this.StorageData);
    //LOADER
		const loading = await this.LoadingCtrl.create({
			spinner: null,
			message: 'Just a moment please...',
			translucent: true,
			cssClass: 'custom-class custom-loading'
		});
		await loading.present();
		//LOADER
    let DataAllDetails = {id:this.StorageData['id']}
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
        
        this.ResultDataImages = this.ResultData['images']; 
        this.ResultDataVideos = this.ResultData['videos']; 
        this.ResultDataAudios = this.ResultData['mp3']; 
      }
      console.log(this.ResultData);
    },
    (error:any) => 
    {
      loading.dismiss();//DISMISS LOADER
      this.SendReceiveRequestsService.showMessageToast(error);
    });
  }

  SelectedLanguage(Language:any)
  {
    this.Language = Language.toLowerCase();
    console.log(this.Language);
  }
  
}
