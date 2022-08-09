import { TestBed } from '@angular/core/testing';

import { SyosetuNovelParserService } from './syosetu-novel-parser.service';

describe('SyosetuNovelParserService', () => {
  let service: SyosetuNovelParserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SyosetuNovelParserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
