import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ResourceDetailComponent } from './resource-detail.component';

describe('ResourceDetailComponent', () => {
  it('creates without crashing', () => {
    TestBed.configureTestingModule({
      imports: [ResourceDetailComponent],
      providers: [provideRouter([])],
    });
    const fixture = TestBed.createComponent(ResourceDetailComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
