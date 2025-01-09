import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private apiService: ApiService) { }

  launchApp(payload: any, id) {
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

  getTestCases(id: any) {
    return this.apiService.getWithoutModal(`app_test_case/${id}`).pipe(
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

  getApplication() {
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

  deleteTestCase(id: string) {
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


  deleteTemplate(id: string) {

    return this.apiService.deleteWithoutModal('workflow', id).pipe(
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

  updateTestCaseName(id: string, request: any) {
    return this.apiService.updateWithoutModal(id, request).pipe(
      map(resp => {
        if (resp) {
          return resp;
        }
        else {
          throw new Error('Invalid Response');
        }
      }),
      catchError(error => {
        console.error('Error Updating test case:', error);
        return throwError(() => new Error('Failed to update test case. Please try again.'))

      })
    )
  }

  postInstruction(id: any, request: any) {
    return this.apiService.postWithoutModel(`instruction/${id}`, request).pipe(
      map(resp => {
        if (resp) {
          return resp;
        }
        else {
          throw new Error('Invalid Response');
        }
      }
      ),
      catchError(error => {
        console.error('Error: ', error);
        return throwError(() => new Error('Failed. Please try again.'))

      })
    )
  }

  putInstruction(id: any, request: any) {
    return this.apiService.updateWithoutModal(`instruction/${id}`, request).pipe(
      map(resp => {
          if (resp) {
            return resp;
          }
          else {
            throw new Error('Invalid Response');
          }
        }
      ),
      catchError(error => {
        console.error('Error: ', error);
        return throwError(() => new Error('Failed. Please try again.'))

      })
    )
  }

  deleteInstruction(id: any, request: any) {
    return this.apiService.deleteWithoutModal(`instruction/${id}`, request).pipe(
      map(resp => {
          if (resp) {
            return resp;
          }
          else {
            throw new Error('Invalid Response');
          }
        }
      ),
      catchError(error => {
        console.error('Error: ', error);
        return throwError(() => new Error('Failed. Please try again.'))

      })
    )
  }

  postPageName(request: any) {
    return this.apiService.postWithoutModel(`page`, request).pipe(
      map(resp => {
        if (resp) {
          return resp;
        }
        else {
          throw new Error('Invalid Response');
        }
      }
      ),
      catchError(error => {
        console.error('Error: ', error);
        return throwError(() => new Error('Failed. Please try again.'))

      })
    )
  }

  postTemplateName(request: any) {
    return this.apiService.postWithoutModel(`workflow`, request).pipe(
      map(resp => {
        if (resp) {
          return resp;
        }
        else {
          throw new Error('Invalid Response');
        }
      }
      ),
      catchError(error => {
        console.error('Error: ', error);
        return throwError(() => new Error('Failed. Please try again.'))

      })
    )
  }

  postTemplates(id: string, request: any) {
    return this.apiService.postWithoutModel(`workflow/${id}`, request).pipe(
      map(resp => {
        if (resp) {
          return resp;
        }
        else {
          throw new Error('Invalid Response');
        }
      }
      ),
      catchError(error => {
        console.error('Error: ', error);
        return throwError(() => new Error('Failed. Please try again.'))

      })
    )
  }

  postPageInstructions(request: any) {
    return this.apiService.postWithoutModel(`page_mapper/${localStorage.getItem('app_id')}`, request).pipe(
      map(resp => {
        if (resp) {
          return resp;
        }
        else {
          throw new Error('Invalid Response');
        }
      }
      ),
      catchError(error => {
        console.error('Error: ', error);
        return throwError(() => new Error('Failed. Please try again.'))

      })
    )
  }

  updatePageInstructions(id, request: any) {
    return this.apiService.updateWithoutModal(`page_mapper/${localStorage.getItem('app_id')}/${id}`, request).pipe(
      map(resp => {
        if (resp) {
          return resp;
        }
        else {
          throw new Error('Invalid Response');
        }
      }
      ),
      catchError(error => {
        console.error('Error: ', error);
        return throwError(() => new Error('Failed. Please try again.'))

      })
    )
  }

  postReportData(request: any){
    return this.apiService.postWithoutModel(`save_report`, request).pipe(
      map(resp => {
        if(resp){
          return resp;
        }
        else {
          throw new Error('Invalid Response');
        }
      }),
      catchError(error => {
        console.error('Error: ', error);
        return throwError(() => new Error('Failed. Please try again.'))

      })
    )
  }

  getInstruction(id: string){
    return this.apiService.getWithoutModal(`instruction/${id}`).pipe(
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

  getAllPages(id: string){
    return this.apiService.getWithoutModal(`page/${id}`).pipe(
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

  getAllTemplates(id: string){
    return this.apiService.getWithoutModal(`workflow/${id}`).pipe(
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

  updateCapabilities(id, payload){
    return this.apiService.updateWithoutModal(`app_details/${id}`, payload).pipe(
      map(applicationData => {
        if(applicationData){
          return applicationData;
        }
        else{
          throw new Error('Invalid Response');
        }
      })
      ,
    catchError(error => {
      console.error('Error during updating the App Capabilities', error);
      return throwError(() => new Error('Failed to update Capabilities'));
    })
    )
  }

  getCapabilites(id){
    return this.apiService.getWithoutModal(`app_details/${id}`).pipe(
      map(applicationRes => {
        if(applicationRes){
          return applicationRes;
        }
        else{
          throw new Error('Invalid response');
        }
      }
    ),
    catchError(error => {
      console.error('Error during getting the application data', error);
      return throwError(() => new Error('Failed to get application data'));
    })
  )
  }

}
