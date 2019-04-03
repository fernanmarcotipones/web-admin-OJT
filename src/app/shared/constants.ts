export class Constants {
  public static get DEFAULT_MAP_CENTER_LATITUDE(): number { return 13; };
  public static get DEFAULT_MAP_CENTER_LONGITUDE(): number { return 122; };
  public static get DEFAULT_MAP_ZOOM(): number { return 6; };

  public static get ALERT_TIMEOUT(): number { return 5000; };

  public static get DEFAULT_PAGE_NUMBER(): number { return 0; };
  public static get DEFAULT_PAGE_SIZE(): number { return 10; };

  public static get FORGOT_PASSWORD_INTERVAL(): number { return 30000; };

  // API CONFIG
  // public static get API_LINK(): string { return 'https://script.google.com/macros/s/AKfycbxdECVhwmfSnM2tTm9fVhfcE3iEAnj7G9wwDPm2xWGkdKTpEE4/exec?'; }
  public static get API_KEY(): number { return 123456; };
  public static get API_OPERATION(): string { return 'FormToJson' };
  public static get API_LINK(): string { return 'https://script.google.com/macros/s/AKfycbz0v8WBpW4xaPIqMsawFhKKYo4xy_4vPAZZtZPGD3k3m6tR_j_W/exec?'; }
  // END API CONFIG

  public static get PROJECT_TYPE(): any { return [
    { id: 1, code: 'EVACUATION_CENTER', name: 'Evacuation Center'},
    { id: 2, code: 'ROAD', name: 'Road' },
    { id: 3, code: 'SANITATION_FACILITY', name: 'Sanitation Facility' },
    { id: 4, code: 'SCHOOL', name: 'School'},
    { id: 5, code: 'WATER_FACILITY', name: 'Water Facility'}
  ]; };
  public static get PROJECT_MANAGEMENT_OFFICE(): any { return [
    { id: 1, code: 'DRROI PMO'},
    { id: 2, code: 'LAR PMO'},
    { id: 3, code: 'WSS PMO'},
  ]}

  public static get DISTRICT_LEVELS(): any { return [
    { id: 0, level: 0, name: 'Lone District'},
    { id: 1, level: 1, name: '1st'},
    { id: 2, level: 2, name: '2nd'},
    { id: 3, level: 3, name: '3rd'},
    { id: 4, level: 4, name: '4th'},
    { id: 5, level: 5, name: '5th'},
    { id: 6, level: 6, name: '6th'},
    { id: 7, level: 7, name: '7th'}
  ]; };

  public static get SUPER_ADMIN_ROLE(): string { return 'SuperAdmin'; };
  public static get PROJECT_ADMIN_ROLE(): string { return 'ProjectAdmin'; };
  public static get REGIONAL_OVERSIGHT_ROLE(): string { return 'RegionalOversight'; };
  public static get PROVINCIAL_OVERSIGHT_ROLE(): string { return 'ProvincialOversight'; };
  public static get REPORT_VALIDATOR_ROLE(): string { return 'Validator'; };
  public static get REPORTER_ROLE(): string { return 'Reporter'; };
  public static get CSO_ADMIN_ROLE(): string { return 'CSOAdmin'; };
  public static get CSO_REPORTER_ROLE(): string { return 'CSOReporter'; };
  public static get REGISTERED_USER_ROLE(): string { return 'RegisteredUser'; };

  public static get NATIONAL_ACCESS_LEVEL(): string { return 'National'; };
  public static get REGIONAL_ACCESS_LEVEL(): string { return 'Regional'; };
  public static get PROVINCIAL_ACCESS_LEVEL(): string { return 'Provincial'; };
  public static get MUNICIPAL_ACCESS_LEVEL(): string { return 'Municipal'; };
  public static get BARANGAY_ACCESS_LEVEL(): string { return 'Barangay'; };

  public static get SAVED_PROJECT_REPORT_STATUS(): string { return 'SAVED'; };
  public static get PASSED_PROJECT_REPORT_STATUS(): string { return 'PASSED'; };
  public static get SUBMITTED_PROJECT_REPORT_STATUS(): string { return 'SUBMITTED'; };
  public static get REQ_REVISE_PROJECT_REPORT_STATUS(): string { return 'REQ_REVISE'; };
  public static get REOPEN_PROJECT_REPORT_STATUS(): string { return 'REOPEN'; };
  public static get REQ_REOPEN_PROJECT_REPORT_STATUS(): string { return 'REQ_REOPEN'; };

  public static get DEPED_AGENCY(): string { return 'DEPED'}
  public static get DILG_AGENCY(): string { return 'DILG'}
  public static get DSWD_AGENCY(): string { return 'DSWD'}

  public static get STATUS(): any { return [
    {name: 'All', value: ''},
    {name: 'ACTIVE', value: 'true'},
    {name: 'INACTIVE', value: 'false'},
  ]}

  public static get CSO_REPORT_STATUSES(): any { return [
    {name: 'SUBMITTED', value: 'SUBMITTED'},
    {name: 'FOR REVISION', value: 'FOR_REVISION'},
    {name: 'VALID', value: 'VALID'},
    {name: 'REJECTED', value: 'REJECTED'},
  ]}

  public static get SUBMITTED_CSO_REPORT_STATUS(): string { return 'SUBMITTED'; };
  public static get FOR_REVISION_CSO_REPORT_STATUS(): string { return 'FOR_REVISION'; };
  public static get VALID_CSO_REPORT_STATUS(): string { return 'VALID'; };
  public static get REJECTED_CSO_REPORT_STATUS(): string { return 'REJECTED'; };

  public static get FEEDBACK_STATUSES(): any { return [
    {name: 'SUBMITTED', value: 'SUBMITTED'},
    {name: 'FOR REVISION', value: 'FOR_REVISION'},
    {name: 'VALID', value: 'VALID'},
    {name: 'INVALID', value: 'INVALID'},
  ]}

  public static get SUBMITTED_FEEDBACK_STATUS(): string { return 'SUBMITTED'; };
  public static get FOR_REVISION_FEEDBACK_STATUS(): string { return 'FOR_REVISION'; };
  public static get VALID_FEEDBACK_STATUS(): string { return 'VALID'; };
  public static get INVALID_FEEDBACK_STATUS(): string { return 'INVALID'; };

  public static get NOTIFICATION_EVENT_SUBMITTED_FORM(): string { return 'SUBMITTED_FORM'; };
  public static get NOTIFICATION_EVENT_VALID_FORM(): string { return 'VALID_FORM'; };
  public static get NOTIFICATION_EVENT_INVALID_FORM(): string { return 'INVALID_FORM'; };
  public static get NOTIFICATION_EVENT_REJECTED_FORM(): string { return 'REJECTED_FORM'; };
  public static get NOTIFICATION_EVENT_FOR_REVISION_FORM(): string { return 'FOR_REVISION_FORM'; };

  public static get NOTIFICATION_ENTITY_TYPE_FEEDBACK(): string { return 'Feedback'; };
  public static get NOTIFICATION_ENTITY_TYPE_PROJECT_MONITORING(): string { return 'ProjectMonitoringReport'; };

  public static get PROJECT_REPORT_STATUSES(): any { return [
    {name: 'SAVED', value: 'SAVED'},
    {name: 'PASSED', value: 'PASSED'},
    {name: 'SUBMITTED', value: 'SUBMITTED'},
    {name: 'REQ_REVISE', value: 'REQ_REVISE'},
    {name: 'REOPEN', value: 'REOPEN'},
    {name: 'REQ_REOPEN', value: 'REQ_REOPEN'},
  ]}

  public static get STATUS_PROFILED(): string { return 'PROFILED'; };
  public static get STATUS_READY(): string { return 'READY'; };
  public static get STATUS_DELIVERED(): string { return 'DELIVERED'; };
  public static get STATUS_INSTALLED(): string { return 'INSTALLED'; };

  public static get FORM_STATUSES(): any { return [
    { id: 1, code: 'TO_VERIFY', name: 'TO VERIFY'},
    { id: 2, code: 'PUBLISHED', name: 'PUBLISHED' },
    { id: 3, code: 'IN_USE', name: 'IN USE'}
  ]}

  public static get FORM_TYPES(): any { return [
    { id: 1, code: 'PROFILE', name: 'PROFILE'},
    { id: 2, code: 'SURVEY', name: 'SURVEY' },
    { id: 3, code: 'FEEDBACK', name: 'FEEDBACK' }
  ]}

  public static get HAS_FEEDBACK(): any { return [
    {label: 'With Feedback', value: true},
    {label: 'Without Feedback', value: false}
  ]}

  public static get USER_ACTIVATION(): any { return [
    {label: 'ACTIVE', value: true},
    {label: 'INACTIVE', value: false}
  ]}

  public static get USER_VERIFICATION(): any { return [
    {label: 'VERIFIED', value: true},
    {label: 'NOT VERIFIED', value: false}
  ]}

  public static get VERSION(): string { return 'v1.3.1'; };
}
