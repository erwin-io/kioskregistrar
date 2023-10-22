import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentRequestManagementComponent } from './document-request-management.component';

describe('DocumentRequestManagementComponent', () => {
  let component: DocumentRequestManagementComponent;
  let fixture: ComponentFixture<DocumentRequestManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentRequestManagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentRequestManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
