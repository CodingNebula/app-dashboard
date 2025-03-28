import { HttpClient, HttpErrorResponse, HttpHeaderResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { error } from 'console';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  private setHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');  // Replace 'token' with the correct key if necessary


    const headersConfig = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Headers': 'Authorization,Content-Type',
      'Access-Control-Max-Age': '3600',
    };
    if (token) {
      headersConfig['Authorization'] = `Basic ${JSON.parse(token)}`;  // Bearer token format
    }
    return new HttpHeaders(headersConfig);
  }

  public static formatErrors(error: HttpErrorResponse) {
    return throwError(error);
  }

  postWithoutModelCapabilities(endpoint: string, payload: any) {

    const apiURL = `${environment.api_url}/${endpoint}`;

    const headers = this.setHeaders();
    return this.http.post(apiURL, payload, { headers }).pipe(
      catchError(ApiService.formatErrors));
  }

  postWithoutModel(endpoint: string, request: any): Observable<any> {
    const apiURL = `${environment.api_url}/${endpoint}`;
    const headers = this.setHeaders();

    return this.http.post<any>(apiURL, request, { headers })
      .pipe(
        catchError(error => {
          console.error('Error during HTTP request:', error);
          return throwError(() => new Error('Failed to make request. Please try again.'));
        })
      );
  }

  getRefreshTokenWithoutModal(endpoint: string): Observable<any> {
    const apiURL = `${environment.api_url}/${localStorage.getItem('id')}/${endpoint}`;

    const token = localStorage.getItem('accessToken');  // Replace 'token' with the correct key if necessary
    const refreshToken = localStorage.getItem('refreshToken');


    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Headers': 'Authorization,Content-Type',
      'Access-Control-Max-Age': '3600',

    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;  // Bearer token format
    }
    if(refreshToken){
      headers["refresh-token"] = refreshToken;
    }

    return this.http.get<any>(apiURL, { headers })
      .pipe(
        catchError(error => {
          console.error('Error during HTTP request:', error);
          return throwError(() => new Error('Failed to make request. Please try again.'));
        })
      );

  }

  getWithoutModal(endpoint: string): Observable<any> {
    const apiURL = `${environment.api_url}/${endpoint}`;
    const headers = this.setHeaders();
    return this.http.get<any>(apiURL, { headers })
      .pipe(
        catchError(error => {
          console.error('Error during HTTP request:', error);
          return throwError(() => new Error('Failed to make request. Please try again.'));
        })
      );

  }

  getAllReports(): Observable<any> {
    const apiURL = `${environment.api_url}/${localStorage.getItem('id')}/get_all_report`;
    const headers = this.setHeaders();
    return this.http.get<any>(apiURL, { headers })
      .pipe(
        catchError(error => {
          console.error('Error during HTTP request:', error);
          return throwError(() => new Error('Failed to make request. Please try again.'));
        })
      );
  }
    deleteWithoutModal(endpoint: string, id: string): Observable<any>{
      const apiURL = `${environment.api_url}/${localStorage.getItem('id')}/${endpoint}/${id}`;
    const headers = this.setHeaders();
    return this.http.delete<any>(apiURL, { headers })
    .pipe(
      catchError(error => {
        console.error('Error during HTTP request:', error);
        return throwError(() => new Error('Failed to make request. Please try again.'));
      })
    );

    }

    updateWithoutModal(endpoint: string, request: any): Observable<any>{
      const apiUrl = `${environment.api_url}/${endpoint}`;
      const headers = this.setHeaders();
      return this.http.put<any>(apiUrl, request, {headers})
      .pipe(
        catchError(error => {
          console.error('Error during http request:', error);
          return throwError(() => new Error('Failed to make request. Please try again.'))
        })
      )
    }


  private formatErrors(error: any) {
    // Handle error and return an observable
    console.error('API Error:', error);
    return throwError(error);  // Returns the error as observable
  }
}
