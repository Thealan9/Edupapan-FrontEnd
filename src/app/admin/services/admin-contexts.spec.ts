import { TestBed } from '@angular/core/testing';

import { AdminContexts } from './admin-contexts';

describe('AdminContexts', () => {
  let service: AdminContexts;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminContexts);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
