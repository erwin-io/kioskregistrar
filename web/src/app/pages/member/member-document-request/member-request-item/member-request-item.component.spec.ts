import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberRequestItemComponent } from './member-request-item.component';

describe('MemberRequestItemComponent', () => {
  let component: MemberRequestItemComponent;
  let fixture: ComponentFixture<MemberRequestItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MemberRequestItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MemberRequestItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
