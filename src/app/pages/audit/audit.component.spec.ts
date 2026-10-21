import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AuditComponent } from './audit.component';

describe('AuditComponent', () => {
  it('creates without crashing', () => {
    TestBed.configureTestingModule({
      imports: [AuditComponent],
      providers: [provideRouter([])],
    });
    const fixture = TestBed.createComponent(AuditComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
