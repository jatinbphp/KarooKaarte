import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { IonSlides, LoadingController, ModalController } from '@ionic/angular';
import { SendReceiveRequestsService } from '../providers/send-receive-requests.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Media, MediaObject } from '@awesome-cordova-plugins/media/ngx';
import { LocationInDetailDescriptionPage } from '../location-in-detail-description/location-in-detail-description.page';
import { PhotoViewer } from '@awesome-cordova-plugins/photo-viewer';
import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';

@Component({  
  selector: 'app-location-in-detail',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './location-in-detail.page.html',
  styleUrls: ['./location-in-detail.page.scss'],
})

export class LocationInDetailPage implements OnInit 
{
  @ViewChild('PhotoSlider', { static: false }) PhotoSlider ?  : IonSlides;
  @ViewChild('VideoSlider', { static: false }) VideoSlider ?  : IonSlides;
  @ViewChild('AudioSlider', { static: false }) AudioSlider ?  : IonSlides;
  public trustedVideoUrl?: SafeResourceUrl;
  private MediaFile: MediaObject | undefined;
  public IsAudioPlayed:boolean=false;
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
  public VideoURL:any=null;
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
  constructor(private SendReceiveRequestsService : SendReceiveRequestsService, private LoadingCtrl : LoadingController, public  sanitizer:DomSanitizer, private media: Media, public ModalCtrl: ModalController, private StatusBar: StatusBar)
  { }

  ngOnInit()
  { }  

  async ionViewWillEnter()
  {
    this.StatusBar.backgroundColorByHexString('#FFFFFF');//BEFORE::e6e6e6/BEFORE::000000
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
        if(this.ResultDataVideos!=null && this.ResultDataVideos!=undefined && this.ResultDataVideos!="")
        {
          console.log("Video",this.ResultDataVideos);
          this.VideoURL = this.ResultDataVideos[0];
          /*CHECKING URL SHOULD INCLUDE EMBED*/
          let SplitURL = this.VideoURL.split("/");
          if(!SplitURL.includes("embed"))
          {
            this.ResultDataVideos = [];
            this.VideoURL = null;
          }        
          /*CHECKING URL SHOULD INCLUDE EMBED*/
        }
        this.trustedVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.VideoURL);
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
  
  async ReadMore()
  {
    const modal = await this.ModalCtrl.create({
      component: LocationInDetailDescriptionPage,
      showBackdrop: false,
			componentProps: 
			{ 
        language: this.Language,
        id:this.StorageData['id']
			}
    });
    return await modal.present();
  }

  PlayAudio(AudioURL:any)
  {
    this.MediaFile = this.media.create(AudioURL);
    this.MediaFile.play();
    this.IsAudioPlayed = true;
    this.ReadMore();
  }

  StopAudio()
  {
    this.MediaFile?.release();
    this.IsAudioPlayed = false;
  }

  EnlargePhoto(URL:any)
  {
    let options = 
    {
      share:false,
      closeButton:true,
      copyToReference:false,
      headers:"",
      piccasoOptions:{}
    }
    PhotoViewer.show(URL,"",options);
  }
  
  ionViewDidLeave()
  {
    this.MediaFile?.release();
    this.IsAudioPlayed = false;
  }
}
