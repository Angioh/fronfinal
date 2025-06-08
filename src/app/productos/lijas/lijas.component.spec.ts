import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LijasComponent } from './lijas.component';

describe('LijasComponent', () => {
  let component: LijasComponent;
  let fixture: ComponentFixture<LijasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LijasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LijasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
