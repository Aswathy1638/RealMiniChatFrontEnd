import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl='https://localhost:7298/api/Users';
  userList!: any[];
  constructor(private http:HttpClient) 
  {

   }
 /* registerUser(name:string,email:string,password:string){
    const url = `${this.apiUrl}/register`;
    const data={email,password};
    return this.http.post(this.apiUrl,data);
      } */

      registerUser(name: string, email: string, password: string): Observable<any> {
        const url = `${this.apiUrl}/register`;
        const data = { name, email, password };
    
        return this.http.post<any>(url, data).pipe(
          catchError((error) => {
            // Handle and log errors here if needed
            return throwError(error);
          })
        );
      }
      loginUser(email: string, password: string) {
        const url = `${this.apiUrl}/login`;
        const body = { name,email, password };
        return this.http.post<any>(url, body);
}
GetUserList():Observable<any[]>
{
  const token = localStorage.getItem('jwtToken');
  if (!token) {
    throw new Error('JWT token not found.');
  }
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });
  return this.http.get<any[]>(`${this.apiUrl}`, { headers });
}

}
