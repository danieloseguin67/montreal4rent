import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, tap } from 'rxjs';
import { EmailLoggerService } from './email-logger.service';

export interface EmailConfig {
  smtpHost: string;
  smtpPort: number;
  smtpDefaultCredentials: string;
  smtpSecure: string;
  contactemail?: string;
}

export interface EmailRequest {
  fromEmail: string;
  to: string;
  subject: string;
  body: string;
  isBodyHtml: boolean;
  formType?: string;
  senderName?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private configUrl = 'assets/data/emailhostserver.json';
  private emailConfig: EmailConfig | null = null;

  constructor(
    private http: HttpClient,
    private emailLogger: EmailLoggerService
  ) {
    this.loadConfig();
  }

  /**
   * Load SMTP configuration from JSON file
   */
  private loadConfig(): void {
    this.http.get<EmailConfig>(this.configUrl).subscribe({
      next: (config) => {
        this.emailConfig = config;
      },
      error: (err) => {
        console.error('Failed to load email configuration', err);
      }
    });
  }

  /**
   * Get the current email configuration
   */
  public getConfig(): EmailConfig | null {
    return this.emailConfig;
  }

  /**
   * Get the contact email address from configuration
   */
  public getContactEmail(defaultEmail: string = 'info@montreal4rent.com'): string {
    return this.emailConfig?.contactemail?.trim() || defaultEmail;
  }

  /**
   * Send email via backend API
   * Translates the C# send_email function to Angular/TypeScript
   * 
   * Note: Browsers cannot send SMTP emails directly. This method prepares
   * the email data and sends it to a backend API endpoint that handles
   * the actual SMTP transmission.
   * 
   * @param strFromEmail - Sender email address
   * @param strTo - Recipient email address
   * @param strSubject - Email subject
   * @param strBody - Email body content
   * @param formType - Type of form (e.g., 'contact', 'book-tour', 'rental-inquiry')
   * @param senderName - Name of the sender
   * @returns Observable<boolean> - true if sent successfully, false otherwise
   */
  public sendEmail(
    strFromEmail: string,
    strTo: string,
    strSubject: string,
    strBody: string,
    formType: string = 'general',
    senderName?: string
  ): Observable<boolean> {
    if (!this.emailConfig) {
      console.error('Email configuration not loaded');
      // Log the failed attempt
      this.emailLogger.logEmail({
        formType,
        fromEmail: strFromEmail,
        toEmail: strTo,
        subject: strSubject,
        status: 'failed',
        errorMessage: 'Email configuration not loaded',
        senderName
      });
      return of(false);
    }

    const emailRequest: EmailRequest = {
      fromEmail: strFromEmail,
      to: strTo,
      subject: strSubject,
      body: strBody,
      isBodyHtml: true,
      formType,
      senderName
    };

    const emailData = {
      ...emailRequest,
      smtpConfig: {
        host: this.emailConfig.smtpHost,
        port: this.emailConfig.smtpPort,
        useDefaultCredentials: this.emailConfig.smtpDefaultCredentials === 'Y',
        enableSsl: this.emailConfig.smtpSecure === 'Y'
      }
    };

    // TODO: Replace with your actual backend API endpoint
    // Example: return this.http.post<any>('/api/email/send', emailData)
    //   .pipe(
    //     map(() => true),
    //     catchError((error) => {
    //       console.error('Email send error:', error);
    //       return of(false);
    //     })
    //   );

    // For now, just log and return success (replace with actual API call)
    console.log('Email to be sent:', emailData);
    
    return of(true).pipe(
      tap((success) => {
        // Log the email activity
        this.emailLogger.logEmail({
          formType,
          fromEmail: strFromEmail,
          toEmail: strTo,
          subject: strSubject,
          status: success ? 'success' : 'failed',
          senderName
        });
      }),
      catchError((ex) => {
        // Log the failed email attempt
        this.emailLogger.logEmail({
          formType,
          fromEmail: strFromEmail,
          toEmail: strTo,
          subject: strSubject,
          status: 'failed',
          errorMessage: ex?.message || 'Unknown error',
          senderName
        });
        // Ignore email error, probably due to SMTP server not being defined
        console.warn('Email sending failed:', ex);
        return of(false);
      })
    );
  }

  /**
   * Alternative method that returns the prepared email data
   * Useful for testing or custom backend integration
   */
  public prepareEmailData(
    strFromEmail: string,
    strTo: string,
    strSubject: string,
    strBody: string
  ): any {
    if (!this.emailConfig) {
      throw new Error('Email configuration not loaded');
    }

    return {
      fromEmail: strFromEmail,
      to: strTo,
      subject: strSubject,
      body: strBody,
      isBodyHtml: true,
      smtpConfig: {
        host: this.emailConfig.smtpHost,
        port: this.emailConfig.smtpPort,
        useDefaultCredentials: this.emailConfig.smtpDefaultCredentials === 'Y',
        enableSsl: this.emailConfig.smtpSecure === 'Y'
      }
    };
  }
}
