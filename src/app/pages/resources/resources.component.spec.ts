import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ResourcesComponent } from './resources.component';

describe('ResourcesComponent', () => {
  it('creates without crashing', () => {
    TestBed.configureTestingModule({
      imports: [ResourcesComponent],
      providers: [provideRouter([])],
    });
    const fixture = TestBed.createComponent(ResourcesComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
