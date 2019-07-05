import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {StatistiekPage} from './statistiek.page';

describe('StatistiekPage', () => {
  let component: StatistiekPage;
  let fixture: ComponentFixture<StatistiekPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StatistiekPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatistiekPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
