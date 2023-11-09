import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestPaymentFormComponent } from './request-payment-form.component';

describe('RequestPaymentFormComponent', () => {
  let component: RequestPaymentFormComponent;
  let fixture: ComponentFixture<RequestPaymentFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestPaymentFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestPaymentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
