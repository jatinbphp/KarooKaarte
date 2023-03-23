import { Component, OnInit } from '@angular/core';
import { AppVersion } from '@awesome-cordova-plugins/app-version/ngx';
import { Platform } from '@ionic/angular';
import { AppRate } from '@awesome-cordova-plugins/app-rate';
import { InAppBrowser, InAppBrowserOptions } from '@awesome-cordova-plugins/in-app-browser';
import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.page.html',
  styleUrls: ['./contact-us.page.scss'],
})

export class ContactUsPage implements OnInit 
{
  public AppVersion : any = null;
  public AppVersionCode : any = null;
  public ContactInformation: any = [];
  constructor(private AppInfo: AppVersion, private Platform: Platform, private StatusBar: StatusBar)
  { }

  async ngOnInit() 
  { 
    this.ContactInformation = (localStorage.getItem('contact_information')) ? localStorage.getItem('contact_information') : "";
    this.ContactInformation = JSON.parse(this.ContactInformation);
    await this.AppInfo.getVersionNumber().then( Info => {
      this.AppVersion = Info;
    });
    await this.AppInfo.getVersionCode().then( Info => {
      this.AppVersionCode = Info;
    });
  }

  ionViewWillEnter()
  {
    this.StatusBar.backgroundColorByHexString('#000000');
  }

  RateUs()
  {
    this.Platform.ready().then(async () => 
    {
      AppRate.setPreferences({
        useLanguage:"en",
        displayAppName:"Karoo Kaarte",
        promptAgainForEachNewVersion: false,
        storeAppURL:{
          ios:"karookaarte.co.za",
          android:"market://details?id=karookaarte.co.za"
        },
        customLocale: {
          title: "Would you mind rating %@?",
          message: "It won't take more than a minute and helps to promote our app. Thanks for your support!",
          cancelButtonLabel: "No, Thanks",
          laterButtonLabel: "Remind Me Later",
          rateButtonLabel: "Rate It Now",
          yesButtonLabel: "Yes!",
          noButtonLabel: "Not really",
          appRatePromptTitle: 'Do you like using %@',
          feedbackPromptTitle: 'Mind giving us some feedback?',
        },
        openUrl: function(url) 
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
          let target = "_system";
          const browser = InAppBrowser.create(url,target,options);          
        }
      });
    });
    AppRate.promptForRating();
  }
}
