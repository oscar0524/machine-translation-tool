import { TestBed } from '@angular/core/testing';

import { SyosetuParserService } from './syosetu-parser.service';

describe('SyosetuParserService', () => {
  let service: SyosetuParserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SyosetuParserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
