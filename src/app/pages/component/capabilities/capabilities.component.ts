import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApplicationDataService } from '../../../shared/services/applicationData/application-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-capabilities',
  templateUrl: './capabilities.component.html',
  styleUrls: ['./capabilities.component.scss']
})
export class CapabilitiesComponent {
  public myForm: FormGroup;
  public showSuccessAlert: boolean = false;
  public selectedItem: '';

  constructor(
    private fb: FormBuilder,
    private applicationDataService: ApplicationDataService,
    private router: Router
  ){

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
    if (this.myForm.valid) {
      this.showSuccessAlert = true
      
      setTimeout(() => {
        this.router.navigateByUrl('pages/instructions')
      }, 1000)
    // this.accountService.postCapabilities({
    //   capabilities: {
    //     platformName: "Android",
    //     app: "/home/codingnebula/Downloads/app-debug-v12.apk",
    //     appPackage: "com.example.app",
    //     automationName: "UIAutomator2",
    //     deviceName: "Samsung",
    //     noReset: true,
    //     ignoreHiddenApiPolicyError: true,
    //     newCommandTimeout: 1200000
    //   }
    // }).subscribe(
    //   (response) => {
        
    //   },
    //   (error) => {
    //     console.error('API Error:', error);
    //   }
    // );
      // this.myForm.reset();
      this.applicationDataService.setData('capabilities' ,this.myForm.value);
    }
  }
}
