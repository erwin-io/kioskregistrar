import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberArchivedDocumentsComponent } from './member-archived-documents.component';

describe('MemberArchivedDocumentsComponent', () => {
  let component: MemberArchivedDocumentsComponent;
  let fixture: ComponentFixture<MemberArchivedDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MemberArchivedDocumentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MemberArchivedDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
