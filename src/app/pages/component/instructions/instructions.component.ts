import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { InstructionsDialogComponent } from '../instructions-dialog/instructions-dialog.component';
import {NbDialogRef, NbDialogService} from '@nebular/theme';
import { ApplicationDataService } from '../../../shared/services/applicationData/application-data.service';
import { AccountService } from '../../../shared/services/account/account.service';
import { AfterViewInit, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import { NbPopoverDirective } from '@nebular/theme';
import {FilterModelComponent} from "../../signout/filter-model/filter-model.component";
import {DeleteDialogComponent} from "../delete-dialog/delete-dialog.component";


@Component({
  selector: 'ngx-instructions',
  templateUrl: './instructions.component.html',
  styleUrls: ['./instructions.component.scss']
})
export class InstructionsComponent implements OnDestroy, AfterViewInit {


  @ViewChild(NbPopoverDirective) popover: NbPopoverDirective;

  @ViewChild('list', { read: TemplateRef }) templateList: TemplateRef<any>;
  public dialog:NbDialogRef<any>;
  public applicationDataArr: any[] = [];
  public appDetails: any;
  public appName: any;


  constructor(
    private dialogService: NbDialogService,
    private applicationDataService: ApplicationDataService,
    protected router: Router,
    private accountService: AccountService
  ) {

  }







  textContent = 'Hello World';

  items = [];

  interval: any;

  stopRuntimeChange() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  changeComponent(component) {
    this.popover.content = component;
    this.popover.rebuild();
  }

  changeTrigger(trigger) {
    this.popover.trigger = trigger;
    this.popover.rebuild();
  }

  changePlacement(placement) {
    this.popover.position = placement;
    this.popover.rebuild();
  }

  startRuntimeChange() {
    if (!this.interval) {
      this.interval = setInterval(() => {
        const random = this.items[Math.floor(Math.random() * this.items.length)];
        this.changeComponent(random);
      }, 2000);
    }
  }

  ngAfterViewInit() {
    this.items = [
      this.templateList,
      this.textContent,
    ];
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }

  ngOnInit() {
    this.appDetails = this.applicationDataService.getData();

    this.getInstructions();

    this.appName = localStorage.getItem('app_name');
  }





  openDeleteDailog(item){


    const dialogRef = this.dialogService.open(DeleteDialogComponent, {
      hasBackdrop: true,
      closeOnBackdropClick: true,
      closeOnEsc: true,
      context: {itemToDelete: item}
    });


    dialogRef.onClose.subscribe((result) => {
      debugger
      if (result) {
        if (result.confirmed) {

          // this.saveApplicationData(appDetails);
          let app_id = localStorage.getItem('app_id');


            this.deleteInstruction(app_id, result.data.insId)


        }
      }
    });

  }

  openDialog(item ?:any) {
    // Open the dialog and pass data to it using 'context'
    const dialogRef = this.dialogService.open(InstructionsDialogComponent, {
      context : {itemToEdit: item}
    });

    // Get the result (data) when the dialog closes
    dialogRef.onClose.subscribe((result) => {
      if (result) {
        if (result.confirmed) {

          //   const appDetails = {
          //     app_name: req.body.appName,
          //     user_id: userId,
          //     platform: req.body.platform,
          //     test_case_results: req.body.test_case_results,
          //     extra: JSON.stringify(req.body.extra),
          // }

          const instructionDetails: any = {
            name: result.data.formValue.normal_name, // Name of the instruction provided by the user
            elementName: result.data.formValue.elem_name, // Frontend-specific element name
            backendName: result.data.formValue.actions, // Server-specific backend name for the instruction
            extra: {}, // Additional metadata or information (optional)
          }
          console.log(instructionDetails);

          // this.saveApplicationData(appDetails);
          let app_id = localStorage.getItem('app_id');
          if (result.data.isEdit) {
            app_id = `${app_id}/${result.data.insId}`;
            this.putInstruction(app_id, instructionDetails);
          } else {
            this.postInstruction(app_id, instructionDetails);
          }
          this.applicationDataService.setData('instructions', this.applicationDataArr);
          // this.router.navigateByUrl('pages/capabilities');
        }
      }
    });
  }

  postInstruction(app_id, instructionDetails) {
    this.accountService.postInstruction(app_id, instructionDetails).subscribe((response) => {
      if (response) {

        // this.applicationDataArr.push(response[0]); // Assuming the response contains the newly saved item
        this.getInstructions();
        // this.applicationDataService.setData('instructions', response[0]);
      }
    }, (error) => {
      console.error('Error saving test case:', error);
    });
  }

  putInstruction(app_id, instructionDetails) {
    this.accountService.putInstruction(app_id, instructionDetails).subscribe((response) => {
      if (response) {

    this.getInstructions();
      }
    }, (error) => {
      console.error('Error saving test case:', error);
    });
  }

  deleteInstruction(app_id, insId) {
    debugger
    this.accountService.deleteInstruction(app_id, insId).subscribe((response) => {
      if (response) {

        this.getInstructions();
      }
    }, (error) => {
      console.error('Error saving test case:', error);
    });
  }

  saveInstructions() {
    this.router.navigateByUrl('pages/application');
  }

  getInstructions() {
    const app_id = localStorage.getItem('app_id');
    this.accountService.getInstruction(app_id).subscribe((data) => {
      if (data && data.length > 0) {
        console.log(data);

        data.forEach(item => {
          if (item.element_name) {
            let resp = item.element_name;

            if (typeof resp === 'string') {
              item.element_name = resp.split(',').map(el => el.trim().replace(/["{}]/g, ''));
            } else if (Array.isArray(resp)) {
              item.element_name = resp.map(el => el.replace(/["{}]/g, '').trim());
            }

            console.log(item);
          }
        });

        console.log(data);

        this.applicationDataArr = data;
        this.applicationDataService.setData('instructions', data);
      }
    })
  }

  toTemplate() {
    this.router.navigateByUrl('pages/template');
  }
}
