import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberDocumentRequestComponent } from './member-document-request.component';

describe('MemberDocumentRequestComponent', () => {
  let component: MemberDocumentRequestComponent;
  let fixture: ComponentFixture<MemberDocumentRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MemberDocumentRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MemberDocumentRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
