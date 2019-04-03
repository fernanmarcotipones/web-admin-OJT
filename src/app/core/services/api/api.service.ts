import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';
import { Parse } from 'parse';
import { async } from '@angular/core/testing';
// import * as parseCache from 'parse-cache';

declare var parseCache: any;
@Injectable()
export class APIService {

  public ACL = Parse.ACL;
  public Analytics = Parse.Analytics;
  public Config = Parse.Config;
  public Cloud = Parse.Cloud;
  public Error = Parse.Error;
  public File = Parse.File;
  public GeoPoint = Parse.GeoPoint;
  public Object = Parse.Object;
  public Push = Parse.Push;
  public Query = Parse.Query;
  public Role = Parse.Role;
  public Session = Parse.Session;
  public User = Parse.User;
  public cacheKey = 'DevLiveCache';

  initialize(parseConfig) {
    // memory storage usage:
    parseCache(Parse, this.cacheKey); // {engine: 'memory', count: 1000} are default values and are optional
    Parse.initialize(parseConfig.appId);
    Parse.serverURL = parseConfig.serverURL;
    Parse.masterKey = parseConfig.masterKey;
  }

  // Behavior tracking (for data analysis)
  track(eventName: string, dimensions: Object, options?: Object): Observable<any> {
    const dimensions2 = {};

    for (const key of Object.keys(dimensions)) {
      dimensions2[key] = dimensions[key].toString();
    }

    return Observable.fromPromise(this.Analytics.track(eventName, dimensions2, options));
  }

  // Run custom function
  run(name: string, data?: Object, options?: Object): Observable<any> {
    return Observable.fromPromise(this.Cloud.run(name, data, options));
  }

