import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableLayout } from './table-layout';

describe('TableLayout', () => {
  let component: TableLayout;
  let fixture: ComponentFixture<TableLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableLayout],
    }).compileComponents();

    fixture = TestBed.createComponent(TableLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
