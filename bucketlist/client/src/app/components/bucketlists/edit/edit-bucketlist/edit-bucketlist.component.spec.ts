import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBucketlistComponent } from './edit-bucketlist.component';

describe('EditBucketlistComponent', () => {
  let component: EditBucketlistComponent;
  let fixture: ComponentFixture<EditBucketlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditBucketlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditBucketlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
