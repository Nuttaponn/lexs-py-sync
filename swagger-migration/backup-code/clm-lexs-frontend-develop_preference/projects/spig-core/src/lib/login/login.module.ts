import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { EXCEPTION_CONFIG } from '../service/exception.service';
import { TokenModule } from '../token/token.module';
import { LoginAlertComponent } from './login-alert/login-alert.component';
import { LoginScreenComponent } from './login-screen.component';
import { PipeModule } from "../pipe/pipe.module";

@NgModule({
    declarations: [LoginScreenComponent, LoginAlertComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatTooltipModule,
        MatIconModule,
        TokenModule,
        TranslateModule.forChild(),
        PipeModule,
    ],
    exports: [LoginScreenComponent],
    providers: [
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
    ]
})
export class LoginModule {}
