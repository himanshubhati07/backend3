import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ResourceCreateComponent } from './resource-create.component';

describe('ResourceCreateComponent', () => {
  it('creates without crashing', () => {
    TestBed.configureTestingModule({
      imports: [ResourceCreateComponent],
      providers: [provideRouter([])],
    });
    const fixture = TestBed.createComponent(ResourceCreateComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
