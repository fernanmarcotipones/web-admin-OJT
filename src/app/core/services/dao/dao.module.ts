import { NgModule } from '@angular/core';

import { UserService } from './user.service';
import { UserProfileService } from './userProfile.service';
import { UserRoleService } from './userRole.service';
import { ProgramService } from './program.service';
import { RegionService } from './region.service';
import { ProvinceService } from './province.service';
import { MunicipalityService } from './municipality.service';
import { BarangayService } from './barangay.service';
import { FormService } from './form.service';
import { UserProgramRoleService } from './userProgramRole.service';
import { ProgramConfigurationService } from './programConfiguration.service';
import { ProgramAccessLevelService } from './programAccessLevel.service';
import { DateService } from './date.service';
import { CSOGroupService } from './csoGroup.service';
import { CSOGroupCodeService } from './csoGroupCode.service';
import { UserCSOGroupService } from './userCSOGroup.service';
import { ReporterFormService } from './reporterForm.service';
import { ProgramMonitoringFormService } from './programMonitoringForm.service';
import { ProjectMonitoringReportService } from './projectMonitoringReport.service';
import { ProjectStatusService } from './projectStatus.service';
import { UserExportService } from './userExport.service';

export * from './user.service';
export * from './userProfile.service';
export * from './userRole.service';
export * from './program.service';
export * from './region.service';
export * from './province.service';
export * from './municipality.service';
export * from './barangay.service';
export * from './form.service';
export * from './userProgramRole.service';
export * from './programConfiguration.service';
export * from './programAccessLevel.service'
export * from './date.service';
export * from './csoGroup.service';
export * from './csoGroupCode.service';
export * from './userCSOGroup.service';
export * from './reporterForm.service';
export * from './programMonitoringForm.service';
export * from './projectMonitoringReport.service';
export * from './userExport.service';
export * from './projectStatus.service';

@NgModule({
  providers: [
    UserService,
    UserProfileService,
    UserRoleService,
    CSOGroupService,
    CSOGroupCodeService,
    ProgramService,
    RegionService,
    ProvinceService,
    MunicipalityService,
    BarangayService,
    FormService,
    UserProgramRoleService,
    DateService,
    ProgramConfigurationService,
    ProgramAccessLevelService,
    UserCSOGroupService,
    ReporterFormService,
    ProgramMonitoringFormService,
    ProjectMonitoringReportService,
    UserExportService,
    ProjectStatusService,
  ]
})
export class DAOModule {
}
