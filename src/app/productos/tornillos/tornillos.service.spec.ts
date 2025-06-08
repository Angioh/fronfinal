/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TornillosService } from './tornillos.service';

describe('Service: Tornillos', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TornillosService]
    });
  });

  it('should ...', inject([TornillosService], (service: TornillosService) => {
    expect(service).toBeTruthy();
  }));
});
