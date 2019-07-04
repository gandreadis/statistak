import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {StukPage} from './stuk.page';

describe('StukPage', () => {
  let component: StukPage;
  let fixture: ComponentFixture<StukPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StukPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StukPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
