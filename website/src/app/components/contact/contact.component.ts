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

      <!-- Contact Info Section with the 3 buttons:  email, phone, and loction -->
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
            <p>{{ currentLanguage === 'fr' ? 'Remplissez le formulaire ci-dessous et nous vous r&eacute;pondrons rapidement.' : 'Fill out the form below and we will get back to you quickly.' }}</p>
          </div>
          
          <!-- add move in date formgroup here -->
          <form [formGroup]="contactForm" (ngSubmit)="onSubmit()" novalidate>

            <div class="form-group">
              <label for="moveInDate">{{ currentLanguage === 'fr' ? 'Date d\'emménagement' : 'Move-in Date' }}</label>
              <input 
                type="date" 
                id="moveInDate" 
                formControlName="moveInDate"
                [class.invalid]="contactForm.get('moveInDate')?.invalid && (contactForm.get('moveInDate')?.touched || contactForm.get('moveInDate')?.dirty)">
              <div class="error-message" *ngIf="contactForm.get('moveInDate')?.invalid && (contactForm.get('moveInDate')?.touched || contactForm.get('moveInDate')?.dirty)">
                <span *ngIf="contactForm.get('moveInDate')?.errors?.['required']">
                  {{ currentLanguage === 'fr' ? 'La date d\'emménagement est requise.' : 'Move-in date is required.' }}
                </span>
              </div>
            </div>

            <!-- add first name and last name formgroup here -->
            <div class="form-group">
              <label for="firstName">{{ currentLanguage === 'fr' ? 'Prénom' : 'First Name' }}</label>
              <input 
                type="text" 
                id="firstName"
                formControlName="firstName"
                [class.invalid]="contactForm.get('firstName')?.invalid && (contactForm.get('firstName')?.touched || contactForm.get('firstName')?.dirty)">
              <div class="error-message" *ngIf="contactForm.get('firstName')?.invalid && (contactForm.get('firstName')?.touched || contactForm.get('firstName')?.dirty)"> 
                <span *ngIf="contactForm.get('firstName')?.errors?.['required']">
                  {{ currentLanguage === 'fr' ? 'Le prénom est requis.' : 'First name is required.' }}
                </span>
                <span *ngIf="contactForm.get('firstName')?.errors?.['minlength']">
                  {{ currentLanguage === 'fr' ? 'Le prénom doit contenir au moins 2 caractères.' : 'First name must be at least 2 characters long.' }}
                </span>
              </div>
            </div>

            <!-- add email formgroup here -->
            <div class="form-group">
              <label for="email">{{ currentLanguage === 'fr' ? 'Email' : 'Email' }}</label>
              <input 
                type="email" 
                id="email" 
                formControlName="email"
                [class.invalid]="contactForm.get('email')?.invalid && (contactForm.get('email')?.touched || contactForm.get('email')?.dirty)">
              <div class="error-message" *ngIf="contactForm.get('email')?.invalid && (contactForm.get('email')?.touched || contactForm.get('email')?.dirty)">
                <span *ngIf="contactForm.get('email')?.errors?.['required']">
                  {{ currentLanguage === 'fr' ? 'L\'email est requis.' : 'Email is required.' }}
                </span>
                <span *ngIf="contactForm.get('email')?.errors?.['email']">
                  {{ currentLanguage === 'fr' ? 'Veuillez entrer une adresse email valide.' : 'Please enter a valid email address.' }}
                </span>
              </div>
            </div>

            <!-- add phone formgroup here -->
            <div class="form-group">
              <label for="phone">{{ currentLanguage === 'fr' ? 'Numéro de téléphone' : 'Phone Number' }}</label>
              <input
                type="tel"
                id="phone"
                formControlName="phone"
                [class.invalid]="contactForm.get('phone')?.invalid && (contactForm.get('phone')?.touched || contactForm.get('phone')?.dirty)">
              <div class="error-message" *ngIf="contactForm.get('phone')?.invalid && (contactForm.get('phone')?.touched || contactForm.get('phone')?.dirty)">
                <span *ngIf="contactForm.get('phone')?.errors?.['required']">
                  {{ currentLanguage === 'fr' ? 'Le numéro de téléphone est requis.' : 'Phone number is required.' }}
                </span>
                <span *ngIf="contactForm.get('phone')?.errors?.['pattern']">
                  {{ currentLanguage === 'fr' ? 'Veuillez entrer un numéro de téléphone valide.' : 'Please enter a valid phone number.' }}
                </span>
              </div>
            </div>

            <!-- add max budget formgroup here -->
            <div class="form-group">
              <label for="maxBudget">{{ currentLanguage === 'fr' ? 'Budget maximum (CAD)' : 'Max Budget (CAD)' }}</label>
              <input
                type="number"
                id="maxBudget"
                formControlName="maxBudget"
                [class.invalid]="contactForm.get('maxBudget')?.invalid && (contactForm.get('maxBudget')?.touched || contactForm.get('maxBudget')?.dirty)">
              <div class="error-message" *ngIf="contactForm.get('maxBudget')?.invalid && (contactForm.get('maxBudget')?.touched || contactForm.get('maxBudget')?.dirty)">
                <span *ngIf="contactForm.get('maxBudget')?.errors?.['required']">
                  {{ currentLanguage === 'fr' ? 'Le budget maximum est requis.' : 'Max budget is required.' }}
                </span>
                <span *ngIf="contactForm.get('maxBudget')?.errors?.['min']">
                  {{ currentLanguage === 'fr' ? 'Le budget doit être supérieur à 0.' : 'Budget must be greater than 0.' }}
                </span>
              </div>
            </div>  

            <div class="form-actions">
              <button 
                type="submit" 
                class="send-email-btn"
                [disabled]="contactForm.invalid || isSubmitting">
                <i class="fas fa-paper-plane" *ngIf="!isSubmitting"></i>
                <i class="fas fa-spinner fa-spin" *ngIf="isSubmitting"></i>
                {{ isSubmitting ? (currentLanguage === 'fr' ? 'Envoi...' : 'Sending...') : (currentLanguage === 'fr' ? 'Soumettre la demande' : 'Submit Request') }}
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

      <section class="about-section">
        <div class="container">
          <div class="about-content">
            <div class="about-text">
              <h2>{{ currentLanguage === 'fr' ? 'À Propos de Montreal4Rent' : 'About Montreal4Rent' }}</h2>
                <p>
                {{ currentLanguage === 'fr' ? 'Montreal4Rent se spécialise dans la location d\u0027appartements de luxe à Montréal. Nous offrons des logements de qualité supérieure dans les meilleurs quartiers de la ville, parfaits pour les étudiants, les professionnels et les familles.' : 'Montreal4Rent specializes in luxury apartment rentals in Montreal. We offer premium housing in the best neighborhoods of the city, perfect for students, professionals, and families.' }}
                </p>
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
      moveInDate: ['', Validators.required],
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[\+]?[1-9][\d]{0,15}$/)]],
      maxBudget: ['', [Validators.required, Validators.min(1)]]
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
      const subject = encodeURIComponent(`Montreal4Rent - Rental Inquiry`);
      const body = encodeURIComponent(
        `Move-in Date: ${formData.moveInDate}\n` +
        `First Name: ${formData.firstName}\n` +
        `Last Name: ${formData.lastName}\n` +
        `Email: ${formData.email}\n` +
        `Phone: ${formData.phone}\n` +
        `Max Budget: $${formData.maxBudget}\n`
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
}