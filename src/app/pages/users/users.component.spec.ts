import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { UsersComponent } from './users.component';

describe('UsersComponent', () => {
  it('creates without crashing', () => {
    TestBed.configureTestingModule({
      imports: [UsersComponent],
      providers: [provideRouter([])],
    });
    const fixture = TestBed.createComponent(UsersComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
