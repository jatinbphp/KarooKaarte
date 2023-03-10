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
  public ApiUrl: string = "https://karookaarte.co.za/app/public/api/";//LIVE SERVER
  public SiteUrl: string = "https://karookaarte.co.za/";//LIVE SERVER
  constructor(private http: HttpClient, private alertCtrl: AlertController, public router: Router, private toastController: ToastController)
  { }

  GetWelcomeText()
  {
    return new Promise((resolve, reject) => 
    {
      this.http.get(this.ApiUrl + "welcome-screen", {}).subscribe((res: any) =>       
      {
        resolve(res);					
      },
      err => 
      {
        console.log(err);
        let errorMessage=this.getErrorMessage(err);
        reject(errorMessage);
      });
    });
  }

  GetLocationsAll(Data:any)
  {
    return new Promise((resolve, reject) => 
    {
      let DataToPost = new HttpParams().set("category_id",Data.CategoryID);
      this.http.post(this.ApiUrl + "location",  DataToPost , {}).subscribe((res: any) =>       
      {
        resolve(res);					
      },
      err => 
      {
        console.log(err);
        let errorMessage=this.getErrorMessage(err);
        reject(errorMessage);
      });
    });
  }

  getErrorMessage(err:any)
	{	
		if(err.error == null)
		{
			return err.message;
		}
		else if(err.error.message)
		{
			return err.error.message;
		} 
		else 
		{
			return err.error.status;
		}
	}

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
