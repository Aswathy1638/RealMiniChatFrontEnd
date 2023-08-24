import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders, HttpParams} from '@angular/common/http'
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private apiUrl='https://localhost:7298/api/Messages';
  constructor(private http:HttpClient) { }

  getConversationHistory(userId: string, before: Date, count: number, sort: string):Observable<any[]>{
    const url=`${this.apiUrl}/${userId}`

    const jwtToken = localStorage.getItem('jwtToken');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${jwtToken}`
    });
    const params = new HttpParams()
    // .set('userId',userId)
      .set('count', count.toString())
      .set('sort', sort);
    return this.http.get<any[]>(url,{ headers, params });
  }


  sendNewMessage(receiverId: string, content: string): Observable<any> {
    const body = { receiverId, content };
    const token = localStorage.getItem('jwtToken');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    console.log(receiverId);
    return this.http.post<any>(this.apiUrl, body, httpOptions);
  }
  updateMessage(messageId: number, updatedMessage: any): Observable<any> {
    const token = localStorage.getItem('jwtToken');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };

    const url = `${this.apiUrl}/${messageId}`;
    return this.http.put<any>(url, updatedMessage, httpOptions);
  }
  deleteMessage(messageId: number): Observable<any> {
    const token = localStorage.getItem('jwtToken');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    return this.http.delete(`${this.apiUrl}/${messageId}`, httpOptions);
  }

  searchMessages(query: string): Observable<any[]> {
    const token = localStorage.getItem('jwtToken');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    return this.http.get<any[]>(`${this.apiUrl}/search?query=${query}`,httpOptions);
  }

}
