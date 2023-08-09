import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SocialserviceService {

  constructor(private http:HttpClient) { }
  
  socialLogin(token: string): Observable<any> {
    const body = { id : token }; 
    
    return this.http.post('https://localhost:7298/api/Users/social-login', body);
  }
  
  
}
