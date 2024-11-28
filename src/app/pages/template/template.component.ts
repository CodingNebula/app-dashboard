import { Component } from '@angular/core';

@Component({
  selector: 'ngx-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss']
})
export class TemplateComponent {
  public testCases: any;
  public templates: any[] = [];
  public testCasesArray: any[] = [];

  constructor(){
    this.testCases = {
      "Welcome Happy Flow": {
        description: "A test case for the happy flow scenario",
        test_cases: [
          'click_image',
          'click_next_button'
        ]
      },
      "Permission happy Flow": {
        description: "A test case for the failed login scenario",
        test_cases: [
          'click_image',
          'click_next_button'
        ]
      },
      "Welcome Happy flow": {
        description: "A test case for the happy flow scenario",
        test_cases: [
          'click_image',
          'click_next_button'
        ]
      },
      "Permission Happy Flow": {
        description: "A test case for the failed login scenario",
        test_cases: [
          'click_image',
          'click_next_button'
        ]
      },
      
      "Permission Happy flow": {
        description: "A test case for the failed login scenario",
        test_cases: [
          'click_image',
          'click_next_button'
        ]
      },
      // Add more test cases as needed
    };

    this.testCasesArray = Object.entries(this.testCases);
  }
}

