import { AfterViewInit, Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';


@Component({
  selector: 'ngx-test-cases-dialog',
  templateUrl: './test-cases-dialog.component.html',
  styleUrls: ['./test-cases-dialog.component.scss']
})
export class TestCasesDialogComponent implements OnInit {
  public myForm: FormGroup;
  public selectedItems: string[] = [];
  public context: any;
  public item: any;
  public editing: boolean = true;
  public endpoints: any[] = [];
  public debugValue: any[];
  public isSubmit: boolean = false;
  public selectedEndpoint: string = '';
  constructor(private dialogRef: NbDialogRef<TestCasesDialogComponent>, private fb: FormBuilder){

    this.endpoints = ['propay', 'pps', 'worldnet'];
    this.debugValue = [true , false];
  }

  ngOnInit() {
    this.myForm = this.fb.group({
      terminalName: ['', [Validators.required]],
      endpoint: ['', [Validators.required]],
    });


    if (this.item) {
      this.selectedEndpoint = this.item.endpoint;
      this.myForm.patchValue({
        terminalName: this.item?.Name,
        endpoint: this.item?.TerminalConfiguration.endpoint.provider,
      });

      this.selectedEndpoint = this.item.TerminalConfiguration.endpoint.provider
      this.addControls(this.item.TerminalConfiguration.endpoint.provider, false);

      if (this.item.TerminalConfiguration.endpoint.provider === 'worldnet') {
        this.myForm.patchValue({
          api: this.item.TerminalConfiguration.endpoint.apiKey,
          gatewayurl: this.item.TerminalConfiguration.endpoint.gatewayUrl,
          worldnetId: this.item.TerminalConfiguration.endpoint.worldnetTerminalID,
        });
      } else if (this.item.TerminalConfiguration.endpoint.provider === 'propay') {
        this.myForm.patchValue({
          debug: this.item.TerminalConfiguration.endpoint.debug,
          flavor: this.item.TerminalConfiguration.endpoint.flavor,
          certstr: this.item.TerminalConfiguration.endpoint.certStr,
          x509Cert: this.item.TerminalConfiguration.endpoint.x509Cert,
          accountNum: this.item.TerminalConfiguration.endpoint.accountNum,
          gatewayUrlPropay: this.item.TerminalConfiguration.endpoint.gatewayUrl,
          terminalId: this.item.TerminalConfiguration.endpoint.terminalId,
          xmlApiBaseUrl: this.item.TerminalConfiguration.endpoint.xmlApiBaseUrl,
          classMetaKey: this.item.TerminalConfiguration.endpoint.CLASS_META_KEY,
          jsonApiBaseUrl: this.item.TerminalConfiguration.endpoint.jsonApiBaseUrl,
          ServerDateFormat: this.item.TerminalConfiguration.endpoint.serverDateFormat,
          splitfundingAccountNum: this.item.TerminalConfiguration.endpoint.splitfundingAccountNum,
        });
      } else if (this.item.TerminalConfiguration.endpoint.provider === 'pps') {
        this.myForm.patchValue({
          Debug: this.item.TerminalConfiguration.endpoint.debug,
          Flavor: this.item.TerminalConfiguration.endpoint.flavor,
          secret: this.item.TerminalConfiguration.endpoint.secret,
          logLevel: this.item.TerminalConfiguration.endpoint.logging.logLevel,
          remoteLoggingEnabled: this.item.TerminalConfiguration.endpoint.logging.remoteLoggingEnabled,
          password: this.item.TerminalConfiguration.endpoint.password,
          username: this.item.TerminalConfiguration.endpoint.username,
          gatewayURL: this.item.TerminalConfiguration.endpoint.gatewayUrl,
          merchantId: this.item.TerminalConfiguration.endpoint.merchantId,
          consumerKey: this.item.TerminalConfiguration.endpoint.consumerKey,
          consumerSecret: this.item.TerminalConfiguration.endpoint.consumerSecret,
          serverDateFormatPPS: this.item.TerminalConfiguration.endpoint.serverDateFormat
        });
      }

    }
  }

  addControls(endpoint,addNew) {

    if(endpoint === 'worldnet') {
      this.myForm.addControl('api', this.fb.control('', [Validators.required]));
      this.myForm.addControl('gatewayurl', this.fb.control('', [Validators.required]));
      this.myForm.addControl('worldnetId', this.fb.control('', [Validators.required]));
    } else if(endpoint === 'propay') {
      this.myForm.addControl('debug', this.fb.control('', [Validators.required]));
      this.myForm.addControl('flavor', this.fb.control('', [Validators.required]));
      this.myForm.addControl('certstr', this.fb.control('', [Validators.required]));
      this.myForm.addControl('x509Cert', this.fb.control('', [Validators.required]));
      this.myForm.addControl('accountNum', this.fb.control('', [Validators.required]));
      this.myForm.addControl('gatewayUrlPropay', this.fb.control('', [Validators.required]));
      this.myForm.addControl('terminalId', this.fb.control('', [Validators.required]));
      this.myForm.addControl('xmlApiBaseUrl', this.fb.control('', [Validators.required]));
      this.myForm.addControl('classMetaKey', this.fb.control('', [Validators.required]));
      this.myForm.addControl('jsonApiBaseUrl', this.fb.control('', [Validators.required]));
      this.myForm.addControl('ServerDateFormat', this.fb.control('', [Validators.required]));
      this.myForm.addControl('splitfundingAccountNum', this.fb.control('', [Validators.required]));
    } else if (endpoint === 'pps') {
      this.myForm.addControl('Debug', this.fb.control('', [Validators.required]));
      this.myForm.addControl('Flavor', this.fb.control('', [Validators.required]));
      this.myForm.addControl('secret', this.fb.control('', [Validators.required]));
      this.myForm.addControl('logLevel', this.fb.control('', [Validators.required]));
      this.myForm.addControl('remoteLoggingEnabled', this.fb.control('', [Validators.required]));
      this.myForm.addControl('password', this.fb.control('', [Validators.required]));
      this.myForm.addControl('username', this.fb.control('', [Validators.required]));
      this.myForm.addControl('gatewayURL', this.fb.control('', [Validators.required]));
      this.myForm.addControl('merchantId', this.fb.control('', [Validators.required]));
      this.myForm.addControl('consumerKey', this.fb.control('', [Validators.required]));
      this.myForm.addControl('consumerSecret', this.fb.control('', [Validators.required]));
      this.myForm.addControl('serverDateFormatPPS', this.fb.control('', [Validators.required]));
    }

    if (addNew) {
      this.removeFormControls(endpoint)
    }

  }

  removeFormControls(endpoint) {
    if (endpoint === 'worldnet') {

      // PPS controls
      this.myForm.removeControl('DebugPPS');
      this.myForm.removeControl('FlavorPPS');
      this.myForm.removeControl('secret');
      this.myForm.removeControl('logLevel');
      this.myForm.removeControl('remoteLoggingEnabled');
      this.myForm.removeControl('password');
      this.myForm.removeControl('username');
      this.myForm.removeControl('gatewayUrlPPS');
      this.myForm.removeControl('merchantId');
      this.myForm.removeControl('consumerKey');
      this.myForm.removeControl('consumerSecret');
      this.myForm.removeControl('serverDateFormatPPS');

      // Propay controls
      this.myForm.removeControl('debug');
      this.myForm.removeControl('flavor');
      this.myForm.removeControl('certstr');
      this.myForm.removeControl('accountNum');
      this.myForm.removeControl('gatewayUrlPropay');
      this.myForm.removeControl('terminalId');
      this.myForm.removeControl('xmlApiBaseUrl');
      this.myForm.removeControl('classMetaKey');
      this.myForm.removeControl('jsonApiBaseUrl');
      this.myForm.removeControl('serverDateFormat');
      this.myForm.removeControl('splitfundingAccountNum');
    } else if(endpoint === 'propay') {

      // PPS controls
      this.myForm.removeControl('DebugPPS');
      this.myForm.removeControl('FlavoPPS');
      this.myForm.removeControl('secret');
      this.myForm.removeControl('logLevel');
      this.myForm.removeControl('remoteLoggingEnabled');
      this.myForm.removeControl('password');
      this.myForm.removeControl('username');
      this.myForm.removeControl('gatewayUrlPPS');
      this.myForm.removeControl('merchantId');
      this.myForm.removeControl('consumerKey');
      this.myForm.removeControl('consumerSecret');
      this.myForm.removeControl('serverDateFormatPPS');

      // Worldnet controls
      this.myForm.removeControl('api');
      this.myForm.removeControl('gatewayurl');
      this.myForm.removeControl('worldnetId');
    } else if (endpoint === 'pps') {

      // Worldnet controls
      this.myForm.removeControl('api');
      this.myForm.removeControl('gatewayurl');
      this.myForm.removeControl('worldnetId');

      // Propay controls
      this.myForm.removeControl('debug');
      this.myForm.removeControl('flavor');
      this.myForm.removeControl('certstr');
      this.myForm.removeControl('accountNum');
      this.myForm.removeControl('gatewayUrlPropay');
      this.myForm.removeControl('terminalId');
      this.myForm.removeControl('xmlApiBaseUrl');
      this.myForm.removeControl('classMetaKey');
      this.myForm.removeControl('jsonApiBaseUrl');
      this.myForm.removeControl('serverDateFormat');
      this.myForm.removeControl('splitfundingAccountNum');
    }
  }



  onTestCaseChange(selectedItems: any) {
    // Update the testCases form control whenever the selection changes
    this.myForm.get('endpoint')?.setValue(selectedItems);
    this.selectedEndpoint = selectedItems;
    const fieldCount = Object.keys(this.myForm.controls).length
    this.addControls(this.selectedEndpoint, fieldCount !== 2)
  }

  onValueChange(val) {
    this.selectedEndpoint === 'propay' ?
      this.myForm.get('debug')?.setValue(val) : this.myForm.get('Debug')?.setValue(val);
  }

  onSubmit() {
    this.isSubmit = true;
    const formValues = this.myForm.value;
  
    const hasEmptyField = Object.values(formValues).some(value => typeof value === 'string' && value.trim() === '');
  
    // if (hasEmptyField) {
  
      // return; 
    // }


  
    // if (this.myForm.valid) {
      this.dialogRef.close({ confirmed: true, data: formValues });
    // }
  }
  

  close() {
    this.dialogRef.close({confirmed: false});
  }
}
