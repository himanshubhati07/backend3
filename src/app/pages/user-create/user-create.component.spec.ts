import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { UserCreateComponent } from './user-create.component';

describe('UserCreateComponent', () => {
  it('creates without crashing', () => {
    TestBed.configureTestingModule({
      imports: [UserCreateComponent],
      providers: [provideRouter([])],
    });
    const fixture = TestBed.createComponent(UserCreateComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
