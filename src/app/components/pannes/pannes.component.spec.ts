import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PannesComponent } from './pannes.component';

describe('PannesComponent', () => {
  let component: PannesComponent;
  let fixture: ComponentFixture<PannesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PannesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PannesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
