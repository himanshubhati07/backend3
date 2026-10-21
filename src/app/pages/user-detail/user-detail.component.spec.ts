import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { UserDetailComponent } from './user-detail.component';

describe('UserDetailComponent', () => {
  it('creates without crashing', () => {
    TestBed.configureTestingModule({
      imports: [UserDetailComponent],
      providers: [provideRouter([])],
    });
    const fixture = TestBed.createComponent(UserDetailComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
