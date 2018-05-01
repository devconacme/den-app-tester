import { Injectable } from '@angular/core';

@Injectable()
export class SystemEvents {
    public LOGIN: string = 'user:login';
    public LOGOUT: string = 'user:logout';
    public SIGNUP: string = 'user:signup';
    public ERROR: string = 'msg:error';
    public SUCCESS: string = 'msg:success';
    public LOADER_SHOW: string = 'loader:show';
    public LOADER_CLOSE: string = 'loader:close';
    
}