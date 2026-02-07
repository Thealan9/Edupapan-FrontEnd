import { TestBed } from '@angular/core/testing';

import { WarehouseTicket } from './warehouse-ticket';

describe('WarehouseTicket', () => {
  let service: WarehouseTicket;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WarehouseTicket);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
