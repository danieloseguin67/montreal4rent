import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LanguageService, Language } from '../../services/language.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="contact-page">
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-content">
          <div class="container">
            <h1>{{ currentLanguage === 'fr' ? 'Contactez-Nous' : 'Contact Us' }}</h1>
            <p class="hero-description">{{ currentLanguage === 'fr' ? 'Nous sommes là pour vous aider à trouver votre prochain chez-vous à Montréal.' : 'We are here to help you find your next home in Montreal.' }}</p>
          </div>
        </div>
        <div class="hero-image">
          <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=600&fit=crop" alt="Contact us" loading="lazy">
        </div>
      </section>

      <!-- Contact Info Section -->
      <section class="contact-info-section">
        <div class="container">
          <div class="contact-grid">
            <div class="contact-card">
              <div class="contact-icon">
                <i class="fas fa-envelope"></i>
              </div>
              <h3>{{ currentLanguage === 'fr' ? 'Email' : 'Email' }}</h3>
              <p><a href="mailto:info@montreal4rent.com">info&#64;montreal4rent.com</a></p>
            </div>
            <div class="contact-card">
              <div class="contact-icon">
                <i class="fas fa-phone"></i>
              </div>
              <h3>{{ currentLanguage === 'fr' ? 'Téléphone' : 'Phone' }}</h3>
              <p><a href="tel:4385081566">(438) 508-1566</a></p>
            </div>
            <div class="contact-card">
              <div class="contact-icon">
                <i class="fas fa-map-marker-alt"></i>
              </div>
              <h3>{{ currentLanguage === 'fr' ? 'Localisation' : 'Location' }}</h3>
              <p>Montréal, QC<br>Canada</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Contact Form Section -->
      <section class="contact-form-section">
        <div class="container">
          <div class="form-header">
            <h2>{{ currentLanguage === 'fr' ? 'Envoyez-nous un message' : 'Send us a message' }}</h2>
            <p>{{ currentLanguage === 'fr' ? 'Remplissez le formulaire ci-dessous et nous vous r&eacute;pondrons rapidement.' : 'Fill out the form below and we\'ll get back to you quickly.' }}</p>
          </div>
          
          <form [formGroup]="contactForm" (ngSubmit)="onSubmit()" class="contact-form">
            <div class="form-row">
              <div class="form-group">
                <label for="name">{{ currentLanguage === 'fr' ? 'Nom complet' : 'Full Name' }} *</label>
                <input 
                  type="text" 
                  id="name" 
                  formControlName="name"
                  [placeholder]="currentLanguage === 'fr' ? 'Votre nom complet' : 'Your full name'"
                  [class.error]="contactForm.get('name')?.invalid && contactForm.get('name')?.touched">
                <div class="error-message" *ngIf="contactForm.get('name')?.invalid && contactForm.get('name')?.touched">
                  {{ currentLanguage === 'fr' ? 'Le nom est requis' : 'Name is required' }}
                </div>
              </div>
              <div class="form-group">
                <label for="email">{{ currentLanguage === 'fr' ? 'Adresse e-mail' : 'Email Address' }} *</label>
                <input 
                  type="email" 
                  id="email" 
                  formControlName="email"
                  [placeholder]="currentLanguage === 'fr' ? 'votre@email.com' : 'your@email.com'"
                  [class.error]="contactForm.get('email')?.invalid && contactForm.get('email')?.touched">
                <div class="error-message" *ngIf="contactForm.get('email')?.invalid && contactForm.get('email')?.touched">
                  <span *ngIf="contactForm.get('email')?.errors?.['required']">
                    {{ currentLanguage === 'fr' ? 'L'adresse e-mail est requise' : 'Email address is required' }}
                  </span>
                  <span *ngIf="contactForm.get('email')?.errors?.['email']">
                    {{ currentLanguage === 'fr' ? 'Veuillez entrer une adresse e-mail valide' : 'Please enter a valid email address' }}
                  </span>
                </div>
              </div>
            </div>
            
            <div class="form-group">
              <label for="subject">{{ currentLanguage === 'fr' ? 'Sujet' : 'Subject' }} *</label>
              <select 
                id="subject" 
                formControlName="subject"
                [class.error]="contactForm.get('subject')?.invalid && contactForm.get('subject')?.touched">
                <option value="">{{ currentLanguage === 'fr' ? 'Sélectionnez un sujet' : 'Select a subject' }}</option>
                <option value="apartment-inquiry">{{ currentLanguage === 'fr' ? 'Demande d\'appartement' : 'Apartment Inquiry' }}</option>
                <option value="viewing-request">{{ currentLanguage === 'fr' ? 'Demande de visite' : 'Viewing Request' }}</option>
                <option value="rental-information">{{ currentLanguage === 'fr' ? 'Informations de location' : 'Rental Information' }}</option>
                <option value="general-question">{{ currentLanguage === 'fr' ? 'Question générale' : 'General Question' }}</option>
                <option value="other">{{ currentLanguage === 'fr' ? 'Autre' : 'Other' }}</option>
              </select>
              <div class="error-message" *ngIf="contactForm.get('subject')?.invalid && contactForm.get('subject')?.touched">
                {{ currentLanguage === 'fr' ? 'Le sujet est requis' : 'Subject is required' }}
              </div>
            </div>
            
            <div class="form-group">
              <label for="message">{{ currentLanguage === 'fr' ? 'Message' : 'Message' }} *</label>
              <textarea 
                id="message" 
                formControlName="message"
                rows="6"
                [placeholder]="currentLanguage === 'fr' ? 'Décrivez votre demande ou question...' : 'Describe your request or question...'"
                [class.error]="contactForm.get('message')?.invalid && contactForm.get('message')?.touched">
              </textarea>
              <div class="error-message" *ngIf="contactForm.get('message')?.invalid && contactForm.get('message')?.touched">
                {{ currentLanguage === 'fr' ? 'Le message est requis' : 'Message is required' }}
              </div>
            </div>
            
            <div class="form-actions">
              <button 
                type="submit" 
                class="send-email-btn"
                [disabled]="contactForm.invalid || isSubmitting">
                <i class="fas fa-paper-plane" *ngIf="!isSubmitting"></i>
                <i class="fas fa-spinner fa-spin" *ngIf="isSubmitting"></i>
                {{ isSubmitting ? (currentLanguage === 'fr' ? 'Envoi...' : 'Sending...') : (currentLanguage === 'fr' ? 'Envoyer le message' : 'Send Message') }}
              </button>
            </div>
            
            <div class="form-message success" *ngIf="showSuccessMessage">
              <i class="fas fa-check-circle"></i>
              {{ currentLanguage === 'fr' ? 'Votre message a été envoyé avec succès! Nous vous répondrons bientôt.' : 'Your message has been sent successfully! We'll get back to you soon.' }}
            </div>
            
            <div class="form-message error" *ngIf="showErrorMessage">
              <i class="fas fa-exclamation-circle"></i>
              {{ currentLanguage === 'fr' ? 'Une erreur est survenue lors de l'envoi. Veuillez réessayer.' : 'An error occurred while sending. Please try again.' }}
            </div>
          </form>
        </div>
      </section>

      <!-- About Section -->
      <section class="about-section">
        <div class="container">
          <div class="about-content">
            <div class="about-text">
              <h2>{{ currentLanguage === 'fr' ? 'À Propos de Montreal4Rent' : 'About Montreal4Rent' }}</h2>
              <p>{{ currentLanguage === 'fr' ? 'Montreal4Rent se spécialise dans la location d'appartements de luxe à Montréal. Nous offrons des logements de qualité supérieure dans les meilleurs quartiers de la ville, parfaits pour les étudiants, les professionnels et les familles.' : 'Montreal4Rent specializes in luxury apartment rentals in Montreal. We offer premium housing in the best neighborhoods of the city, perfect for students, professionals, and families.' }}</p>
              <ul class="services-list">
                <li><i class="fas fa-check"></i> {{ currentLanguage === 'fr' ? 'Appartements meublés et non-meublés' : 'Furnished and unfurnished apartments' }}</li>
                <li><i class="fas fa-check"></i> {{ currentLanguage === 'fr' ? 'Logements adaptés aux étudiants' : 'Student-friendly housing' }}</li>
                <li><i class="fas fa-check"></i> {{ currentLanguage === 'fr' ? 'Emplacements premium' : 'Premium locations' }}</li>
                <li><i class="fas fa-check"></i> {{ currentLanguage === 'fr' ? 'Service client 24/7' : '24/7 customer service' }}</li>
              </ul>
            </div>
            <div class="about-image">
              <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop" alt="Montreal cityscape" loading="lazy">
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit, OnDestroy {
  currentLanguage: Language = 'fr';
  contactForm: FormGroup;
  isSubmitting = false;
  showSuccessMessage = false;
  showErrorMessage = false;
  private destroy$ = new Subject<void>();

  constructor(
    private languageService: LanguageService,
    private formBuilder: FormBuilder
  ) {
    this.contactForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    this.languageService.currentLanguage$
      .pipe(takeUntil(this.destroy$))
      .subscribe(lang => this.currentLanguage = lang);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      this.isSubmitting = true;
      this.showSuccessMessage = false;
      this.showErrorMessage = false;

      // Get form values
      const formData = this.contactForm.value;
      
      // Create mailto link for email client
      const subject = encodeURIComponent(`Montreal4Rent - ${this.getSubjectText(formData.subject)}`);
      const body = encodeURIComponent(
        `Name: ${formData.name}\n` +
        `Email: ${formData.email}\n` +
        `Subject: ${this.getSubjectText(formData.subject)}\n\n` +
        `Message:\n${formData.message}`
      );
      
      const mailtoLink = `mailto:info@montreal4rent.com?subject=${subject}&body=${body}`;
      
      // Open email client
      window.location.href = mailtoLink;
      
      // Simulate processing time
      setTimeout(() => {
        this.isSubmitting = false;
        this.showSuccessMessage = true;
        
        // Reset form after success
        setTimeout(() => {
          this.contactForm.reset();
          this.showSuccessMessage = false;
        }, 3000);
      }, 1000);
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.contactForm.controls).forEach(key => {
        this.contactForm.get(key)?.markAsTouched();
      });
    }
  }

  private getSubjectText(subjectValue: string): string {
    const subjects: { [key: string]: { en: string; fr: string } } = {
      'apartment-inquiry': { en: 'Apartment Inquiry', fr: 'Demande d\'appartement' },
      'viewing-request': { en: 'Viewing Request', fr: 'Demande de visite' },
      'rental-information': { en: 'Rental Information', fr: 'Informations de location' },
      'general-question': { en: 'General Question', fr: 'Question generale' },
      'other': { en: 'Other', fr: 'Autre' }
    };
    
    return subjects[subjectValue]?.[this.currentLanguage] || subjectValue;
  }
}