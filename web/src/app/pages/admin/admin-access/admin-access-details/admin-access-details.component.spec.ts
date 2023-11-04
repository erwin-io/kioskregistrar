import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAccessDetailsComponent } from './admin-access-details.component';

describe('UserDetailsComponent', () => {
  let component: AdminAccessDetailsComponent;
  let fixture: ComponentFixture<AdminAccessDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminAccessDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminAccessDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
