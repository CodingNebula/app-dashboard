import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutomateComponent } from './automate.component';

describe('AutomateComponent', () => {
  let component: AutomateComponent;
  let fixture: ComponentFixture<AutomateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutomateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AutomateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
