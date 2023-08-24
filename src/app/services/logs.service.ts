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
          const defaultEndTime = new Date();
          const defaultStartTime = new Date();
          defaultStartTime.setMinutes(defaultStartTime.getMinutes() - 5);
          startTime = defaultStartTime.toString();
          endTime = defaultEndTime.toString();
        }

    const token = localStorage.getItem('jwtToken');
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
    let params = new HttpParams();

    if (endTime) {
      params = params.set('endTime', endTime.toString());
    }
    if (startTime) {
      params = params.set('startTime', startTime.toString());
    }


    return this.http.get<any[]>(this.baseUrl,{headers:headers}).pipe(
      map((response: any) => response.logs) // Extract the 'messages' array from the response
    );;;
    
  }
  }
  


