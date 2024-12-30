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

  constructor(
    private fb: FormBuilder,
    private applicationDataService: ApplicationDataService,
    private router: Router,
    private accountService: AccountService,
  ) {
    console.log(this.router.getCurrentNavigation()?.extras?.state,'------>shared data');

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

    console.log(this.appDetails);

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
    console.log(this.appDetails,'sda')
    if (this.myForm.valid) {
      this.showSuccessAlert = true

      const app_id = localStorage.getItem("app_id");

      const capabilities = { app_id: app_id, capabilities: this.myForm.value };

      localStorage.setItem("app_capa", JSON.stringify(capabilities));


      this.accountService.updateCapabilities(app_id,
        {
          extra: {
            capabilities: this.myForm.value
          },
          name:this.appDetails?.app_details?.app_name
        }).subscribe(
        (response) => {
          console.log(response);

          setTimeout(() => {
            this.router.navigateByUrl('pages/instructions')
          }, 1000)
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
