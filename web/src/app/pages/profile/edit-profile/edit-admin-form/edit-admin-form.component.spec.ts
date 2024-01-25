import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAdminFormComponent } from './edit-admin-form.component';

describe('EditAdminFormComponent', () => {
  let component: EditAdminFormComponent;
  let fixture: ComponentFixture<EditAdminFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditAdminFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditAdminFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
