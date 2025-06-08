import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RuedasComponent } from './ruedas.component';

describe('RuedasComponent', () => {
  let component: RuedasComponent;
  let fixture: ComponentFixture<RuedasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RuedasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RuedasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
