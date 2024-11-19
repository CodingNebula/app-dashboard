import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private apiService: ApiService) { }

  postCapabilities(payload: any){
    const endpoint = 'post-capabilities'    
    return this.apiService.postWithoutModelCapabilities(endpoint, payload)
  }

  postApplication(payload: any): Observable<any> {
    return this.apiService.postWithoutModel('appDetails', payload).pipe(
      map(applicationResponse => {
        // Check if the response is valid, and return it
        if (applicationResponse) {
          return applicationResponse; // Transformation logic (if needed)
        } else {
          // In case of an invalid response, throw an error
          throw new Error('Invalid response');
        }
      }),
      catchError(error => {
        // Handle the error here
        console.error('Error during the application submission:', error);
        // Return a user-friendly error message or rethrow it
        return throwError(() => new Error('Failed to submit application. Please try again.'));
      })
    );
  }

  postTestCases(payload: any): Observable<any> {
    return this.apiService.postWithoutModel('saveTestCases', payload).pipe(
      map(applicationResponse => {
        // Check if the response is valid, and return it
        if (applicationResponse) {
          return applicationResponse; // Transformation logic (if needed)
        } else {
          // In case of an invalid response, throw an error
          throw new Error('Invalid response');
        }
      }),
      catchError(error => {
        // Handle the error here
        console.error('Error during the application submission:', error);
        // Return a user-friendly error message or rethrow it
        return throwError(() => new Error('Failed to submit application. Please try again.'));
      })
    );
  }

  getTestCases(){
    return this.apiService.getWithoutModal('testCase').pipe(
      map(applicationResponse => {
        // Check if the response is valid, and return it
        if (applicationResponse) {
          return applicationResponse; // Transformation logic (if needed)
        } else {
          // In case of an invalid response, throw an error
          throw new Error('Invalid response');
        }
      }),
      catchError(error => {
        // Handle the error here
        console.error('Error during the application submission:', error);
        // Return a user-friendly error message or rethrow it
        return throwError(() => new Error('Failed to submit application. Please try again.'));
      })
    );
  }
}
