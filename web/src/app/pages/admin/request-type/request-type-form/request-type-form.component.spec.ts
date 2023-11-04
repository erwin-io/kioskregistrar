import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestTypeFormComponent } from './request-type-form.component';

describe('RequestTypeFormComponent', () => {
  let component: RequestTypeFormComponent;
  let fixture: ComponentFixture<RequestTypeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestTypeFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestTypeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
