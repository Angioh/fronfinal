/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RodaProductComponent } from './roda-product.component';

describe('RodaProductComponent', () => {
  let component: RodaProductComponent;
  let fixture: ComponentFixture<RodaProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RodaProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RodaProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
