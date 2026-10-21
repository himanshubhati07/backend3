import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  it('creates without crashing', () => {
    TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [provideRouter([])],
    });
    const fixture = TestBed.createComponent(LoginComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
