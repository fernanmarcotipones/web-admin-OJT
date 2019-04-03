import { MapPage } from './map-page';

export class MapPagedData<T> {
  data = new Array<T>();
  page = new MapPage();
}
