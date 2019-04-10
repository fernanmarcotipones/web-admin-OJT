import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleMapsAPIWrapper, AgmCoreModule } from '@agm/core';
import { AgmSnazzyInfoWindowModule } from '@agm/snazzy-info-window';
import { AgmJsMarkerClustererModule } from '@agm/js-marker-clusterer';

import { LocationManagmentRoutingModule } from './location-management-routing.module';
import { LocationManagementComponent } from './location-management.component';

import { SharedModule } from 'app/shared/shared.module';

import { RegionComponent } from './region/region.component';
import { RegionListComponent } from './region/list/list.component';
import { RegionTableComponent } from './region/table/table.component';
import { RegionDetailsComponent } from './region/details/details.component';
import { RegionValidators } from './region/details/details.validators';

@NgModule({
  imports: [
    SharedModule,
    CommonModule,
    LocationManagmentRoutingModule,
    AgmCoreModule,
    AgmSnazzyInfoWindowModule,
    AgmJsMarkerClustererModule,
  ],
  providers: [
    GoogleMapsAPIWrapper,
    RegionValidators,
  ],
  declarations: [
    LocationManagementComponent,
    RegionComponent,
    RegionListComponent,
    RegionTableComponent,
    RegionDetailsComponent,
  ],
})
export class LocationManagementModule {}
