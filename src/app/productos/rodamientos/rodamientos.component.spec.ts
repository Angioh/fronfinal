import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RodamientosComponent } from './rodamientos.component';

describe('RodamientosComponent', () => {
  let component: RodamientosComponent;
  let fixture: ComponentFixture<RodamientosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RodamientosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RodamientosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
