import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditautomateComponent } from './editautomate.component';

describe('EditautomateComponent', () => {
  let component: EditautomateComponent;
  let fixture: ComponentFixture<EditautomateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditautomateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditautomateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
