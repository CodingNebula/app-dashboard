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
    const endpoint = 'v1/run'    
    return this.apiService.postWithoutModelCapabilities(endpoint, payload)
  }

  postApplication(payload: any): Observable<any> {
    return this.apiService.postWithoutModel('app_details', payload).pipe(
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
    return this.apiService.postWithoutModel('save_test_cases', payload).pipe(
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

  getTestCases(id: any){
    return this.apiService.getWithoutModal(`app_test_case/${id}`).pipe(
      map(applicationResponse => {
        // Check if the response is valid, and return it
        if (applicationResponse) {
          console.log(applicationResponse);
          
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

  getApplication(){
    return this.apiService.getWithoutModal('get-applications').pipe(
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

  deleteTestCase(id: string){
    return this.apiService.deleteWithoutModal('test_case', id).pipe(
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
