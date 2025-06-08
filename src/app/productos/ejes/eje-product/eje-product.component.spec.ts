/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EjeProductComponent } from './eje-product.component';

describe('EjeProductComponent', () => {
  let component: EjeProductComponent;
  let fixture: ComponentFixture<EjeProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EjeProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EjeProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