  // File Upload
  file(file: File): Observable<any> {
    const subject = new Subject();

    if (!file) {
      subject.error('No file selected');
      return subject;
    }

    const name = encodeURIComponent(file.name)
      .replace(/!/g, '%21')
      .replace(/'/g, '%27')
      .replace(/\(/g, '%28')
      .replace(/\)/g, '%29')
      .replace(/\*/g, '%2A')
      .replace(/\+/g, '%20')
      .replace(/\%/g, '');

    new this.File(name, file).save().then(
      res => subject.next(res),
      err => subject.error(err)
    );
    return subject;
  }

  // base64 upload
  base64(base64: string, name?: string): Observable<any> {
    const subject = new Subject();

    name = encodeURIComponent(name || 'base64.png')
      .replace(/!/g, '%21')
      .replace(/'/g, '%27')
      .replace(/\(/g, '%28')
      .replace(/\)/g, '%29')
      .replace(/\*/g, '%2A')
      .replace(/\+/g, '%20')
      .replace(/\%/g, '');

    new this.File(name, { base64: base64 }).save().then(
      res => subject.next(res),
      err => subject.error(err)
    );

    return subject;
  }

  currUserInfo(): Observable<any> {
    return Observable.fromPromise(new Promise(async (res) => {
      const currUser = await this.User.current();
      if (currUser) {
        const query = new this.Query('User');
        query.include('userProfile');
        query.equalTo('objectId', this.User.current().id);

        const programRoleQuery = new this.Query('UserProgramRole');
        programRoleQuery.equalTo('user', this.User.current());
        programRoleQuery.include('user');
        programRoleQuery.include('user.userProfile');
        programRoleQuery.include('role');
        programRoleQuery.include('level');
        programRoleQuery.include('program');
        programRoleQuery.include('region');
        programRoleQuery.include('province');
        programRoleQuery.include('district');
        programRoleQuery.include('municipality');
        programRoleQuery.include('barangay');
        programRoleQuery.include('selected');
        programRoleQuery.include('csoGroup');

        let programRoles;
        programRoles = await programRoleQuery.find();

        programRoles = programRoles.map(result => result.toJSON());

        const user = await query.first();
        const data = user.toJSON();
        data['userProgramRoles'] = programRoles;

        const filteredProgramRoles = programRoles.filter(result => result.selected === true);
        data['activeUserProgramRole'] = filteredProgramRoles[0];
        res(data);
      }
    }));
  }

  getCurrentProgramConfiguration(): Observable<any> {
    return Observable.fromPromise(new Promise(async (res) => {
      const currUser = await this.User.current();
      if (currUser) {
        const programRoleQuery = new this.Query('UserProgramRole');
        programRoleQuery.equalTo('user', this.User.current());
        programRoleQuery.equalTo('selected', true);
        programRoleQuery.include('program');

        const programRoleObject = await programRoleQuery.first();
        const programRole = programRoleObject.toJSON();

        const programQ = new this.Query('Program');
        programQ.equalTo('objectId', programRole.program.objectId);

        const query = new this.Query('ProgramConfiguration');
        query.matchesQuery('program', programQ);

        res(await query.find())
      }

    }));
  }

  // Current user information
  userInfo(): Observable<any> {
    // return Observable.fromPromise(this.User.current().then(user => user.toJSON()));
    return Observable
      .interval(2000)
      .flatMap(async x => {
        const query = new this.Query('User');
        query.include('userProfile');
        query.equalTo('objectId', this.User.current().id);
        return await query.first({ useMasterKey: true });
      })
      .distinctUntilChanged();
  }

  // Current user information
  userSession(): Observable<any> {
    return Observable
      .interval(2000)
      .map(x => this.User.current());
  }

  // Forgot Password
  forget(email: string): Observable<any> {
    return Observable.fromPromise(this.User.requestPasswordReset(email));
  }

  // Login
  login(username: string, password: string): Observable<any> {
    return Observable.fromPromise(this.User.logIn(username, password));
  }

  // Logout
  logout(): Observable<any> {
    return Observable.fromPromise(this.User.logOut());
  }

  // Register
  register(username: string, password: string, attributes?: Object): Observable<any> {
    const object = new this.User();
    object.set('username', username);
    object.set('password', password);

    if (attributes) {
      for (const key of Object.keys(attributes)) {
        object.set(key, attributes[key]);
      }
    }

    return Observable.fromPromise(object.signUp());
  }

  // Query Data
  query(className: string, callback?: Function, isSocket?: boolean): Observable<any> {
    const subject = new Subject();
    const query = new this.Query(className);

    if (callback) {
      callback(query);
    }

    query.find({
      success: res => subject.next({ type: 'result', result: res }),
      error: err => subject.error(err)
    });

    if (isSocket) {
      query.subscribe()
        .on('open', () => subject.next({ type: 'event', event: 'open' }))
        .on('close', () => subject.next({ type: 'event', event: 'close' }))
        .on('create', data => subject.next({ type: 'event', event: 'create', data: data }))
        .on('update', data => subject.next({ type: 'event', event: 'update', data: data }))
        .on('delete', data => subject.next({ type: 'event', event: 'delete', data: data }))
        .on('enter', data => subject.next({ type: 'event', event: 'enter', data: data }))
        .on('leave', data => subject.next({ type: 'event', event: 'leave', data: data }));
    }

    return subject;
  }

  // Add Data
  create(className: string, data: Object): Observable<any> {
    const name = this.Object.extend(className);
    const object = new name();

    for (const key of Object.keys(data)) {
      object.set(key, data[key]);
    }

    if (this.User.current()) {
      object.set('createdBy', this.User.current());
    }
    // console.log('OBJECT', object)
    return Observable.fromPromise(object.save());
  }

  // Modify Data
  update(object: Parse.Object, data: Object): Observable<any> {
    for (const key of Object.keys(data)) {
      const value = data[key] !== null ? data[key] : null;
      object.set(key, value);
    }

    if (this.User.current()) {
      this.User.current().fetch()
      object.set('updatedBy', this.User.current());
    } else {
      object.unset('updatedBy');
    }
    return Observable.fromPromise(object.save({}, { useMasterKey: true }));
  }

  // Delete Data
  delete(object: Parse.Object): Observable<any> {
    return Observable.fromPromise(object.destroy());
  }

  // or using async/await
  async clearCache() {
    await parseCache.clearCache(this.cacheKey);
  }

}
