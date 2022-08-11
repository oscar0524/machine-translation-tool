import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetionComponent } from './setion.component';

describe('ChapterComponent', () => {
  let component: SetionComponent;
  let fixture: ComponentFixture<SetionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SetionComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SetionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
