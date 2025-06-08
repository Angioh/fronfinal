/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { LijasService } from './lijas.service';

describe('Service: Lijas', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LijasService]
    });
  });

  it('should ...', inject([LijasService], (service: LijasService) => {
    expect(service).toBeTruthy();
  }));
});
