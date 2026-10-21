import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SignupComponent } from './signup.component';

describe('SignupComponent', () => {
  it('creates without crashing', () => {
    TestBed.configureTestingModule({
      imports: [SignupComponent],
      providers: [provideRouter([])],
    });
    const fixture = TestBed.createComponent(SignupComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
