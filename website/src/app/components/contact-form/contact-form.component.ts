import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

  onSubmit(): void {
    this.submitted = true;

    // Validate all fields are filled
    if (this.isFormValid()) {
      // Prepare email body
      const emailBody = `Name: ${this.formData.name}\nEmail: ${this.formData.email}\n\nMessage:\n${this.formData.message}`;
      
      // Create mailto link
      const mailtoLink = `mailto:info@montreal4rent.com?subject=${encodeURIComponent(this.formData.subject)}&body=${encodeURIComponent(emailBody)}`;
      
      // Open user's default email client
      window.location.href = mailtoLink;
      
      // Reset form after opening email client
      setTimeout(() => {
        this.resetForm();
      }, 500);
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
