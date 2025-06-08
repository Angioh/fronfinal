/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TorniProductComponent } from './torni-product.component';

describe('TorniProductComponent', () => {
  let component: TorniProductComponent;
  let fixture: ComponentFixture<TorniProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TorniProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TorniProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
