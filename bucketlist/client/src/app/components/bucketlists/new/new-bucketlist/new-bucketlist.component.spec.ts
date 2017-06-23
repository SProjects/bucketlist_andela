import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewBucketlistComponent } from './new-bucketlist.component';

describe('NewBucketlistComponent', () => {
  let component: NewBucketlistComponent;
  let fixture: ComponentFixture<NewBucketlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewBucketlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewBucketlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
