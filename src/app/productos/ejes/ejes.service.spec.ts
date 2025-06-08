/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { EjesService } from './ejes.service';

describe('Service: Ejes', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EjesService]
    });
  });

  it('should ...', inject([EjesService], (service: EjesService) => {
    expect(service).toBeTruthy();
  }));
});
