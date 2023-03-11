import { Component } from '@angular/core';
import { Platform, AlertController } from '@ionic/angular';
import { Network } from '@awesome-cordova-plugins/network/ngx';
import { BehaviorSubject, Observable } from 'rxjs';
import { SendReceiveRequestsService } from './providers/send-receive-requests.service';

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
    { title: 'POI\'s', url: '/all-locations', icon: 'mail' },
    { title: 'BROWS CATEGORIES', url: '/all-categories', icon: 'paper-plane' },
    { title: 'CONTACT US', url: '/contact-us', icon: 'heart' },    
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  private status = new BehaviorSubject(ConnectionStatus.Offline);//CHECKING ONLINE/OFFLINE NETWORK AVAILIBILITY
  public AppWelcome : any = [];
  constructor(private SendReceiveRequestsService : SendReceiveRequestsService, private network: Network, private platform: Platform, private alertController: AlertController) 
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
    });
  }
}
