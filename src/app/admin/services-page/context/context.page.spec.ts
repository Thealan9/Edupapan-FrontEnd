import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContextPage } from './context.page';

describe('ContextPage', () => {
  let component: ContextPage;
  let fixture: ComponentFixture<ContextPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ContextPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
