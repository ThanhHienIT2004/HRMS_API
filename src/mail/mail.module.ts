import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mail.service';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST || 'smtp.sendgrid.net',
        port: 587,
        secure: false,
        auth: {
          user: process.env.MAIL_USER || 'apikey',
          pass: process.env.MAIL_PASS || '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',
        },
      },
      defaults: {
        from: process.env.MAIL_FROM || 'hiencoi9600@gmail.com',
      },
      template: {
        dir: join(__dirname, '..','..', 'templates'),
        adapter: new HandlebarsAdapter(),
        options: { strict: true },
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
