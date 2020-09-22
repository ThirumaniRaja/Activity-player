import { async, TestBed } from '@angular/core/testing';
import { ActivityPlayerModule } from './activity-player.module';

describe('ActivityPlayerModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ActivityPlayerModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(ActivityPlayerModule).toBeDefined();
  });
});
