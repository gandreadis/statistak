import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {RepertoirePage} from './repertoire.page';

describe('RepertoirePage', () => {
  let component: RepertoirePage;
  let fixture: ComponentFixture<RepertoirePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RepertoirePage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepertoirePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
