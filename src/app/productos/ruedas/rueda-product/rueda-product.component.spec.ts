/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RuedaProductComponent } from './rueda-product.component';

describe('RuedaProductComponent', () => {
  let component: RuedaProductComponent;
  let fixture: ComponentFixture<RuedaProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RuedaProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RuedaProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
