import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApplicationDataService } from '../../../shared/services/applicationData/application-data.service';
import { Router } from '@angular/router';
import { AccountService } from '../../../shared/services/account/account.service';

@Component({
  selector: 'ngx-capabilities',
  templateUrl: './capabilities.component.html',
  styleUrls: ['./capabilities.component.scss']
})
export class CapabilitiesComponent {
  public myForm: FormGroup;
  public showSuccessAlert: boolean = false;
  public selectedItem: '';
  public appDetails: any;
  public appName: any;
  public submitted: boolean = false;

  constructor(
    private fb: FormBuilder,
    private applicationDataService: ApplicationDataService,
    private router: Router,
    private accountService: AccountService,
  ) {

  }

  ngOnInit() {
    // Create the form with FormBuilder



    this.myForm = this.fb.group({
      platform: ['', [Validators.required]],
      app: ['', [Validators.required]],
      package: ['com.example.app', [Validators.required]],
      automation: ['', [Validators.required]],
      device: ['', [Validators.required]],
      noReset: ['True', [Validators.required, this.noResetValidator]],
      hiddenApp: ['True', [Validators.required, this.ignoreHiddenValidator]],
      timeout: ['1200000', [Validators.required]],
    });

    this.myForm.get('platform').valueChanges.subscribe(platform => {
      if (platform === 'Android') {
        this.myForm.get('automation').setValue('UIAutomator2');
      }
      else {
        this.myForm.get('automation').setValue('');
      }
    })

    this.appDetails = this.applicationDataService.getData();


    this.appName = localStorage.getItem('app_name');

  }

  noResetValidator(control) {
    if (control.value === 'False') {
      return { invalidValue: true };
    }
    return null;
  }

  ignoreHiddenValidator(control) {
    if (control.value === 'False') {
      return { invalidValue: true };
    }
    return null;
  }


  onSubmit() {
    
    this.submitted = true;

    if (this.myForm.valid) {

      const app_id = localStorage.getItem("app_id");

      const capabilities = { app_id: app_id, capabilities: this.myForm.value };

      localStorage.setItem("app_capa", JSON.stringify(capabilities));

      console.log('app-capa');
      


      this.accountService.updateCapabilities(app_id,
        {
          extra: {
            capabilities: this.myForm.value
          },
          name:this.appDetails?.app_details?.app_name
        }).subscribe(
        (response) => {
          if(response){

            this.showSuccessAlert = true
            
            setTimeout(() => {
              this.router.navigateByUrl('pages/instructions')
              
            }, 1000)
          }
        },
        (error) => {
          console.error('API Error:', error);
        }


      );
      // this.myForm.reset();
      this.applicationDataService.setData('capabilities', this.myForm.value);
    }
  }
}
