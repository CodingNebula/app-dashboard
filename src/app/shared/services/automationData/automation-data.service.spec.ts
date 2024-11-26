import { TestBed } from '@angular/core/testing';

import { AutomationDataService } from './automation-data.service';

describe('AutomationDataService', () => {
  let service: AutomationDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AutomationDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
