import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestAssignFormComponent } from './request-assign-form.component';

describe('RequestAssignFormComponent', () => {
  let component: RequestAssignFormComponent;
  let fixture: ComponentFixture<RequestAssignFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestAssignFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestAssignFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
