import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileWindowComponent } from './file-window.component';

describe('FileWindowComponent', () => {
  let component: FileWindowComponent;
  let fixture: ComponentFixture<FileWindowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileWindowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FileWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
