import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewMemberDocumentRequestComponent } from './new-member-document-request.component';

describe('NewMemberDocumentRequestComponent', () => {
  let component: NewMemberDocumentRequestComponent;
  let fixture: ComponentFixture<NewMemberDocumentRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewMemberDocumentRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewMemberDocumentRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
