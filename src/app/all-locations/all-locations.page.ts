import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { SendReceiveRequestsService } from '../providers/send-receive-requests.service';
import { Platform, LoadingController } from '@ionic/angular';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@awesome-cordova-plugins/native-geocoder/ngx';
import { LocationAccuracy } from '@awesome-cordova-plugins/location-accuracy/ngx';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';

declare var google: any;
@Component({
  selector: 'app-all-locations',
  templateUrl: './all-locations.page.html',
  styleUrls: ['./all-locations.page.scss'],
})

export class AllLocationsPage implements OnInit 
{
  @ViewChild('MAP', { static: false }) mapElement?: ElementRef;  
  public DefaultLatitude: number = -33.92;
  public DefaultLongitude: number = 151.25;  
  public DraggedLatitude: number = 0;
  public DraggedLongitude: number = 0;
  public LocationsJSON = [
    {'name':'Bondi Beach','lat':-33.890542,'lon':151.274856,'id':4},
    {'name':'Coogee Beach','lat':-33.923036,'lon':151.259052,'id':5},
    {'name':'Cronulla Beach','lat':-34.028249,'lon':151.157507,'id':3},
    {'name':'Manly Beach','lat':-33.80010128657071,'lon':151.28747820854187,'id':2},
    {'name':'Maroubra Beach','lat':-33.950198,'lon':151.259302,'id':1}
  ];
  public CategoryID:number = 0;
  public ResultDataAllLocationsResponse:any=[];
  public ResultDataAllLocations:any=[];
  public IDSelected:any=null;
  public WhatToSee:any=null;
  public LocationCordinates: any = [];
  public LocationCordinatesWatch: any = [];
  public Timestamp: any;  
  public NumberOfLocations: number = 0;
  constructor(private SendReceiveRequestsService : SendReceiveRequestsService, private zone: NgZone, private AndroidPermissions: AndroidPermissions, private Geolocation: Geolocation, private NativeGeocoder: NativeGeocoder, private Platform: Platform, private LocationAccuracy: LocationAccuracy, private LoadingCtrl : LoadingController)
  { }  

  ngOnInit()
  { 
    this.ShowAllLocations();
    this.LocationCordinates = {latitude: "",longitude: "",accuracy: "",timestamp: ""};
    this.LocationCordinatesWatch = {latitude: "",longitude: "",accuracy: "",timestamp: ""};
  }
  
  ionViewWillEnter()
  {
    localStorage.removeItem('selected_options');
  }

