import { Injectable } from '@angular/core';
import { Users } from '../model/users';
import { Member } from '../model/member';
import { Admin } from '../model/admin';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  getLoginProfile(): Admin | Member {
    const profile = this.get('loginProfile');
    if(profile !== null && profile !== ''){
      return JSON.parse(profile);
    }
    else {return null;}
  }
  saveLoginProfile(value: Admin | Member){
    return this.set('loginProfile', JSON.stringify(value));
  }
  getAccessToken(){
    return this.get('accessToken');
  }
  saveAccessToken(value: any){
    return this.set('accessToken', value);
  }
  getRefreshToken(){
    return this.get('refreshToken');
  }
  saveRefreshToken(value: any){
    return this.set('refreshToken', value);
  }
  getSessionExpiredDate(){
    return this.get('sessionExpiredDate');
  }
  saveSessionExpiredDate(value: any){
    return this.set('sessionExpiredDate', value);
  }
  private set(key: string, value: any){
    localStorage.setItem(key, value);
  }
  private get(key: string){
    return localStorage.getItem(key);
  }
}
