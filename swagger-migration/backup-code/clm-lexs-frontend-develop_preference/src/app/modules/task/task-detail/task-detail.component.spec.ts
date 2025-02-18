import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { ActionBarComponent } from '@app/shared/components/action-bar/action-bar.component';
import { CollateralInfoComponent } from '@app/shared/components/common-tabs/collateral-info/collateral-info.component';
import { LitigationSummaryComponent } from '@app/shared/components/common-tabs/litigation-summary/litigation-summary.component';
import { MessageBannerComponent } from '@app/shared/components/message-banner/message-banner.component';
import { MessageEmptyComponent } from '@app/shared/components/message-empty/message-empty.component';
import { TooltipComponent } from '@app/shared/components/tooltip/tooltip.component';
import { TaskMode } from '@app/shared/models';
import { Configuration } from '@lexs/lexs-client';
import { UnittestImports, UnittestProviders } from '@mocks/setup/unittest-config';
import { of } from 'rxjs';
import { TaskService } from '../services/task.service';
import { TaskDetailComponent } from './task-detail.component';

describe('TaskDetailComponent', () => {
  let component: TaskDetailComponent;
  let fixture: ComponentFixture<TaskDetailComponent>;
  let taskService: TaskService;

  const mockActivatedRoute = {
    queryParams: of({ taskId: 100 }),
    snapshot: {
      data: {
        taskMode: {
          mode: 'LITIGATION',
          tabIndex: 0,
        } as TaskMode,
      },
    },
  };

  const mockTaskDetail = {
    id: 100,
    taskCode: 'RECORD_NOTICE',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        TaskDetailComponent,
        ActionBarComponent,
        TooltipComponent,
        LitigationSummaryComponent,
        MessageBannerComponent,
        CollateralInfoComponent,
        MessageEmptyComponent,
      ],
      imports: [...UnittestImports],
      providers: [...UnittestProviders, Configuration, { provide: ActivatedRoute, useValue: mockActivatedRoute }],
    }).compileComponents();
    taskService = TestBed.inject(TaskService);
    taskService.taskDetail = mockTaskDetail;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
