import { TestBed, async, inject } from '@angular/core/testing';

import { MemberAuthGuard } from './member-auth.guard';

describe('MemberAuthGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MemberAuthGuard]
    });
  });

  it('should ...', inject([MemberAuthGuard], (guard: MemberAuthGuard) => {
    expect(guard).toBeTruthy();
  }));
});
