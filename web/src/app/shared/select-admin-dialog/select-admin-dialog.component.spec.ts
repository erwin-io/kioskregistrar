import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectAdminDialogComponent } from './select-admin-dialog.component';

describe('SelectAdminDialogComponent', () => {
  let component: SelectAdminDialogComponent;
  let fixture: ComponentFixture<SelectAdminDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectAdminDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectAdminDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
