import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';

import { APIService } from '../api/api.service';
import { UserService } from '../dao/user.service';

@Injectable()
export class UserRoleService {
  private className = '_Role';

  constructor(private apiService: APIService, private userService: UserService) {}

  getAllUserRoles(): Promise<any[]> {
    let roles = [];
    return new Promise(async (resolve, reject) => {
      try {
        const query = new this.apiService.Query(this.className);
        query.ascending('name');
        roles = await query.find();
        roles = roles.map(data => data.toJSON());
        resolve(roles);
      } catch (error) {
        // console.log(error);
        reject(error);
      }
    });
  }

  getRoleByObjectId(userRole): Promise<any[]> {
    let role: any;
    return new Promise(async (resolve, reject) => {
      try {
        const roleQuery = new this.apiService.Query(this.className);
        roleQuery.equalTo('name', userRole).first();
        role = await roleQuery.find();
        role = role[0].toJSON();
        resolve(role);
      } catch (error) {
        reject(error);
      }
    });
  }
  getRoleByRoleName(roleName): Promise<any[]> {
    let role: any;
    return new Promise(async (resolve, reject) => {
      try {
        const roleQuery = new this.apiService.Query(this.className);
        roleQuery.equalTo('name', roleName).first();
        role = await roleQuery.find();
        resolve(role);
      } catch (error) {
        reject(error);
      }
    });
  }
  getUserRolesByRoleId(roleId): Promise<any[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const roleQuery = new this.apiService.Query(this.apiService.Role);
        roleQuery.equalTo('objectId', roleId);
        const roles = await roleQuery.first();
        let fetchedRoles = [];
        if (roles) {
          const currentRole = roles.toJSON().objectId;
          fetchedRoles = await roles.getRoles().query().find();
          fetchedRoles.push(roles);
          fetchedRoles = fetchedRoles.map(data => data.toJSON())
            .filter(data => data.objectId !== currentRole)
            .sort((a, b) => a.name.localeCompare(b.name));
        }
        resolve(fetchedRoles);
      } catch (error) {
        reject(error);
      }
    });
  }
  setUserRole(user, role): Promise<any[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const roleQuery = new this.apiService.Query(this.apiService.Role);
        roleQuery.equalTo('name', role);
        const roles = await roleQuery.first();
        roles.getUsers().add(user);

        const SaveRole = await roles.save();
        resolve(roles);
      } catch (error) {
        reject(error);
      }
    });
  }
  updateRole(user, role) {
    return new Promise(async (resolve, reject) => {
      try {
        const roleQuery = new this.apiService.Query(this.apiService.Role);
        roleQuery.equalTo('users', user);
        const roles = await roleQuery.first();
        roles.getUsers().remove(user);
        roles.save();
        const newRole = await this.setUserRole(user, role);
        resolve(newRole);
      } catch (error) {}
    });
  }
}
