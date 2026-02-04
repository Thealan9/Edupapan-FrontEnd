import { TestBed } from '@angular/core/testing';

import { AdminLocal } from './admin-local';

describe('AdminLocal', () => {
  let service: AdminLocal;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminLocal);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
