import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NbDialogRef, NbDialogService, NbPopoverDirective } from '@nebular/theme';
import { NoAppDialogComponent } from '../component/no-app-dialog/no-app-dialog.component';
import { NavigationEnd, Router } from '@angular/router';
import { AccountService } from '../../shared/services/account/account.service';
import { AutomationDataService } from '../../shared/services/automationData/automation-data.service';
import { ApplicationDataService } from '../../shared/services/applicationData/application-data.service';
import { DeleteDialogComponent } from '../component/delete-dialog/delete-dialog.component';
import { Subscription } from 'rxjs';


@Component({
  selector: 'ngx-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.scss']
})
export class ApplicationComponent implements OnInit, OnDestroy {
  public applicationDataArr: any[] = [];
  public instructionsArr: any[] = [];
  public appCapabilities: any;
  public applicationNameAlert: boolean = false;
  public appData: any;
  private dialogRef: NbDialogRef<NoAppDialogComponent>;
  private routerSubscription: Subscription;

  @ViewChild('popover') popover: NbPopoverDirective;

  constructor(
    private dialogService: NbDialogService,
    protected router: Router,
    private accountService: AccountService,
    private automateDataService: AutomationDataService,
    private applicationDataService: ApplicationDataService,
  ) {

  }

  ngOnInit() {

    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (this.dialogRef) {
          this.dialogRef.close();
          this.dialogRef = null;
        }
      }
    });

    this.getApplication();
    this.getCapabilities();
  }

  ngOnDestroy() {
    // Unsubscribe to avoid memory leaks
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  openDialog(type?, item?) {    
    if(this.popover?.isShown){
      this.popover?.hide();
    }
    // Open the dialog and pass data to it using 'context'
    const dialogRef = this.dialogService.open(NoAppDialogComponent, {
      hasBackdrop: true,
      closeOnBackdropClick: true,
      closeOnEsc: true,
      context: { itemToEdit: item, selectedType: type }
    });
    
    // Get the result (data) when the dialog closes
    dialogRef.onClose.subscribe((result) => {
      this.dialogRef = null;
      if (result) {
        if (result.confirmed) {

          const appNameToCheck = result.data.application.replace(/\s+/g, ' ').trim().toLowerCase();

          const appExists = this.applicationDataArr.some(app => app.app_name.trim().toLowerCase() === appNameToCheck);

          if (appExists) {
            this.applicationNameAlert = true;

            setTimeout(() => {
              this.applicationNameAlert = false;
            }, 1000)
          }
          else {
            
            const app_id = result.appId;


            if (result.type === 'edit') {
              const data = {
                name: result.data.application.trim(),
                extra: item?.extra,
              }

              this.updateAppData(app_id, data);

            }

            else {

              const appDetails = {
                appName: result.data.application.trim(),
                platform: result.data.platform,
                test_case_results: null,
                extra: {}
              }

              this.saveApplicationData(appDetails);
              // this.applicationDataService.setData('app_details', appDetails);
            }



          }



        }
      }
    });
  }

  openDeleteDailog(item) {
    if(this.popover?.isShown){
      this.popover?.hide();
    }

    const dialogRef = this.dialogService.open(DeleteDialogComponent, {
      hasBackdrop: true,
      closeOnBackdropClick: true,
      closeOnEsc: true,
      context: { itemToDelete: item },
      autoFocus: false,
    });


    dialogRef.onClose.subscribe((result) => {
      if (result) {
        if (result.confirmed) {
          this.deleteApplication(result.data.appId);
        }
      }
    });
  }

  deleteApplication(id) {

    this.accountService.deleteApplication(id).subscribe((response) => {
      if (response) {
        const updatedApplication = this.applicationDataArr.filter((app) => app.id !== response.id);

        this.applicationDataArr = updatedApplication;

      }
    })
  }

  updateAppData(id, data) {
    this.accountService.updateApplication(id, data).subscribe((response) => {
      if (response) {
        this.getApplication();

      }
    })
  }

  saveApplicationData(data) {


    this.accountService.postApplication(data).subscribe((response) => {
      if (response) {
        // After successful post, update applicationDataArr


        this.applicationDataArr.push(response); // Assuming the response contains the newly saved item
        this.applicationDataService.setData('app_details', response);
        localStorage.setItem('app_id', response?.id);
        localStorage.setItem('app_name', response?.app_name);

        setTimeout(() => {
          this.router.navigateByUrl('pages/capabilities');
        }, 1500)

      }
    }, (error) => {
      console.error('Error saving test case:', error);
    });
  }

  getApplication() {
    this.accountService.getApplication().subscribe((data) => {
      if (data && data.length > 0) {
        this.applicationDataArr = data;

      }
    })
  }

  navigate(item: any) {
    // Store app_id and app_name in localStorage
    localStorage.setItem('app_id', item?.id);
    localStorage.setItem('app_name', item?.app_name);

    // Retrieve and parse the app_capa from localStorage
    const app_capa = localStorage.getItem("app_capa");
    const parsedAppCapa = app_capa ? JSON.parse(app_capa) : null;


    // Initialize instructionsArr
    const app_id = item.id;

    // First API call to get instructions
    this.accountService.getInstruction(app_id).subscribe((instructionData) => {
      this.instructionsArr = [];
      if (instructionData && instructionData.length > 0) {
        this.instructionsArr = instructionData;
      }

      this.accountService.getCapabilites(app_id).subscribe((capabilitiesData) => {
        this.appCapabilities = capabilitiesData;

        if (this.appCapabilities?.extra?.capabilities && this.appCapabilities?.id === item.id && this.instructionsArr.length === 0) {

          this.router.navigateByUrl('pages/instructions');
        } else if (this.appCapabilities?.extra?.capabilities && this.appCapabilities?.id === item.id && this.instructionsArr.length > 0) {

          this.router.navigateByUrl('pages/template');
        } else {
          this.router.navigateByUrl('pages/capabilities', { state: { id: item.id, appName: item?.app_name, platformName: item?.platform } });

          // Log item and store data
          this.applicationDataService.setData('app_details', item);

          localStorage.setItem('app_id', item?.id);
          localStorage.setItem('app_name', item?.app_name);
        }
      }, (error) => {
        console.error('Error fetching capabilities:', error);
      });
    }, (error) => {
      console.error('Error fetching instructions:', error);
    });
  }



  getInstructions() {
    const app_id = localStorage.getItem('app_id');
    this.accountService.getInstruction(app_id).subscribe((data) => {
      if (data && data.length > 0) {
        this.applicationDataArr = data;
        this.applicationDataService.setData('instructions', data)
      }
    })
  }

  getCapabilities() {
    const app_id = localStorage.getItem('app_id');
    if (app_id) {
      this.accountService.getCapabilites(app_id).subscribe((data) => {

      })
    }
  }

  onClose() {
    this.applicationNameAlert = false;
  }

  onPopoverClick(event: MouseEvent) {
    event.stopPropagation()
  }

  editDeleteFunc(item) {
    this.appData = item;
  }
}
