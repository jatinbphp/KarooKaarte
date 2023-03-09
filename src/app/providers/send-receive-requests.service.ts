import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class SendReceiveRequestsService 
{
  //public ApiUrl: string = "https://xana.ecnet.dev/api/";//DEVELOPMENT SERVER
  //public SiteUrl: string = "https://xana.ecnet.dev/";//DEVELOPMENT SERVER
  public ApiUrl: string = "https://cpm.xanagroup.ca/api/";//LIVE SERVER
  public SiteUrl: string = "https://cpm.xanagroup.ca/";//LIVE SERVER
  constructor(private http: HttpClient, private alertCtrl: AlertController, public router: Router, private toastController: ToastController)
  { }

  async showMessageToast(message:any) 
  {
    if(message != '' && message !='undefined' && message != undefined) 
    {
      const toast = await this.toastController.create({
        message: message,
        duration: 3000,
        icon: 'information-circle',
        cssClass: 'custom-toast',
        buttons: [				
          {
            text: 'Dismiss',
            role: 'cancel',
            handler: () => {  }
          }
        ]
      });
      await toast.present();
      await toast.onDidDismiss();
    }
  }
}
