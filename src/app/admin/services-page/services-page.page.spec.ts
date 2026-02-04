import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ServicesPagePage } from './services-page.page';

describe('ServicesPagePage', () => {
  let component: ServicesPagePage;
  let fixture: ComponentFixture<ServicesPagePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicesPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
