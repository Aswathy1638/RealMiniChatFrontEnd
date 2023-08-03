import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LogsService {
  private baseUrl = 'https://localhost:7298/api/Logs';
  constructor(private http: HttpClient) { 
      }
      getLogs(startTime?: string, endTime?: string): Observable<any[]> {
        // If startTime and endTime are not provided, set them to default values (last 5 mins)
        if (!startTime || !endTime) {
          const defaultEndTime = new Date().toISOString();
          const defaultStartTime = new Date();
          defaultStartTime.setMinutes(defaultStartTime.getMinutes() - 5);
          startTime = defaultStartTime.toISOString();
          endTime = defaultEndTime;
        }

    const token = localStorage.getItem('jwtToken');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
    let params = new HttpParams();

    if (startTime) {
      params = params.set('startTime', startTime.toString());
    }

    if (endTime) {
      params = params.set('endTime', endTime.toString());
    }

    return this.http.get<any[]>(this.baseUrl,{headers:headers,params:params}).pipe(
      map((response: any) => response.logs) // Extract the 'messages' array from the response
    );;;
    
  }
  }
  /* getLogs():Observable<any[]>
{
  const token = localStorage.getItem('jwtToken');
  if (!token) {
    throw new Error('JWT token not found.');
  }
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });
  return this.http.get<any[]>(`${this.baseUrl}`, { headers });
}*/


