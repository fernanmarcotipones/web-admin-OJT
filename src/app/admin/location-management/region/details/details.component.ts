import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  OnDestroy,
} from '@angular/core';
import {
  FormGroup,
  Validators,
  FormControl,
  FormBuilder,
} from '@angular/forms';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Parse } from 'parse';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { RegionService, APIService, NotificationToastrService } from 'app/core';
import { Region } from 'app/core/models';
import { Constants } from 'app/shared/constants';

import { RegionValidators } from './details.validators';

@Component({
  selector: 'app-admin-region-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class RegionDetailsComponent implements OnInit, OnDestroy {
  @ViewChild(BsModalRef) confirmModalRef: BsModalRef;

  public lat: number;
  public lng: number;
  public phLat: number;
  public phLng: number;
  public zoom = 4;
  public subscriptions: Array<Subscription> = [];
  public loading = false;
  public result: boolean;
  public regionForm: FormGroup;
  public regionName: string;
  public regionItems: Region;
  public formUsage = 'Add New Region';
  public modalAction = 'Save';
  public buttonAction = 'Save';
  public regionInfo: any;
  public objId: any;
  public modalUsage: string;
  public orders: Array<number> = [];

  public psgcCodeValue: string;
  public regionCodeValue: string;

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private apiService: APIService,
    private regionService: RegionService,
    private _location: Location,
    private modalService: BsModalService,
    private notification: NotificationToastrService,
    public regionValidators: RegionValidators,
  ) {
    let objId = '';
    this.activatedRoute.paramMap.subscribe(params => {
      objId = params.get('objId');
      if (objId) {
        this.formUsage = 'Edit Region';
        this.buttonAction = 'Update';
        this.getRegionById(objId);
      } else {
        this.phLat = Constants.DEFAULT_MAP_CENTER_LATITUDE;
        this.phLng = Constants.DEFAULT_MAP_CENTER_LONGITUDE;
        this.loading = true;
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(pos => {
            this.lng = pos.coords.longitude ? pos.coords.longitude : this.phLat;
            this.lat = pos.coords.latitude ? pos.coords.latitude : this.phLng;
            this.regionForm.patchValue({
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

    this.regionForm = this.fb.group({
      name: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      psgcCode: new FormControl(
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.minLength(9),
          Validators.maxLength(9),
          // this.regionValidators.isPsgcMatch.bind(this),
        ],

        this.regionValidators.psgcCodeTaken.bind(this),
      ),
      regionCode: new FormControl(
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.minLength(2),
          Validators.maxLength(2),
          this.regionValidators.isRegionMatch.bind(this),
        ],
        this.regionValidators.regionCodeTaken.bind(this),
      ),
      location: new FormGroup({
        latitude: new FormControl(
          { value: this.lat, disabled: true },
          [Validators.required],
          this.regionValidators.latitudeValidator.bind(this),
        ),
        longitude: new FormControl(
          { value: this.lng, disabled: true },
          [Validators.required],
          this.regionValidators.longitudeValidator.bind(this),
        ),
      }),
    });
    this.getMaxOrder();
  }

  ngOnInit() {
    this.psgcCodeValueChanged(this.regionCodeValue);
    this.regionCodeValueChanged(this.psgcCodeValue);
  }

  regionFormDefaultValidators(control) {
    return (
      this.regionForm.get(control).invalid &&
      this.regionForm.get(control).touched
    );
  }

  psgcCodeValueChanged(regionValue) {
    this.regionCodeValue = regionValue;
    this.subscriptions.push(
      this.regionForm
        .get('psgcCode')
        .valueChanges.subscribe((psgcCode: string) => {
          this.regionCodeValueChanged(psgcCode);
          this.regionValidators.isRegionMatch(psgcCode);
          if (
            this.regionCodeValue !== null ||
            this.regionCodeValue !== undefined
          ) {
            const psgcSubstring = psgcCode ? psgcCode.substring(0, 2) : '';
            if (psgcSubstring !== this.regionCodeValue) {
              console.log('not match');
              return { regionCodeNotMatch: true };
            }
            console.log('matched!');
            return null;
          }
        }),
    );
  }

  regionCodeValueChanged(psgcValue) {
    this.psgcCodeValue = psgcValue;
    this.subscriptions.push(
      this.regionForm
        .get('regionCode')
        .valueChanges.subscribe((regionCode: string) => {
          this.psgcCodeValueChanged(regionCode);
        }),
    );
  }

  getRegionById(id) {
    this.subscriptions.push(
      this.regionService.getById(id).subscribe(res => {
        this.objId = res.result[0];
        this.loadEditItems(res.result[0].toJSON());
      }),
    );
  }

  openConfirmModal(template: TemplateRef<any>) {
    let objId = '';
    this.activatedRoute.paramMap.subscribe(params => {
      objId = params.get('objId');
      if (objId) {
        this.modalUsage = 'Edit';
        this.regionName = this.regionInfo.name;
      } else {
        this.modalUsage = 'Add';
        this.regionName = this.regionForm.value.name;
      }
    });
    this.confirmModalRef = this.modalService.show(template);
  }

  markerDragEnd($event) {
    this.lat = $event.coords.lat;
    this.lng = $event.coords.lng;
  }

  async onLatKeyUp($event) {
    let latitudeDebounceTime: any;
    clearTimeout(latitudeDebounceTime);
    latitudeDebounceTime = setTimeout(async () => {
      const latitude = $event.target.value;
      this.lat = await latitude;
    }, 1000);
  }

  async onLngKeyUp($event) {
    let longitudeDebounceTime: any;
    clearTimeout(longitudeDebounceTime);
    longitudeDebounceTime = setTimeout(async () => {
      const latitude = $event.target.value;
      this.lat = await latitude;
    }, 1000);
  }

  async getMaxOrder() {
    let orders;
    await this.regionService.getAll().then(res => {
      orders = res.map(item => item.order);
    });
    this.orders = orders;
    return Math.max(...orders);
  }

  onAddRegion() {
    const form = this.regionForm.controls;
    const maxOrder = Math.max(...this.orders);
    this.regionItems = new Region();
    this.regionItems.name = form.name.value;
    this.regionItems.description = form.description.value;
    this.regionItems.psgcCode = form.psgcCode.value;
    this.regionItems.regionCode = form.regionCode.value;
    this.regionItems.location = new Parse.GeoPoint(
      form.location.value.latitude,
      form.location.value.longitude,
    );
    this.regionItems.order = maxOrder + 1;
    console.log(this.regionItems);
    this.regionService.createItem(this.regionItems);
    this.notification.alert(
      'success',
      `Successfully created ${form.name.value}`,
    );
    this.regionForm.reset();
    this.closeModal();
  }

  async loadEditItems(info) {
    this.loading = true;
    this.regionInfo = info;
    this.modalAction = 'Update';
    this.lat = info.location.latitude;
    this.lng = info.location.longitude;
    this.zoom = 15;
    this.regionForm.controls['name'].setValue(info.name);
    this.regionForm.controls['description'].setValue(info.description);
    this.regionForm.controls['psgcCode'].setValue(info.psgcCode);
    this.regionForm.controls['regionCode'].setValue(info.regionCode);
    await this.regionForm.patchValue({
      location: {
        latitude: info.location.latitude ? info.location.latitude : this.lat,
        longitude: info.location.longitude ? info.location.longitude : this.lng,
      },
    });
    this.loading = false;
  }

  onEditRegion() {
    const location = new Parse.GeoPoint(
      this.regionForm.controls.location.value,
    );
    const data = Object.assign({}, this.regionForm.value, location);
    this.apiService.update(this.objId, data);
    this.notification.alert(
      'success',
      `Successfully edited ${this.regionForm.controls.name.value}`,
    );
    this.regionForm.reset();
    this.closeModal();
  }

  closeModal() {
    if (!this.confirmModalRef) {
      return;
    }
    this.confirmModalRef.hide();
    this.confirmModalRef = null;
    this._location.back();
  }

  onSaveRegion() {
    let objId = '';
    this.subscriptions.push(
      this.activatedRoute.paramMap.subscribe(params => {
        objId = params.get('objId');
        if (objId) {
          this.onEditRegion();
        } else {
          this.onAddRegion();
        }
      }),
    );
  }

  ngOnDestroy() {
    for (const subs of this.subscriptions) {
      subs.unsubscribe();
    }
  }
}
