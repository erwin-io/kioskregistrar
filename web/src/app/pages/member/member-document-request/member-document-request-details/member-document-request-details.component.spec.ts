import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberDocumentRequestDetailsComponent } from './member-document-request-details.component';

describe('MemberDocumentRequestDetailsComponent', () => {
  let component: MemberDocumentRequestDetailsComponent;
  let fixture: ComponentFixture<MemberDocumentRequestDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MemberDocumentRequestDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MemberDocumentRequestDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
