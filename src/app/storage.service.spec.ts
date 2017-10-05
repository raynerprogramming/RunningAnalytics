import { TestBed, inject } from '@angular/core/testing';

import { StorageService } from './storage.service';

describe('StorageServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StorageService]
    });
  });

  it('should be created', inject([StorageService], (service: StorageService) => {
    expect(service).toBeTruthy();
  }));
});
