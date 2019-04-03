interface IProjectDates {
  fiscalYear: string;
  proposed: Date;
  actualStart: Date;
  completion: Date;
}

interface IProjectContractor {
  name: string;
  amount: number;
  duration: number;
}

interface IProjectCost {
  originalAllocation: number;
  cancelledAllocation: number;
  revisedAllocation: number;
  lguCounterpart: number;
  contractor: IProjectContractor;
  obligations: Array<any>;
  liquidations: Array<any>;
  disbursements: Array<any>;
}

interface IDetailedCostTransaction {
  date: Date;
  amount: number;
}

class ProjectDates implements IProjectDates {
  public fiscalYear = '';
  public proposed;
  public actualStart;
  public completion;
}

class ProjectCost implements IProjectCost {
  public originalAllocation = 0;
  public cancelledAllocation = 0;
  public revisedAllocation = 0;
  public lguCounterpart = 0;
  public contractor = new ProjectContractor();
  public obligations: IDetailedCostTransaction[] = [];
  public liquidations: IDetailedCostTransaction[] = [];
  public disbursements: IDetailedCostTransaction[] = [];

}

class ProjectContractor implements IProjectContractor {
  public name = '';
  public amount = 0;
  public duration = 0;
}

export class Project {

  public objectId = this.objectId === '' ? this.objectId : this.objectId ;
  public code = '';
  public name = '';
  public otherName = '';
  public description = '';
  public program: any = new Object();
  public type = '';
  public noHHBeneficiary = 0;
  public dates: IProjectDates = new ProjectDates();
  public remarks = '';

  // location details
  public location: any = new Object();
  public region: any = new Object();
  public province: any = new Object();
  public projectType: any = new Object();
  // public projectSubtype: any = new Object();
  public reportingPhase = 0;
  public report: any = new Object();
  public subProjectStatus: any = this.subProjectStatus === '' ? this.subProjectStatus : this.subProjectStatus;
  public projectSubtype: any = this.projectSubtype === '' ? this.projectSubtype : this.projectSubtype;
  public projectManagementOffice = '';
  public division = '';
  public district = '';
  public districtLevel = 0;
  public municipality: any = new Object();
  // public barangay: any = new Object();
  public barangay: any = this.barangay === '' ? this.barangay : this.barangay;
  public zone = '';
  public sitio = '';
  public reportFlagged = {};
  public citizenFlagged = {};
  public reportFlaggedPoint = 0;
  public citizenFlaggedPoint = 0;

  // cost details
  public batchNumber = 0;
  public nationalSubsidy = 0;
  public cost: IProjectCost = new ProjectCost();
  public referenceNumber = '';

  // public programStatus: any = new Object();

  public projectStatus: any = new Object();
  public projectReport: any = new Object();

  constructor(data?: object) {
    if (data) { this.assign(data); }
  }

  public assign(props: Object) {
    Object.keys(this).forEach(key => this[key] = props[key]);
  }

}
