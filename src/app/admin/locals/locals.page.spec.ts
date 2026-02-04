import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LocalsPage } from './locals.page';

describe('LocalsPage', () => {
  let component: LocalsPage;
  let fixture: ComponentFixture<LocalsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
