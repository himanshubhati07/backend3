import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HealthComponent } from './health.component';

describe('HealthComponent', () => {
  it('creates without crashing', () => {
    TestBed.configureTestingModule({
      imports: [HealthComponent],
      providers: [provideRouter([])],
    });
    const fixture = TestBed.createComponent(HealthComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
