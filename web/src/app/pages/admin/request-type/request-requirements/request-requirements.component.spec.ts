import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestRequirementsComponent } from './request-requirements.component';

describe('RequestRequirementsComponent', () => {
  let component: RequestRequirementsComponent;
  let fixture: ComponentFixture<RequestRequirementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestRequirementsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestRequirementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
