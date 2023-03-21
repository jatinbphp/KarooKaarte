import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { SendReceiveRequestsService } from '../providers/send-receive-requests.service';
import { Platform, LoadingController } from '@ionic/angular';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@awesome-cordova-plugins/native-geocoder/ngx';
import { LocationAccuracy } from '@awesome-cordova-plugins/location-accuracy/ngx';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { Subject } from 'rxjs';
import { ActivatedRoute, Router } from "@angular/router";
declare var google: any;
@Component({
  selector: 'app-all-locations',
  templateUrl: './all-locations.page.html',
  styleUrls: ['./all-locations.page.scss'],
})

export class AllLocationsPage implements OnInit 
{
  @ViewChild('MAP', { static: false }) mapElement?: ElementRef; 
  public LocationSubscription:any=null; 
  public DefaultLatitude: number = -33.6229684;//DEFAULT LOCATION OF Oudtshoorn
  public DefaultLongitude: number = 22.1545885;//DEFAULT LOCATION OF Oudtshoorn
  public DraggedLatitude: number = 0;
  public DraggedLongitude: number = 0;
  /*
  public LocationsJSONAll = [
    {'name':'Bondi Beach','lat':-33.890542,'lon':151.274856,'id':4},
    {'name':'Coogee Beach','lat':-33.923036,'lon':151.259052,'id':5},
    {'name':'Cronulla Beach','lat':-34.028249,'lon':151.157507,'id':3},
    {'name':'Manly Beach','lat':-33.80010128657071,'lon':151.28747820854187,'id':2},
    {'name':'Maroubra Beach','lat':-33.950198,'lon':151.259302,'id':1}
  ];
  */
  public LocationsJSONAll:any=[];
  public ResultDataAllLocationsResponse:any=[];
  public ResultDataAllLocations:any=[];
  /*
  public LocationsJSONLive = [
    {'name':'Bondi Beach','lat':-33.890542,'lon':151.274856,'id':4},
    {'name':'Coogee Beach','lat':-33.923036,'lon':151.259052,'id':5},
    {'name':'Cronulla Beach','lat':-34.028249,'lon':151.157507,'id':3},
    {'name':'Manly Beach','lat':-33.80010128657071,'lon':151.28747820854187,'id':2},
    {'name':'Maroubra Beach','lat':-33.950198,'lon':151.259302,'id':1}
  ];
  */
  public LocationsJSONLive:any=[];
  public ResultDataLiveLocationsResponse:any=[];
  public ResultDataLiveLocations:any=[];
  public IDSelected:any=null;
  public WhatToSee:any=null;
  public LocationCordinates: any = [];
  public Timestamp: any;  
  public NumberOfLocations: number = 0;
  private _Location = new Subject<any>();
  public mapLive:any = google.map;
  public MapToWatch:any=[];
  public CategoryID:any=0;
  public CategoryTP:any=null;
  public queryStringData: any=[];
  constructor(private SendReceiveRequestsService : SendReceiveRequestsService, private zone: NgZone, private AndroidPermissions: AndroidPermissions, private Geolocation: Geolocation, private NativeGeocoder: NativeGeocoder, private Platform: Platform, private LocationAccuracy: LocationAccuracy, private LoadingCtrl : LoadingController, private route: ActivatedRoute, private router: Router)
  { }  

  ngOnInit()
  { }
  
  async ionViewWillEnter()
  {
    this.route.queryParams.subscribe(params => 
    {      
      if(params.hasOwnProperty('category_id'))
      {
        this.CategoryID = params['category_id'];
      }
      if(params.hasOwnProperty('category_type'))
      {
        this.CategoryTP = params['category_type'];//THIS WILL ONLY USED FOR LIVE OPTION
      }
    });    
    this.MapToWatch = (localStorage.getItem('map_to_watch')) ? localStorage.getItem('map_to_watch') : [];
    if(this.MapToWatch.length > 0)
    {
      this.MapToWatch = JSON.parse(this.MapToWatch);
      if(this.MapToWatch.hasOwnProperty('selected_type') == true)
      {
        if(this.MapToWatch['selected_type'] == "all")
        {
          this.SelectedOption("all");  
        }
        if(this.MapToWatch['selected_type'] == "live")
        {          
          //this.SelectedOption("live");          
          console.log("ionViewWillEnter");
          await this.ShowLiveLocations();
        }
      }
      else 
      {
        this.SelectedOption("all");
      }
    }
    else 
    {
      this.SelectedOption("all");
    }
    this.LocationCordinates = {latitude: "",longitude: "",accuracy: "",timestamp: ""};    
    localStorage.removeItem('selected_options');
  }

