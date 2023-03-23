import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Network } from '@awesome-cordova-plugins/network/ngx';
import { AppVersion } from '@awesome-cordova-plugins/app-version/ngx';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { LocationAccuracy } from '@awesome-cordova-plugins/location-accuracy/ngx';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@awesome-cordova-plugins/native-geocoder/ngx';
import { Media } from '@awesome-cordova-plugins/media/ngx';
import { Deeplinks } from '@awesome-cordova-plugins/deeplinks/ngx';
import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    HttpClient,
    Network,
    AppVersion,
    AndroidPermissions,
    LocationAccuracy,
    Geolocation,
    NativeGeocoder,
    Media,
    Deeplinks,    
    StatusBar,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
