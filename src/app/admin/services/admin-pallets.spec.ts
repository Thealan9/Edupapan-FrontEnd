import { TestBed } from '@angular/core/testing';

import { AdminPallets } from './admin-pallets';

describe('AdminPallets', () => {
  let service: AdminPallets;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminPallets);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
