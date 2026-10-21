import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ApiDocsComponent } from './api-docs.component';

describe('ApiDocsComponent', () => {
  it('creates without crashing', () => {
    TestBed.configureTestingModule({
      imports: [ApiDocsComponent],
      providers: [provideRouter([])],
    });
    const fixture = TestBed.createComponent(ApiDocsComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
