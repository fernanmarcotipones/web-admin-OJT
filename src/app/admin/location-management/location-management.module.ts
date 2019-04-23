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

import { ProvinceComponent } from './province/province.component';
import { ProvinceDetailsComponent } from './province/details/details.component';
import { ProvinceListComponent } from './province/list/list.component';
import { ProvinceTableComponent } from './province/table/table.component';
import { ProvinceValidators } from './province/details/details.validators';
import { DetailsComponent } from './municipality/details/details.component';
import { ListComponent } from './municipality/list/list.component';
import { TableComponent } from './municipality/table/table.component';

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
    ProvinceValidators,
  ],
  declarations: [
    LocationManagementComponent,
    RegionComponent,
    RegionListComponent,
    RegionTableComponent,
    RegionDetailsComponent,
    ProvinceComponent,
    ProvinceListComponent,
    ProvinceDetailsComponent,
    ProvinceTableComponent,
    MunicipalityComponent,
    DetailsComponent,
    ListComponent,
    TableComponent,
  ],
})
export class LocationManagementModule {}
