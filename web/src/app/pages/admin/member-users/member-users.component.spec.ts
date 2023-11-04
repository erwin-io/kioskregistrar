import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberUsersComponent } from './member-users.component';

describe('MemberUsersComponent', () => {
  let component: MemberUsersComponent;
  let fixture: ComponentFixture<MemberUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MemberUsersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MemberUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
