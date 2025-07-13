import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteToolComponent } from './delete-tool.component';

describe('DeleteToolComponent', () => {
  let component: DeleteToolComponent;
  let fixture: ComponentFixture<DeleteToolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteToolComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