  async ShowAllLocations()
  {
    let DataAllLocations = {CategoryID:this.CategoryID,categoryTP:this.CategoryTP}
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
        this.LocationsJSONAll = this.ResultDataAllLocations;        
        this.NumberOfLocations = this.LocationsJSONAll.length;
        /*
        SELF CENTER STARTS
        */
        var stylers = [
          {
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#212121"
              }
            ]
          },
          {
            "elementType": "labels.icon",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#757575"
              }
            ]
          },
          {
            "elementType": "labels.text.stroke",
            "stylers": [
              {
                "color": "#212121"
              }
            ]
          },
          {
            "featureType": "administrative",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#757575"
              }
            ]
          },
          {
            "featureType": "administrative.country",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#9e9e9e"
              }
            ]
          },
          {
            "featureType": "administrative.locality",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#bdbdbd"
              }
            ]
          },
          {
            "featureType": "poi",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#757575"
              }
            ]
          },
          {
            "featureType": "poi.park",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#181818"
              }
            ]
          },
          {
            "featureType": "poi.park",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#616161"
              }
            ]
          },
          {
            "featureType": "poi.park",
            "elementType": "labels.text.stroke",
            "stylers": [
              {
                "color": "#1b1b1b"
              }
            ]
          },
          {
            "featureType": "road",
            "elementType": "geometry.fill",
            "stylers": [
              {
                "color": "#2c2c2c"
              }
            ]
          },
          {
            "featureType": "road",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#8a8a8a"
              }
            ]
          },
          {
            "featureType": "road.arterial",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#373737"
              }
            ]
          },
          {
            "featureType": "road.highway",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#3c3c3c"
              }
            ]
          },
          {
            "featureType": "road.highway.controlled_access",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#4e4e4e"
              }
            ]
          },
          {
            "featureType": "road.local",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#616161"
              }
            ]
          },
          {
            "featureType": "transit",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#757575"
              }
            ]
          },
          {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#000000"
              }
            ]
          },
          {
            "featureType": "water",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#3d3d3d"
              }
            ]
          }
        ];    
        let map = new google.maps.Map(document.getElementById('MAP'), {
          zoom: 8,
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
          styles: stylers
        });
        if(this.LocationsJSONAll.length > 0)
        {
          let bounds = new google.maps.LatLngBounds();
          let infowindow = new google.maps.InfoWindow();
          var marker, i;
          let ClassObj = this;
          let image = 
          {
            url: './assets/images/app-pin.png', // image is 512 x 512
            scaledSize: new google.maps.Size(50, 50),
          };
          for (i = 0; i < this.LocationsJSONAll.length; i++) 
          {  
            
            marker = new google.maps.Marker({
              position: new google.maps.LatLng(this.LocationsJSONAll[i]['lat'], this.LocationsJSONAll[i]['lon']),
              map: map,
              icon: image
            });

            bounds.extend(marker.position);
            
            let InfoWindowContent = '';
            InfoWindowContent += '<ion-grid>';
            InfoWindowContent += '<ion-row>';
              InfoWindowContent += '<ion-col size="12">';
                InfoWindowContent += '<ion-label class="location-name">'+this.LocationsJSONAll[i]['name']+'</ion-label>';
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
                //infowindow.setContent(ClassObj.LocationsJSONAll[i]['name']);
                infowindow.setContent(InfoWindowContent);
                infowindow.open(map, marker);
              }
            })(marker, i));     
            
            google.maps.event.addListener(infowindow, 'domready', (function (i) 
            {
              return function() 
              {
                const EVPhotos = document.querySelector('#Photos-'+i);
                EVPhotos?.addEventListener('click', (event) => ClassObj.RedirectTo(ClassObj.LocationsJSONAll[i]['id'],"Photos"));

                const EVVideos = document.querySelector('#Videos-'+i);
                EVVideos?.addEventListener('click', (event) => ClassObj.RedirectTo(ClassObj.LocationsJSONAll[i]['id'],"Videos"));

                const EVVoices = document.querySelector('#Voices-'+i);
                EVVoices?.addEventListener('click', (event) => ClassObj.RedirectTo(ClassObj.LocationsJSONAll[i]['id'],"Voices"));

                const EVTexts = document.querySelector('#Texts-'+i);
                EVTexts?.addEventListener('click', (event) => ClassObj.RedirectTo(ClassObj.LocationsJSONAll[i]['id'],"Texts"));

                const EVDetails = document.querySelector('#Details-'+i);
                EVDetails?.addEventListener('click', (event) => ClassObj.RedirectTo(ClassObj.LocationsJSONAll[i]['id'],"Details"));
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
        }
        else 
        {
          this.SendReceiveRequestsService.showMessageToast("No PIN's available.");
        }
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
      this.WatchContinuesPosition();
    }).catch((error) => 
    {
      this.SendReceiveRequestsService.showMessageToast("You have disallowed location service.");
      this.ShowAllLocations();
      //alert('4-Error: ' + error);
    });    
  }

  async WatchContinuesPosition()
  {
    let WatchOptions = {
      frequency : 30000,
      timeout : 30000,
      enableHighAccuracy: false // may cause errors if true
    };
    this.LocationSubscription = this.Geolocation.watchPosition(WatchOptions);
    this.LocationSubscription.subscribe(<GeolocationPosition>(position:any) => 
    {
      this._Location.next(position);
      this.LocationCordinates.latitude = position.coords.latitude;
      this.LocationCordinates.longitude = position.coords.longitude;
      this.LocationCordinates.accuracy = position.coords.accuracy;
      this.LocationCordinates.timestamp = position.timestamp;      
      this.AddDynamicMarkers();
      //console.log("Watch",this.LocationCordinates);      
    });
    /*
    this.Geolocation.watchPosition().subscribe(<GeolocationPosition>(position:any) => 
    {
      this._Location.next(position);
      this.LocationCordinates.latitude = position.coords.latitude;
      this.LocationCordinates.longitude = position.coords.longitude;
      this.LocationCordinates.accuracy = position.coords.accuracy;
      this.LocationCordinates.timestamp = position.timestamp;
      this.AddDynamicMarkers(map);
      //console.log("Watch",this.LocationCordinates);      
    },(err) => 
    {
      console.log(err);
    });
    */
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
    let MapToWatch = {'selected_type':'live'}
    localStorage.setItem('map_to_watch',JSON.stringify(MapToWatch));
    console.log("ShowLiveLocations");
    this.mapLive = new google.maps.Map(document.getElementById('MAP'), {
      zoom: 8,
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
    /* 
    var map = new google.maps.Map(document.getElementById('MAP'), {
      zoom: 8,
      //center: new google.maps.LatLng(this.DefaultLatitude, this.DefaultLongitude),
      center: new google.maps.LatLng(this.DefaultLatitude, this.DefaultLongitude),
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
    */
  }

  async AddDynamicMarkers()
  {
    //this.SendReceiveRequestsService.showMessageToast(this.LocationCordinates.latitude+"@"+this.LocationCordinates.longitude);
    /*
    var marker, i;
    let image = 
    {
      url: './assets/images/logoIcon-marker-50by50.png', // image is 512 x 512
      scaledSize: new google.maps.Size(50, 50),
    };
    //-33.6229684,22.1545885[DUMMY]
    //var LatLng = new google.maps.LatLng(-33.6229684,22.1545885);
    var LatLng = new google.maps.LatLng(this.LocationCordinates.latitude,this.LocationCordinates.longitude);
    let MarkerCenter = new google.maps.Marker({
      position: LatLng,
      map: this.mapLive,
      title: 'Drag Me!',
      draggable: false,
      icon: image
    });
    marker = google.maps.event.addListener(MarkerCenter, 'dragend', function(MarkerCenter:any)
    {
      let latLng = MarkerCenter.latLng;
      let Latitude = latLng.lat();
      let Longitude = latLng.lng();
      //console.log(Latitude,Longitude);
    });
    */
    //DYNAMIC MARKER SOUROUNING LOCATION STARTS
    //LOADER
		/*
    const loading = await this.LoadingCtrl.create({
			spinner: null,
			message: 'Just a moment please...',
			translucent: true,
			cssClass: 'custom-class custom-loading'
		});
		await loading.present();
    */
		//LOADER
    let DataLiveLocations = 
    {
      latitude:this.LocationCordinates.latitude,
      longitude:this.LocationCordinates.longitude,
      category_id:this.CategoryID,
      category_type:this.CategoryTP
    }
    await this.SendReceiveRequestsService.GetLocationsLive(DataLiveLocations).then((result:any) => 
    {
		  //loading.dismiss();//DISMISS LOADER
      this.ResultDataLiveLocationsResponse = result;
      if(this.ResultDataLiveLocationsResponse['status'] == true)
      {
        this.ResultDataLiveLocations = this.ResultDataLiveLocationsResponse['data'];
        this.LocationsJSONLive = this.ResultDataLiveLocations;        
        this.NumberOfLocations = this.LocationsJSONLive.length;
        /*
        SELF CENTER STARTS
        */            
        if(this.LocationsJSONLive.length > 0)
        {
          let bounds = new google.maps.LatLngBounds();
          let infowindow = new google.maps.InfoWindow();
          var marker, i;
          let ClassObj = this;
          let image = 
          {
            url: './assets/images/app-pin.png', // image is 512 x 512
            scaledSize: new google.maps.Size(50, 50),
          };
          for (i = 0; i < this.LocationsJSONLive.length; i++) 
          {  
            console.log("HERE");
            marker = new google.maps.Marker({
              position: new google.maps.LatLng(this.LocationsJSONLive[i]['lat'], this.LocationsJSONLive[i]['lon']),
              map: this.mapLive,
              icon: image
            });
            
            bounds.extend(marker.position);
            
            let InfoWindowContent = '';
            InfoWindowContent += '<ion-grid>';
            InfoWindowContent += '<ion-row>';
              InfoWindowContent += '<ion-col size="12">';
                InfoWindowContent += '<ion-label class="location-name">'+this.LocationsJSONLive[i]['name']+'</ion-label>';
              InfoWindowContent += '</ion-col>';        
            InfoWindowContent += '</ion-row>';
            InfoWindowContent += '<ion-row>';
              InfoWindowContent += '<ion-col size="12">';
                InfoWindowContent += '<ion-button color="primary" id="Details-'+i+'" shape="round" size="full">Detail</ion-button>';
              InfoWindowContent += '</ion-col>';            
            InfoWindowContent += '</ion-row>';
            InfoWindowContent += '</ion-grid>';
            
            google.maps.event.addListener(marker, 'click', (function(marker, i) 
            {
              return function() 
              {
                //infowindow.setContent(ClassObj.LocationsJSONLive[i]['name']);
                infowindow.setContent(InfoWindowContent);
                infowindow.open(ClassObj.mapLive, marker);
              }
            })(marker, i));
            
            google.maps.event.addListener(infowindow, 'domready', (function (i) 
            {
              return function() 
              {
                const EVPhotos = document.querySelector('#Photos-'+i);
                EVPhotos?.addEventListener('click', (event) => ClassObj.RedirectTo(ClassObj.LocationsJSONLive[i]['id'],"Photos"));

                const EVVideos = document.querySelector('#Videos-'+i);
                EVVideos?.addEventListener('click', (event) => ClassObj.RedirectTo(ClassObj.LocationsJSONLive[i]['id'],"Videos"));

                const EVVoices = document.querySelector('#Voices-'+i);
                EVVoices?.addEventListener('click', (event) => ClassObj.RedirectTo(ClassObj.LocationsJSONLive[i]['id'],"Voices"));

                const EVTexts = document.querySelector('#Texts-'+i);
                EVTexts?.addEventListener('click', (event) => ClassObj.RedirectTo(ClassObj.LocationsJSONLive[i]['id'],"Texts"));

                const EVDetails = document.querySelector('#Details-'+i);
                EVDetails?.addEventListener('click', (event) => ClassObj.RedirectTo(ClassObj.LocationsJSONLive[i]['id'],"Details"));
              }
            })(i));
          }
          this.mapLive.fitBounds(bounds);
        }
        else 
        {
          //this.SendReceiveRequestsService.showMessageToast("No PIN's available.");
        }
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
      //loading.dismiss();//DISMISS LOADER
      this.SendReceiveRequestsService.showMessageToast(error);
    });
    //DYNAMIC MARKER SOUROUNING LOCATION ENDS
  }

  RedirectTo(IDSelected:any,WhatToSee:any)
  {
    this.IDSelected = IDSelected;
    this.WhatToSee = WhatToSee;
    let ObjOptionSelected = { id : this.IDSelected, what_to_see : this.WhatToSee }
    localStorage.setItem('selected_options',JSON.stringify(ObjOptionSelected));
    //console.log("HEEE",this.IDSelected+"@"+this.WhatToSee);
    this.SendReceiveRequestsService.router.navigate(['/location-in-detail']);    
  }

  async SelectedOption(SelectedOption:any)
  {
    if(SelectedOption == "all")
    {
      let MapToWatch = {'selected_type':'all'}
      localStorage.setItem('map_to_watch',JSON.stringify(MapToWatch));      
      this.ShowAllLocations();
    }
    if(SelectedOption == "live")
    {
      await this.ShowLiveLocations();
    }
  }  
  
  ResetSearch()
  {
    this.CategoryID = 0;
    this.CategoryTP = null;    
    this.SendReceiveRequestsService.router.navigate(['/all-locations']).then(result => 
    {
      this.ionViewWillEnter();
    });
  }

  ionViewDidLeave()
  {
    //this._Location.unsubscribe();
  }
}