  async ShowAllLocations()
  {
    let DataAllLocations = {CategoryID:this.CategoryID}
    //LOADER
		const loading = await this.LoadingCtrl.create({
			spinner: null,
			message: 'Just a moment please...',
			translucent: true,
			cssClass: 'custom-class custom-loading'
		});
		await loading.present();
		//LOADER
    await this.SendReceiveRequestsService.GetLocationsAll(DataAllLocations).then((result:any) => 
    {
      loading.dismiss();//DISMISS LOADER
      this.ResultDataAllLocationsResponse = result;      
      if(this.ResultDataAllLocationsResponse['status'] == "true")
      {
        this.ResultDataAllLocations = this.ResultDataAllLocationsResponse['data'];
        this.LocationsJSON = this.ResultDataAllLocations;        
        this.NumberOfLocations = this.LocationsJSON.length;
        /*
        SELF CENTER STARTS
        */    
        let map = new google.maps.Map(document.getElementById('MAP'), {
          zoom: 12,
          center: new google.maps.LatLng(this.DefaultLatitude, this.DefaultLongitude),
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          draggable: true,//THIS WILL NOW ALLOW MAP TO DRAG
          mapTypeControl: false,
          mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: google.maps.ControlPosition.TOP_CENTER,
          },
          zoomControl: true,//THIS WILL REMOVE THE ZOOM OPTION +/-
          zoomControlOptions: {
            position: google.maps.ControlPosition.RIGHT_BOTTOM,
          },
          scaleControl: false,
          streetViewControl: false,
          streetViewControlOptions: {
            position: google.maps.ControlPosition.LEFT_TOP,
          },
          fullscreenControl: false,
        });
        let bounds = new google.maps.LatLngBounds();
        let infowindow = new google.maps.InfoWindow();
        var marker, i;
        let ClassObj = this;
        let image = 
        {
          url: './assets/images/marker-50by50.png', // image is 512 x 512
          scaledSize: new google.maps.Size(50, 50),
        };
        for (i = 0; i < this.LocationsJSON.length; i++) 
        {  
          
          marker = new google.maps.Marker({
            position: new google.maps.LatLng(this.LocationsJSON[i]['lat'], this.LocationsJSON[i]['lon']),
            map: map,
            icon: image
          });

          bounds.extend(marker.position);
          
          let InfoWindowContent = '';
          InfoWindowContent += '<ion-grid>';
          InfoWindowContent += '<ion-row>';
            InfoWindowContent += '<ion-col size="12">';
              InfoWindowContent += '<ion-label class="location-name">'+this.LocationsJSON[i]['name']+'</ion-label>';
            InfoWindowContent += '</ion-col>';        
          InfoWindowContent += '</ion-row>';
          InfoWindowContent += '<ion-row>';
            InfoWindowContent += '<ion-col size="12">';
              InfoWindowContent += '<ion-button color="primary" id="Details-'+i+'" shape="round" size="full">Detail</ion-button>';
            InfoWindowContent += '</ion-col>';            
          InfoWindowContent += '</ion-row>';
          InfoWindowContent += '</ion-grid>';
          /*
          InfoWindowContent += '<ion-grid>';
          InfoWindowContent += '<ion-row>';
            InfoWindowContent += '<ion-col size="6">';
              InfoWindowContent += '<ion-button color="primary" id="Photos-'+i+'" shape="round" size="full">Photos</ion-button>';
            InfoWindowContent += '</ion-col>';
            InfoWindowContent += '<ion-col size="6">';
              InfoWindowContent += '<ion-button color="primary" id="Videos-'+i+'" shape="round" size="full">Videos</ion-button>';
            InfoWindowContent += '</ion-col>';  
          InfoWindowContent += '</ion-row>';
          InfoWindowContent += '<ion-row>';
            InfoWindowContent += '<ion-col size="6">';
              InfoWindowContent += '<ion-button color="primary" id="Voices-'+i+'" shape="round" size="full">Voices</ion-button>';
            InfoWindowContent += '</ion-col>';  
            InfoWindowContent += '<ion-col size="6">';
              InfoWindowContent += '<ion-button color="primary" id="Texts-'+i+'" shape="round" size="full">Texts</ion-button>';
            InfoWindowContent += '</ion-col>';  
          InfoWindowContent += '</ion-row>';
          InfoWindowContent += '</ion-grid>';
          */
          google.maps.event.addListener(marker, 'click', (function(marker, i) 
          {
            return function() 
            {
              //infowindow.setContent(ClassObj.LocationsJSON[i]['name']);
              infowindow.setContent(InfoWindowContent);
              infowindow.open(map, marker);
            }
          })(marker, i));     
          
          google.maps.event.addListener(infowindow, 'domready', (function (i) 
          {
            return function() 
            {
              const EVPhotos = document.querySelector('#Photos-'+i);
              EVPhotos?.addEventListener('click', (event) => ClassObj.RedirectTo(ClassObj.LocationsJSON[i]['id'],"Photos"));

              const EVVideos = document.querySelector('#Videos-'+i);
              EVVideos?.addEventListener('click', (event) => ClassObj.RedirectTo(ClassObj.LocationsJSON[i]['id'],"Videos"));

              const EVVoices = document.querySelector('#Voices-'+i);
              EVVoices?.addEventListener('click', (event) => ClassObj.RedirectTo(ClassObj.LocationsJSON[i]['id'],"Voices"));

              const EVTexts = document.querySelector('#Texts-'+i);
              EVTexts?.addEventListener('click', (event) => ClassObj.RedirectTo(ClassObj.LocationsJSON[i]['id'],"Texts"));

              const EVDetails = document.querySelector('#Details-'+i);
              EVDetails?.addEventListener('click', (event) => ClassObj.RedirectTo(ClassObj.LocationsJSON[i]['id'],"Details"));
            }
          })(i));

        }

        map.fitBounds(bounds);
        
        var listener = google.maps.event.addListener(map, "idle", function ()
        {
          map.setZoom(12);
          google.maps.event.removeListener(listener);
        });

        google.maps.event.addListener(map,'dragstart',function()
        {
          map.set('dragging',true);          
        });

        google.maps.event.addListener(map,'dragend',function()
        {
          ClassObj.DraggedLatitude = map.getCenter().lat();
          ClassObj.DraggedLongitude = map.getCenter().lng();
          //console.log(ClassObj.DraggedLatitude,ClassObj.DraggedLongitude);
          map.set('dragging',false);
          google.maps.event.trigger(map,'idle',{});
        });
        /*
        SELF CENTER ENDS
        */
      }
      else 
      {
        this.SendReceiveRequestsService.showMessageToast("No records were found.");
      }
    },
    (error:any) => 
    {
      loading.dismiss();//DISMISS LOADER
      this.SendReceiveRequestsService.showMessageToast(error);
    });
    //console.log("ALL",this.ResultDataAllLocations);
    /*
    THIS WILL PUT A MARKER ON DEFAULT CENTER AND GET LAT,LON AS WE MOVE IT
    */
    /*
    let image = 
    {
      url: './assets/images/mike-marker-icon-50-by-50.png', // image is 512 x 512
      scaledSize: new google.maps.Size(50, 50),
    };
    var LatLng = new google.maps.LatLng(this.DefaultLatitude, this.DefaultLongitude);
    let MarkerCenter = new google.maps.Marker({
      position: LatLng,
      map: map,
      title: 'Drag Me!',
      draggable: true,
      icon: image
    });
    google.maps.event.addListener(MarkerCenter, 'dragend', function(MarkerCenter:any)
    {
      let latLng = MarkerCenter.latLng;
      let Latitude = latLng.lat();
      let Longitude = latLng.lng();
      console.log(Latitude,Longitude);
    });
    */
    /*
    THIS WILL PUT A MARKER ON DEFAULT CENTER AND GET LAT,LON AS WE MOVE IT
    */ 
  }

  async CheckPermission() 
  {
    await this.AndroidPermissions.checkPermission(this.AndroidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(async (result) => 
    {
      if(result.hasPermission) 
      {
        console.log("CheckPermission-has permission");
        await this.EnableGPS();
      } 
      else 
      {
        console.log("CheckPermission-has no permission");
        await this.LocationAccPermission();
      }
    },error => 
    {
      alert("1"+error);
    });
  }

  async LocationAccPermission() 
  {
    await this.LocationAccuracy.canRequest().then(async (canRequest: boolean) => 
    {
      if (canRequest) 
      {
        console.log("LocationAccPermission can request -1");
        await this.CurrentLocPosition();
      } 
      else 
      {
        console.log("LocationAccPermission can request -2");
        await this.AndroidPermissions.requestPermission(this.AndroidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(async () => 
        {
          await this.EnableGPS();
        },
        error => 
        {
          alert("2"+error)
        });
      }
    });
  }

  async EnableGPS() 
  {
    await this.LocationAccuracy.request(this.LocationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(async () => 
    {
      console.log("EnableGPS - allowed");
      await this.CurrentLocPosition();
    },
    error => 
    {
      console.log("EnableGPS - dis allowed");
      this.SendReceiveRequestsService.showMessageToast("You have disallowed location service.");
      this.ShowAllLocations();
      //alert("3"+JSON.stringify(error));
    });
  }

  async CurrentLocPosition() 
  {
    await this.Geolocation.getCurrentPosition().then(async (response) => 
    {
      this.LocationCordinates.latitude = response.coords.latitude;
      this.LocationCordinates.longitude = response.coords.longitude;
      this.LocationCordinates.accuracy = response.coords.accuracy;
      this.LocationCordinates.timestamp = response.timestamp;
    }).catch((error) => 
    {
      this.SendReceiveRequestsService.showMessageToast("You have disallowed location service.");
      this.ShowAllLocations();
      //alert('4-Error: ' + error);
    });    
  }

  async ShowLiveLocations()
  {
    this.Timestamp = Date.now();
    await this.Platform.ready().then(async () => 
    {
      if(this.Platform.is("android") == true)
      {
        await this.CheckPermission();
      }
      else 
      {
        await this.CurrentLocPosition();
      }
    });    
    
    var map = new google.maps.Map(document.getElementById('MAP'), {
      zoom: 12,
      //center: new google.maps.LatLng(this.DefaultLatitude, this.DefaultLongitude),
      center: new google.maps.LatLng(this.LocationCordinates.latitude, this.LocationCordinates.longitude),
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      draggable: true,//THIS WILL NOW ALLOW MAP TO DRAG
      mapTypeControl: false,
      mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
        position: google.maps.ControlPosition.TOP_CENTER,
      },
      zoomControl: false,//THIS WILL REMOVE THE ZOOM OPTION +/-
      zoomControlOptions: {
        position: google.maps.ControlPosition.LEFT_CENTER,
      },
      scaleControl: false,
      streetViewControl: false,
      streetViewControlOptions: {
        position: google.maps.ControlPosition.LEFT_TOP,
      },
      fullscreenControl: false,
    });
    
    let image = 
    {
      url: './assets/images/marker-50by50.png', // image is 512 x 512
      scaledSize: new google.maps.Size(50, 50),
    };
    
    var LatLng = new google.maps.LatLng(this.LocationCordinates.latitude, this.LocationCordinates.longitude);
    let MarkerCenter = new google.maps.Marker({
      position: LatLng,
      map: map,
      title: 'Drag Me!',
      draggable: false,
      icon: image
    });
    google.maps.event.addListener(MarkerCenter, 'dragend', function(MarkerCenter:any)
    {
      let latLng = MarkerCenter.latLng;
      let Latitude = latLng.lat();
      let Longitude = latLng.lng();
      //console.log(Latitude,Longitude);
    });
    
  }

  RedirectTo(IDSelected:any,WhatToSee:any)
  {
    this.IDSelected = IDSelected;
    this.WhatToSee = WhatToSee;
    let ObjOptionSelecte = { id : this.IDSelected, what_to_see : this.WhatToSee }
    localStorage.setItem('selected_options',JSON.stringify(ObjOptionSelecte));
    //console.log("HEEE",this.IDSelected+"@"+this.WhatToSee);
    this.SendReceiveRequestsService.router.navigate(['/location-in-detail']);    
  }

  SelectedOption(SelectedOption:any)
  {
    if(SelectedOption == "all")
    {
      this.ShowAllLocations();      
    }
    if(SelectedOption == "live")
    {
      this.ShowLiveLocations();      
    }
  }
}
