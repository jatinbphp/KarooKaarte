import { Component, OnInit } from '@angular/core';
import { AppVersion } from '@awesome-cordova-plugins/app-version/ngx';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.page.html',
  styleUrls: ['./contact-us.page.scss'],
})

export class ContactUsPage implements OnInit 
{
  public AppVersion : any = null;
  public AppVersionCode : any = null;
  constructor(private AppInfo: AppVersion)
  { }

  async ngOnInit() 
  { 
    await this.AppInfo.getVersionNumber().then( Info => {
      this.AppVersion = Info;
    });
    await this.AppInfo.getVersionCode().then( Info => {
      this.AppVersionCode = Info;
    });
  }

}
