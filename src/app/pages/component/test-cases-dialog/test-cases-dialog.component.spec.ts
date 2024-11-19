import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestCasesDialogComponent } from './test-cases-dialog.component';

describe('TestCasesDialogComponent', () => {
  let component: TestCasesDialogComponent;
  let fixture: ComponentFixture<TestCasesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestCasesDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestCasesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
