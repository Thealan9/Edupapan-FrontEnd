import { TestBed } from '@angular/core/testing';

import { AdminPackages } from './admin-packages';

describe('AdminPackages', () => {
  let service: AdminPackages;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminPackages);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
