import { TestBed } from '@angular/core/testing';

import { AdminAvailability } from './admin-availability';

describe('AdminAvailability', () => {
  let service: AdminAvailability;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminAvailability);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
