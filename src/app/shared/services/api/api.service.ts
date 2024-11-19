import { HttpClient, HttpErrorResponse, HttpHeaderResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  private setHeaders(): HttpHeaders  {
    const token = localStorage.getItem('token');  // Replace 'token' with the correct key if necessary


    const headersConfig = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Headers': 'Authorization,Content-Type',
      'Access-Control-Max-Age': '3600',

    };
    if (token) {
      headersConfig['Authorization'] = `Bearer ${token}`;  // Bearer token format
    }
    return new HttpHeaders(headersConfig);
  }

  public static formatErrors(error: HttpErrorResponse) {
    return throwError(error);
  }

  postWithoutModelCapabilities(endpoint: string, payload: any) {

    const apiURL = `https://abc/${endpoint}`;
    
    const headers = this.setHeaders();
    return this.http.post(apiURL, payload, { headers }).pipe(
      catchError(ApiService.formatErrors));
  }

  postWithoutModel(endpoint: string, request: any): Observable<any> {
    const apiURL = `http://192.168.1.29:3000/automate/${localStorage.getItem('id')}/${endpoint}`;
    const headers = this.setHeaders();

    console.log(request);
    
  
    return this.http.post<any>(apiURL, request, { headers })
      .pipe(
        catchError(error => {
          console.error('Error during HTTP request:', error);
          return throwError(() => new Error('Failed to make request. Please try again.'));
        })
      );
    }

    getWithoutModal(endpoint: string): Observable<any>{
      const apiURL = `http://192.168.1.29:3000/automate/${localStorage.getItem('id')}/${endpoint}`;
    const headers = this.setHeaders();
    return this.http.get<any>(apiURL, { headers })
    .pipe(
      catchError(error => {
        console.error('Error during HTTP request:', error);
        return throwError(() => new Error('Failed to make request. Please try again.'));
      })
    );
    
    }


  private formatErrors(error: any) {
    // Handle error and return an observable
    console.error('API Error:', error);
    return throwError(error);  // Returns the error as observable
  }
}
