import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WarehousemanPage } from './warehouseman.page';

describe('WarehousemanPage', () => {
  let component: WarehousemanPage;
  let fixture: ComponentFixture<WarehousemanPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(WarehousemanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
