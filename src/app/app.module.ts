import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';

import { AppRoutingModule } from './app-routing.module';

import { AgmCoreModule } from '@agm/core';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';
import { AgmJsMarkerClustererModule } from '@agm/js-marker-clusterer';

import { AppComponent } from './app.component';

import { environment } from '../environments/environment';
import {MatSlideToggleModule, MatCheckboxModule} from '@angular/material'

import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatSlideToggleModule, MatCheckboxModule,
    CoreModule,
    SharedModule,
    ReactiveFormsModule,
    AppRoutingModule,

    AgmCoreModule.forRoot(
      {
        apiKey: environment.map.api,
        libraries: ['visualization']
      }
    ),
    AgmSnazzyInfoWindowModule,
    AgmJsMarkerClustererModule,
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
