import { TestBed } from '@angular/core/testing';

import { SqliteCoreService } from './sqlite-core.service';

describe('SqliteCoreService', () => {
  let service: SqliteCoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SqliteCoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
