import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmailService } from '../../services/email.service';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss']
})
export class ContactFormComponent {
  formData: ContactFormData = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  submitted = false;
  showSuccessMessage = false;
  showErrorMessage = false;
  isSending = false;

  constructor(private emailService: EmailService) {}

  onSubmit(): void {
    this.submitted = true;

    // Validate all fields are filled
    if (this.isFormValid()) {
      this.isSending = true;
      
      // Prepare email body with HTML formatting
      const emailBody = `
        <h3>New Contact Form Submission</h3>
        <p><strong>From:</strong> ${this.formData.name}</p>
        <p><strong>Email:</strong> ${this.formData.email}</p>
        <p><strong>Subject:</strong> ${this.formData.subject}</p>
        <hr>
        <p><strong>Message:</strong></p>
        <p>${this.formData.message.replace(/\n/g, '<br>')}</p>
      `;

      // Send email to info@montreal4rent.com
      this.emailService.sendEmail(
        this.formData.email,
        'info@montreal4rent.com',
        `Contact Form: ${this.formData.subject}`,
        emailBody
      ).subscribe({
        next: (success) => {
          this.isSending = false;
          if (success) {
            // Show success message
            this.showSuccessMessage = true;
            this.showErrorMessage = false;
            
            // Reset form after submission
            this.resetForm();
            
            // Hide success message after 5 seconds
            setTimeout(() => {
              this.showSuccessMessage = false;
            }, 5000);
          } else {
            // Show error message
            this.showErrorMessage = true;
            setTimeout(() => {
              this.showErrorMessage = false;
            }, 5000);
          }
        },
        error: (err) => {
          console.error('Error sending email:', err);
          this.isSending = false;
          this.showErrorMessage = true;
          setTimeout(() => {
            this.showErrorMessage = false;
          }, 5000);
        }
      });
    }
  }

  isFormValid(): boolean {
    return !!(
      this.formData.name.trim() &&
      this.formData.email.trim() &&
      this.formData.subject.trim() &&
      this.formData.message.trim() &&
      this.isEmailValid()
    );
  }

  isEmailValid(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.formData.email);
  }

  resetForm(): void {
    this.formData = {
      name: '',
      email: '',
      subject: '',
      message: ''
    };
    this.submitted = false;
  }

  // Helper methods for validation display
  isFieldInvalid(field: keyof ContactFormData): boolean {
    return this.submitted && !this.formData[field].trim();
  }

  isEmailInvalid(): boolean {
    return this.submitted && (!this.formData.email.trim() || !this.isEmailValid());
  }
}
