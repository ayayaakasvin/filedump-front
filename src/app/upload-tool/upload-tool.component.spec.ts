import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadToolComponent } from './upload-tool.component';

describe('UploadToolComponent', () => {
  let component: UploadToolComponent;
  let fixture: ComponentFixture<UploadToolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadToolComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
