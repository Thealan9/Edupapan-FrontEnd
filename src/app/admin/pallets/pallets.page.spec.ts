import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PalletsPage } from './pallets.page';

describe('PalletsPage', () => {
  let component: PalletsPage;
  let fixture: ComponentFixture<PalletsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PalletsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
