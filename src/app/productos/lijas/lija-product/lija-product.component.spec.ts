/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LijaProductComponent } from './lija-product.component';

describe('LijaProductComponent', () => {
  let component: LijaProductComponent;
  let fixture: ComponentFixture<LijaProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LijaProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LijaProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
