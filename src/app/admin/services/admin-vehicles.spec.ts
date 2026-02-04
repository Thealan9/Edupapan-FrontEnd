import { TestBed } from '@angular/core/testing';

import { AdminVehicles } from './admin-vehicles';

describe('AdminVehicles', () => {
  let service: AdminVehicles;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminVehicles);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
