import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurahInfoComponent } from './surah-info.component';

describe('SurahInfoComponent', () => {
  let component: SurahInfoComponent;
  let fixture: ComponentFixture<SurahInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SurahInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SurahInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
