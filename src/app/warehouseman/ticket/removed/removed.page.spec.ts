import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RemovedPage } from './removed.page';

describe('RemovedPage', () => {
  let component: RemovedPage;
  let fixture: ComponentFixture<RemovedPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RemovedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
