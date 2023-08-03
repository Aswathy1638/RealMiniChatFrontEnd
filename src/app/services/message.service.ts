import { Injectable } from '@angular/core';
import {HttpClient,HttpHeaders} from '@angular/common/http'
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private apiUrl='https://localhost:7298/api/Messages';
  constructor(private http:HttpClient) { }

  getConversationHistory(userId:number):Observable<any[]>{
    const url=`${this.apiUrl}/${userId}`

    const jwtToken = localStorage.getItem('jwtToken');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${jwtToken}`
    });
    return this.http.get<any[]>(url,{ headers: headers });
  }

  sendNewMessage(receiverId: number, content: string): Observable<any> {
    const body = { receiverId, content };
    const token = localStorage.getItem('jwtToken');
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
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

}
