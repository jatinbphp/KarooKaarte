import { Component } from '@angular/core';
import { Platform, AlertController } from '@ionic/angular';
import { Network } from '@awesome-cordova-plugins/network/ngx';
import { BehaviorSubject, Observable } from 'rxjs';
import { SendReceiveRequestsService } from './providers/send-receive-requests.service';
import { Deeplinks } from '@awesome-cordova-plugins/deeplinks/ngx';
import { InAppBrowser, InAppBrowserOptions } from '@awesome-cordova-plugins/in-app-browser';

export enum ConnectionStatus 
{
  Online,
  Offline
}//CHECKING ONLINE/OFFLINE NETWORK AVAILIBILITY

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'HOME', url: '/welcome-to-app', icon: 'mail' },
    { title: 'ABOUT', url: '/about-us', icon: 'mail' },
    { title: 'PROGRAMME 2023', url: '/programme-any', icon: 'mail' },
    { title: 'VIEW POI\'s', url: '/all-locations', icon: 'mail' },
    { title: 'BROWSE CATEGORIES', url: '/all-categories', icon: 'paper-plane' },
    { title: 'CONTACT US', url: '/contact-us', icon: 'heart' },    
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  private status = new BehaviorSubject(ConnectionStatus.Offline);//CHECKING ONLINE/OFFLINE NETWORK AVAILIBILITY
  public AppWelcome : any = [];
  constructor(private SendReceiveRequestsService : SendReceiveRequestsService, private network: Network, private platform: Platform, private alertController: AlertController, private Deeplink: Deeplinks) 
  {
    this.platform.ready().then(async () => 
    {
      //this.initializeNetworkEvents();//UNCOMMENT WHEN LIVE
      this.initializeAPP();//COMMENT WHEN LIVE
      let status =  this.network.type !== 'none' ? ConnectionStatus.Online : ConnectionStatus.Offline;
      this.status.next(status);
      
    });
  }

  public initializeNetworkEvents() 
  {
    this.network.onDisconnect().subscribe(() => 
    {
      if(this.status.getValue() === ConnectionStatus.Online) 
      {
        console.log('WE ARE OFFLINE');        
        this.initializeAPP();
        this.SendReceiveRequestsService.router.navigate(['/offline']);
        this.updateNetworkStatus(ConnectionStatus.Offline);
      }
    });
 
    this.network.onConnect().subscribe(() => 
    {
      if(this.status.getValue() === ConnectionStatus.Offline) 
      {
        console.log('WE ARE ONLINE');        
        this.initializeAPP();
        this.updateNetworkStatus(ConnectionStatus.Online);
      }
    });
  }

  private async updateNetworkStatus(status: ConnectionStatus) 
  {
    this.status.next(status);
    let connection = status == ConnectionStatus.Offline ? 'Offline' : 'Online';
  }
 
  public onNetworkChange(): Observable<ConnectionStatus> 
  {
    return this.status.asObservable();
  }
 
  public getCurrentNetworkStatus(): ConnectionStatus 
  {
    return this.status.getValue();
  }

  async initializeAPP()
  {
    this.platform.ready().then(async () => 
    {
      this.AppWelcome = (localStorage.getItem('app_welcome')) ? localStorage.getItem('app_welcome') : [];
      if(this.AppWelcome.length > 0)
      {
        this.AppWelcome = JSON.parse(this.AppWelcome);
        if(this.AppWelcome.hasOwnProperty('introduced'))
        {
          this.SendReceiveRequestsService.router.navigate(['/all-locations']);
        }
        else
        {
          this.SendReceiveRequestsService.router.navigate(['/welcome-to-app']);
        }
      }
      else 
      {
        this.SendReceiveRequestsService.router.navigate(['/welcome-to-app']);
      }

      //DEEP LINK
      this.Deeplink.route({'/location-in-detail/:id':'LocationInDetailPage'}).subscribe(async (match) =>       
      {
        let id = match.$args.id;
        let ObjOptionSelected = { id : id, what_to_see : "Details" }
        localStorage.setItem('selected_options',JSON.stringify(ObjOptionSelected));
        this.SendReceiveRequestsService.router.navigate(['/location-in-detail']);
        console.log("Match = ", match);
      },nomatch => 
      {
        // nomatch.$link - the full link data
        console.log("NoMatch = ", nomatch);
      });
      //DEEP LINK
    });
  }

  OpenURL(URLToOpen:any)
  {
    const options : InAppBrowserOptions = 
    {
      location : 'no',//Or 'no' 
      hidden : 'no', //Or  'yes'
      clearcache : 'yes',
      clearsessioncache : 'yes',
      zoom : 'no',//Android only ,shows browser zoom controls 
      hardwareback : 'no',
      mediaPlaybackRequiresUserAction : 'no',
      shouldPauseOnSuspend : 'no', //Android only 
      closebuttoncaption : 'Close', //iOS only
      disallowoverscroll : 'no', //iOS only 
      toolbar : 'yes', //iOS only 
      enableViewportScale : 'no', //iOS only 
      allowInlineMediaPlayback : 'no',//iOS only 
      presentationstyle : 'pagesheet',//iOS only 
      fullscreen : 'yes',//Windows only    
    };
    let target = "_blank";
    const browser = InAppBrowser.create(URLToOpen,target,options);
  }
}
