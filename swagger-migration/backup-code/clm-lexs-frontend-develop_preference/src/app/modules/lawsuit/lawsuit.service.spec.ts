import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { stompConfig } from '@app/app.module';
import { ErrorHandlingService } from '@app/shared/services/error-handling.service';
import { Configuration, LitigationControllerService } from '@lexs/lexs-client';
import { TranslateModule } from '@ngx-translate/core';
import { DialogsService, EXCEPTION_CONFIG, STOMP_OPTIONS } from '@spig/core';

import { LawsuitService } from './lawsuit.service';

describe('LawsuitService', () => {
  let service: LawsuitService;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [TranslateModule.forRoot(), MatSnackBarModule, MatDialogModule],
    providers: [
        Configuration,
        { provide: STOMP_OPTIONS, useFactory: stompConfig },
        DialogsService,
        ErrorHandlingService,
        LitigationControllerService,
        {
            provide: EXCEPTION_CONFIG,
            useValue: [
                { code: 'NOT_AUTHORIZED', message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง หรือไม่มีชื่อผู้ใช้นี้' },
                { code: 'AD_UNAVAILABLE', message: 'ไม่สามารถเข้าสู่ระบบได้ในขณะนี้ โปรดลองใหม่อีกครั้งในภายหลัง' },
                { code: 'USER_LOCKED', message: 'กรอกผิดเกินจำนวนที่กำหนด กรุณาปลดล็อค' },
                { code: 'USER_INVALID_BRANCH', message: 'คุณไม่มีสิทธิเข้าใช้งาน ไม่สามารถเข้าสู่ระบบได้' },
                { code: 'USER_INSUFFICIENT_ROLE', message: 'คุณไม่มีสิทธิเข้าใช้งาน ไม่สามารถเข้าสู่ระบบได้' },
                { code: 'USER_ON_LEAVE', message: 'คุณไม่มีสิทธิเข้าใช้งาน ไม่สามารถเข้าสู่ระบบได้' },
            ],
            multi: true,
        },
        provideHttpClient(withInterceptorsFromDi()),
    ]
});
    service = TestBed.inject(LawsuitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
