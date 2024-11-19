import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoAppDialogComponent } from './no-app-dialog.component';

describe('NoAppDialogComponent', () => {
  let component: NoAppDialogComponent;
  let fixture: ComponentFixture<NoAppDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoAppDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoAppDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
