import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversationhistoryComponent } from './conversationhistory.component';

describe('ConversationhistoryComponent', () => {
  let component: ConversationhistoryComponent;
  let fixture: ComponentFixture<ConversationhistoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConversationhistoryComponent]
    });
    fixture = TestBed.createComponent(ConversationhistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
