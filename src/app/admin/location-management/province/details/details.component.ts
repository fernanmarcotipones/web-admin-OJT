import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  OnDestroy,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { Location } from '@angular/common';
import { Parse } from 'parse';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';

import {
  RegionService,
  ProvinceService,
  APIService,
  NotificationToastrService,
} from 'app/core';
import { Constants } from 'app/shared/constants';
import { Province } from 'app/core/models';
import { Subscription } from 'rxjs/Subscription';
import { ProvinceValidators } from './details.validators';

@Component({
  selector: 'app-admin-province-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class ProvinceDetailsComponent implements OnInit, OnDestroy {
  @ViewChild(BsModalRef) confirmModalRef: BsModalRef;
  public lat: any;
  public lng: any;
  public phLat: number;
  public phLng: number;
  public zoom = 4;
  public loading = false;
  public subscriptions: Array<Subscription> = [];
  public regionArray: any = [];
  public objId: any;
  public provinceForm: FormGroup;
  public provinceItems: Province;
  public provinceInfo: any;
  public provinceName: string;
  public formUsage = 'Add New Province';
  public modalAction = 'Save';
  public buttonAction = 'Save';
  public modalUsage: string;
  public orders: Array<number> = [];

  constructor(
    private fb: FormBuilder,
    private apiService: APIService,
    private regionService: RegionService,
    private provinceService: ProvinceService,
    private activatedRoute: ActivatedRoute,
    private modalService: BsModalService,
    private _location: Location,
    public provinceValidators: ProvinceValidators,
    private notification: NotificationToastrService,
  ) {
    let objId = '';
    this.activatedRoute.paramMap.subscribe(params => {
      objId = params.get('objId');
      if (objId) {
        this.formUsage = 'Edit Province';
        this.buttonAction = 'Update';
        this.getProvinceById(objId);
      } else {
        this.phLat = Constants.DEFAULT_MAP_CENTER_LATITUDE;
        this.phLng = Constants.DEFAULT_MAP_CENTER_LONGITUDE;
        this.loading = true;
        if (navigator) {
          navigator.geolocation.getCurrentPosition(pos => {
            this.lng = pos.coords.longitude ? pos.coords.longitude : this.phLat;
            this.lat = pos.coords.latitude ? pos.coords.latitude : this.phLng;
            this.provinceForm.patchValue({
              location: {
                latitude: this.lat,
                longitude: this.lng,
              },
            });
            this.zoom = 15;
            this.loading = false;
          });
        }
      }
    });

    this.provinceForm = this.fb.group({
      region: new FormControl(null, Validators.required),
      name: new FormControl('', Validators.required),
      psgcCode: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.minLength(9),
          Validators.maxLength(9),
        ]),
        this.provinceValidators.psgcCodeValidator.bind(this),
      ),
      provinceCode: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.minLength(4),
          Validators.maxLength(4),
        ]),
        this.provinceValidators.provinceCodeValidator.bind(this),
      ),
      location: new FormGroup({
        latitude: new FormControl(
          { value: this.lat, disabled: true },
          [Validators.required],
          this.provinceValidators.latitudeValidator.bind(this),
        ),
        longitude: new FormControl(
          { value: this.lng, disabled: true },
          [Validators.required],
          this.provinceValidators.longitudeValidator.bind(this),
        ),
      }),
      isSocialMediaProhibited: new FormControl(false),
    });

    this.regionService.getAll().then(result => {
      // for region name dropdown
      this.regionArray = result;
    });
  }

  ngOnInit() {}

  async getProvinceById(id) {
    this.subscriptions.push(
      this.provinceService.getById(id).subscribe(res => {
        this.objId = res.result[0];
        this.loadEditItems(res.result[0].toJSON());
      }),
    );
  }

  provinceFormDefaultValidators(control: any) {
    return (
      this.provinceForm.get(control).invalid &&
      this.provinceForm.get(control).touched
    );
  }

  markerDragEnd($event) {
    this.lat = $event.coords.lat;
    this.lng = $event.coords.lng;
  }

  onAddProvince() {
    const form = this.provinceForm.controls;
    this.provinceItems = new Province();
    this.regionService.getById(form.region.value).subscribe(res => {
      const region = res.result[0];
      this.provinceItems.region = region;
      this.provinceItems.name = form.name.value;
      this.provinceItems.psgcCode = form.psgcCode.value;
      this.provinceItems.provinceCode = form.provinceCode.value;
      this.provinceItems.location = new Parse.GeoPoint(
        form.location.value.latitude,
        form.location.value.longitude,
      );
      this.provinceItems.isSocialMediaProhibited =
        form.isSocialMediaProhibited.value;
      this.provinceService.createItem(this.provinceItems);
      this.notification.alert(
        'success',
        `Successfully added ${form.name.value}`,
      );
    });

    this.closeModal();
  }

  async loadEditItems(info) {
    this.activatedRoute.paramMap.subscribe(params => {
      this.provinceValidators.objId = params.get('objId');
    })
    this.loading = true;
    this.provinceInfo = info;
    this.modalAction = 'Update';
    this.zoom = 15;
    this.lat = info.region.location.latitude
      ? info.region.location.latitude
      : info.location.latitude;
    this.lng = info.region.location.longitude
      ? info.region.location.longitude
      : info.location.longitude;
    this.provinceForm.controls['region'].setValue(info.region.objectId);
    this.provinceForm.controls['name'].setValue(info.name);
    this.provinceForm.controls['psgcCode'].setValue(info.psgcCode);
    this.provinceForm.controls['provinceCode'].setValue(info.provinceCode);
    await this.provinceForm.patchValue({
      location: {
        latitude: this.lat,
        longitude: this.lng,
      },
    });
    this.loading = false;
  }

  onEditProvince() {
    const form = this.provinceForm.controls;
    this.regionService.getById(form.region.value).subscribe(res => {
      const region = res.result[0];
      const location = new Parse.GeoPoint(
        this.provinceForm.controls.location.value,
      );
      const data = Object.assign({}, this.provinceForm.value, location);
      data.region = region;
      this.apiService.update(this.objId, data);
      this.notification.alert(
        'success',
        `Successfully updated ${form.name.value}`,
      );
      this.provinceForm.reset();
    });
    this.closeModal();
  }

  onSaveProvince() {
    let objId = '';
    this.activatedRoute.paramMap.subscribe(params => {
      objId = params.get('objId');
      if (objId) {
        this.onEditProvince();
      } else {
        this.onAddProvince();
      }
    });
  }

  openConfirmModal(template: TemplateRef<any>) {
    let objId = '';
    this.activatedRoute.paramMap.subscribe(params => {
      objId = params.get('objId');
      if (objId) {
        this.modalUsage = 'Edit';
        this.provinceName = this.provinceInfo.name;
      } else {
        this.modalUsage = 'Add';
        this.provinceName = this.provinceForm.value.name;
      }
    });
    this.confirmModalRef = this.modalService.show(template);
  }

  closeModal() {
    if (!this.confirmModalRef) {
      return;
    }
    this.confirmModalRef.hide();
    this.confirmModalRef = null;
    this._location.back();
  }

  ngOnDestroy() {
    for (const subs of this.subscriptions) {
      subs.unsubscribe();
    }
  }
}
