import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WeightedSearchAlgorithmComponent } from './weighted-search-algorithm.component';

describe('WeightedSearchAlgorithmComponent', () => {
  let component: WeightedSearchAlgorithmComponent;
  let fixture: ComponentFixture<WeightedSearchAlgorithmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeightedSearchAlgorithmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeightedSearchAlgorithmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
