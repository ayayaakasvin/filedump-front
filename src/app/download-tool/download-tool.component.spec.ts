import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadToolComponent } from './download-tool.component';

describe('DownloadToolComponent', () => {
  let component: DownloadToolComponent;
  let fixture: ComponentFixture<DownloadToolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DownloadToolComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DownloadToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
