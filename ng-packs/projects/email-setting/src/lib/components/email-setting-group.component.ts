import { LocalizationService } from '@abp/ng.core';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { finalize } from 'rxjs';
import { EmailSettingsDto, EmailSettingsService } from '../proxy';

@Component({
  selector: 'lib-setting-management',
  templateUrl: './email-setting-group.component.html',
})
export class EmailSettingGroupComponent implements OnInit {
  form!: FormGroup;
  emailTestForm: FormGroup;
  saving = false;
  isEmailTestModalOpen = false;
  constructor(
    private emailSettingsService: EmailSettingsService,
    private fb: FormBuilder,
    private messageService: NzMessageService,
    private localizationService: LocalizationService
  ) {}

  ngOnInit() {
    this.getData();
  }

  private getData() {
    this.emailSettingsService.get().subscribe((res) => {
      this.buildForm(res);
    });
  }

  private buildForm(emailSettings: EmailSettingsDto) {
    this.form = this.fb.group({
      defaultFromDisplayName: [
        emailSettings.defaultFromDisplayName,
        [Validators.required],
      ],
      defaultFromAddress: [
        emailSettings.defaultFromAddress,
        [Validators.required],
      ],
      smtpHost: [emailSettings.smtpHost],
      smtpPort: [emailSettings.smtpPort, [Validators.required]],
      smtpEnableSsl: [emailSettings.smtpEnableSsl],
      smtpUseDefaultCredentials: [emailSettings.smtpUseDefaultCredentials],
      smtpDomain: [emailSettings.smtpDomain],
      smtpUserName: [emailSettings.smtpUserName],
      smtpPassword: [emailSettings.smtpPassword],
    });
  }
  submit() {
    if (this.saving || this.form.invalid) return;

    this.saving = true;
    this.emailSettingsService
      .update(this.form.value)
      .pipe(finalize(() => (this.saving = false)))
      .subscribe(() => {
        this.messageService.success(
          this.localizationService.instant(
            'AbpSettingManagement::SuccessfullySaved'
          )
        );
        this.getData();
      });
  }
  openSendEmailModal() {
    this.buildEmailTestForm();
    this.isEmailTestModalOpen = true;
  }

  buildEmailTestForm() {
    this.emailTestForm = this.fb.group({
      senderEmailAddress: ['', [Validators.required, Validators.email]],
      targetEmailAddress: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required]],
      body: [''],
    });
  }

  emailTestFormSubmit() {
    if (this.emailTestForm.invalid) {
      return;
    }
    this.emailSettingsService
      .sendTestEmail(this.emailTestForm.value)
      .subscribe((res) => {
        this.messageService.success(
          this.localizationService.instant(
            'AbpSettingManagement::SuccessfullySent'
          )
        );
        this.isEmailTestModalOpen = false;
      });
  }
}
