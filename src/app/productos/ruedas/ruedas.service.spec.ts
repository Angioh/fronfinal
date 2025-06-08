/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { RuedasService } from './ruedas.service';

describe('Service: Ruedas', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RuedasService]
    });
  });

  it('should ...', inject([RuedasService], (service: RuedasService) => {
    expect(service).toBeTruthy();
  }));
});
