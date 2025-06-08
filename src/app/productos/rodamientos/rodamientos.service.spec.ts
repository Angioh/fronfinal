/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { RodamientosService } from './rodamientos.service';

describe('Service: Rodamientos', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RodamientosService]
    });
  });

  it('should ...', inject([RodamientosService], (service: RodamientosService) => {
    expect(service).toBeTruthy();
  }));
});
