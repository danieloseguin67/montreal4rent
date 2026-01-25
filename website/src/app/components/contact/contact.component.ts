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
          <img src="assets/images/contactusbanner.jpg" alt="Contact Us" loading="lazy">
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
            <h2>{{ translations.form.header }}</h2>
            <p>{{ translations.form.subheader }}</p>
          </div>
          
          <!-- add move in date formgroup here -->
          <form [formGroup]="contactForm" (ngSubmit)="onSubmit()" novalidate>

            <div class="form-group">
              <div class="form-label-column">
                <label for="moveInDate">{{ translations.form.moveInDate }}</label>
              </div>
              <div class="form-input-column">
                <input 
                  type="date" 
                  id="moveInDate" 
                  formControlName="moveInDate"
                  [class.invalid]="contactForm.get('moveInDate')?.invalid && (contactForm.get('moveInDate')?.touched || contactForm.get('moveInDate')?.dirty)">
                <div class="error-message" *ngIf="contactForm.get('moveInDate')?.invalid && (contactForm.get('moveInDate')?.touched || contactForm.get('moveInDate')?.dirty)">
                  <span *ngIf="contactForm.get('moveInDate')?.errors?.['required']">
                    {{ translations.form.moveInDateRequired }}
                  </span>
                </div>
              </div>
            </div>

            <!-- add name formgroup here -->
            <div class="form-group">
              <div class="form-label-column">
                <label for="Name">{{ translations.form.name }}</label>
              </div>
              <div class="form-input-column">
                <input 
                  type="text" 
                  id="Name"
                  formControlName="Name"
                  [class.invalid]="contactForm.get('Name')?.invalid && (contactForm.get('Name')?.touched || contactForm.get('Name')?.dirty)">
                <div class="error-message" *ngIf="contactForm.get('Name')?.invalid && (contactForm.get('Name')?.touched || contactForm.get('Name')?.dirty)"> 
                  <span *ngIf="contactForm.get('Name')?.errors?.['required']">
                    {{ translations.form.nameRequired }}
                  </span>
                  <span *ngIf="contactForm.get('Name')?.errors?.['minlength']">
                    {{ translations.form.nameMinLength }}
                  </span>
                </div>
              </div>
            </div>

            <div class="form-group">
              <div class="form-label-column">
                <label for="email">{{ translations.form.email }}</label>
              </div>
              <div class="form-input-column">
                <input 
                  type="email" 
                  id="email" 
                  formControlName="email"
                  maxlength="256"
                  [class.invalid]="contactForm.get('email')?.invalid && (contactForm.get('email')?.touched || contactForm.get('email')?.dirty)">
                <div class="error-message" *ngIf="contactForm.get('email')?.invalid && (contactForm.get('email')?.touched || contactForm.get('email')?.dirty)">
                  <span *ngIf="contactForm.get('email')?.errors?.['required']">
                    {{ translations.form.emailRequired }}
                  </span>
                  <span *ngIf="contactForm.get('email')?.errors?.['email']">
                    {{ translations.form.emailInvalid }}
                  </span>
                </div>
              </div>
            </div>

            <!-- add phone formgroup here -->
            <div class="form-group">
              <div class="form-label-column">
                <label for="phone">{{ translations.form.phone }}</label>
              </div>
              <div class="form-input-column">
                <input
                  type="tel"
                  id="phone"
                  formControlName="phone"
                  [class.invalid]="contactForm.get('phone')?.invalid && (contactForm.get('phone')?.touched || contactForm.get('phone')?.dirty)">
                <div class="error-message" *ngIf="contactForm.get('phone')?.invalid && (contactForm.get('phone')?.touched || contactForm.get('phone')?.dirty)">
                  <span *ngIf="contactForm.get('phone')?.errors?.['required']">
                    {{ translations.form.phoneRequired }}
                  </span>
                  <span *ngIf="contactForm.get('phone')?.errors?.['pattern']">
                    {{ translations.form.phoneInvalid }}
                  </span>
                </div>
              </div>
            </div>

            <!-- add max budget formgroup here -->
            <div class="form-group">
              <div class="form-label-column">
                <label for="maxBudget">{{ translations.form.maxBudget }}</label>
              </div>
              <div class="form-input-column">
                <input
                  type="number"
                  id="maxBudget"
                  formControlName="maxBudget"
                  [class.invalid]="contactForm.get('maxBudget')?.invalid && (contactForm.get('maxBudget')?.touched || contactForm.get('maxBudget')?.dirty)">
                <div class="error-message" *ngIf="contactForm.get('maxBudget')?.invalid && (contactForm.get('maxBudget')?.touched || contactForm.get('maxBudget')?.dirty)">
                  <span *ngIf="contactForm.get('maxBudget')?.errors?.['required']">
                    {{ translations.form.maxBudgetRequired }}
                  </span>
                  <span *ngIf="contactForm.get('maxBudget')?.errors?.['min']">
                    {{ translations.form.maxBudgetMin }}
                  </span>
                </div>
              </div>
            </div>  

            <!-- Unit type form group - mandatory selection from: Studio, 1 bedroom, 2 bedrooms, 3 bedrooms -->
            <div class="form-group">
              <div class="form-label-column">
                <label for="unitType">{{ translations.form.unitType }}</label>
              </div>
              <div class="form-input-column">
                <select 
                  id="unitType"
                  formControlName="unitType"
                  [class.invalid]="contactForm.get('unitType')?.invalid && (contactForm.get('unitType')?.touched || contactForm.get('unitType')?.dirty)">
                  <option value="">{{ translations.form.selectUnitType }}</option>
                  <option value="studio">{{ translations.form.studio }}</option>
                  <option value="1_bedroom">{{ translations.form['1bedroom'] }}</option>
                  <option value="2_bedrooms">{{ translations.form['2bedrooms'] }}</option>  
                  <option value="3_bedrooms">{{ translations.form['3bedrooms'] }}</option>
                </select>
                <div class="error-message" *ngIf="contactForm.get('unitType')?.invalid && (contactForm.get('unitType')?.touched || contactForm.get('unitType')?.dirty)">
                  <span *ngIf="contactForm.get('unitType')?.errors?.['required']">
                    {{ translations.form.unitTypeRequired }}
                  </span>
                </div>
              </div>
            </div>

            <!-- add message formgroup here but non mandatory -->   
            <div class="form-group">
              <div class="form-label-column">
                <label for="message">{{ translations.form.message }}</label>
              </div>
              <div class="form-input-column">
                <textarea 
                  id="message"
                  formControlName="message"
                  rows="8"
                  [class.invalid]="contactForm.get('message')?.invalid && (contactForm.get('message')?.touched || contactForm.get('message')?.dirty)">
                </textarea>   
              </div>
            </div>

            <div class="form-actions">
              <button 
                type="submit" 
                class="send-email-btn"
                [disabled]="contactForm.invalid || isSubmitting">
                <i class="fas fa-paper-plane" *ngIf="!isSubmitting"></i>
                <i class="fas fa-spinner fa-spin" *ngIf="isSubmitting"></i>
                {{ isSubmitting ? translations.form.sending : translations.form.submitRequest }}
              </button>
            </div>
            
            <div class="form-message success" *ngIf="showSuccessMessage">
              <i class="fas fa-check-circle"></i>
              {{ translations.form.successMessage }}
            </div>
            
            <div class="form-message error" *ngIf="showErrorMessage">
              <i class="fas fa-exclamation-circle"></i>
              {{ translations.form.errorMessage }}
            </div>

            </form>

        </div>

      </section>

      <section class="about-section">
        <div class="container">
          <div class="about-content">
            <div class="about-text">
              <h2>{{ translations.aboutAgent.title }}</h2>
              <p>{{ translations.aboutAgent.subtitle }}</p>
              <ul class="services-list">
                <li><i class="fas fa-check"></i> {{ translations.aboutSection.furnished }}</li>
                <li><i class="fas fa-check"></i> {{ translations.aboutSection.student }}</li>
                <li><i class="fas fa-check"></i> {{ translations.aboutSection.premium }}</li>
                <li><i class="fas fa-check"></i> {{ translations.aboutSection.service }}</li>
              </ul>
            </div>
            <div class="about-image">
              <img src="assets/images/contactushouse.jpg" alt="Contact Us" loading="lazy">
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

  translations: any = {
    aboutAgent: {
      title: '',
      subtitle: ''
    },
    aboutSection: {
      furnished: '',
      student: '',
      premium: '',
      service: ''
    },
    form: {
      header: '',
      subheader: '',
      moveInDate: '',
      moveInDateRequired: '',
      name: '',
      nameRequired: '',
      nameMinLength: '',
      email: '',
      emailRequired: '',
      emailInvalid: '',
      phone: '',
      phoneRequired: '',
      phoneInvalid: '',
      maxBudget: '',
      maxBudgetRequired: '',
      maxBudgetMin: '',
      unitType: '',
      unitTypeRequired: '',
      selectUnitType: '',
      studio: '',
      '1bedroom': '',
      '2bedrooms': '',
      '3bedrooms': '',
      message: '',
      messageRequired: '',
      sending: '',
      submitRequest: '',
      successMessage: '',
      errorMessage: ''
    }
  };

  private static readonly TRANSLATIONS = {
    fr: {
      aboutAgent: {
        title: 'À Propos de Montreal4Rent',
        subtitle: 'Montreal4Rent se spécialise dans la location d\'appartements de luxe à Montréal. Nous offrons des logements de qualité supérieure dans les meilleurs quartiers de la ville, parfaits pour les étudiants, les professionnels et les familles.'
      },
      aboutSection: {
        furnished: 'Appartements meublés et non-meublés',
        student: 'Logements adaptés aux étudiants',
        premium: 'Emplacements premium',
        service: 'Service client 24/7'
      },
      form: {
        header: 'Envoyez-nous un message',
        subheader: 'Remplissez le formulaire ci-dessous et nous vous répondrons rapidement.',
        moveInDate: 'Date d\'emménagement',
        moveInDateRequired: 'La date d\'emménagement est requise.',
        name: 'Nom complet',
        nameRequired: 'Le nom est requis.',
        nameMinLength: 'Le nom doit contenir au moins 2 caractères.',
        email: 'Email',
        emailRequired: 'L\'email est requis.',
        emailInvalid: 'Veuillez entrer une adresse email valide.',
        phone: 'Numéro de téléphone',
        phoneRequired: 'Le numéro de téléphone est requis.',
        phoneInvalid: 'Veuillez entrer un numéro de téléphone valide.',
        maxBudget: 'Budget maximum (CAD)',
        maxBudgetRequired: 'Le budget maximum est requis.',
        maxBudgetMin: 'Le budget doit être supérieur à 0.',
        unitType: 'Type d\'unité',
        unitTypeRequired: 'Le type d\'unité est requis.',
        selectUnitType: 'Sélectionner le type d\'unité',
        studio: 'Studio',
        '1bedroom': '1 chambre',
        '2bedrooms': '2 chambres',
        '3bedrooms': '3 chambres',
        message: 'Message',
        messageRequired: 'Le message est requis.',
        sending: 'Envoi...',
        submitRequest: 'Soumettre la demande',
        successMessage: 'Votre message a été envoyé avec succès! Nous vous répondrons bientôt.',
        errorMessage: 'Une erreur est survenue lors de l\'envoi. Veuillez réessayer.'
      }
    },
    en: {
      aboutAgent: {
        title: 'About Montreal4Rent',
        subtitle: 'Montreal4Rent specializes in luxury apartment rentals in Montreal. We offer premium housing in the best neighborhoods of the city, perfect for students, professionals, and families.'
      },
      aboutSection: {
        furnished: 'Furnished and unfurnished apartments',
        student: 'Student-friendly housing',
        premium: 'Premium locations',
        service: '24/7 customer service'
      },
      form: {
        header: 'Send us a message',
        subheader: 'Fill out the form below and we will get back to you quickly.',
        moveInDate: 'Move-in Date',
        moveInDateRequired: 'Move-in date is required.',
        name: 'Name',
        nameRequired: 'Name is required.',
        nameMinLength: 'Name must be at least 2 characters long.',
        email: 'Email',
        emailRequired: 'Email is required.',
        emailInvalid: 'Please enter a valid email address.',
        phone: 'Phone Number',
        phoneRequired: 'Phone number is required.',
        phoneInvalid: 'Please enter a valid phone number.',
        maxBudget: 'Max Budget (CAD)',
        maxBudgetRequired: 'Max budget is required.',
        maxBudgetMin: 'Budget must be greater than 0.',
        unitType: 'Unit Type',
        unitTypeRequired: 'Unit type is required.',
        selectUnitType: 'Select Unit Type',
        studio: 'Studio',
        '1bedroom': '1 Bedroom',
        '2bedrooms': '2 Bedrooms',
        '3bedrooms': '3 Bedrooms',
        message: 'Message',
        messageRequired: 'Message is required.',
        sending: 'Sending...',
        submitRequest: 'Submit Request',
        successMessage: 'Your message has been sent successfully! We\'ll get back to you soon.',
        errorMessage: 'An error occurred while sending. Please try again.'
      }
    }
  };

  constructor(
    private languageService: LanguageService,
    private formBuilder: FormBuilder
  ) {
    this.contactForm = this.formBuilder.group({
      moveInDate: ['', Validators.required],
      Name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[\+]?[1-9][\d]{0,15}$/)]],
      maxBudget: ['', [Validators.required, Validators.min(1)]],
      unitType: ['', Validators.required],
      message: ['']
    });
  }

  ngOnInit(): void {
    this.languageService.currentLanguage$
      .pipe(takeUntil(this.destroy$))
      .subscribe(lang => {
        this.currentLanguage = lang;
        this.setTranslations(lang);
      });
    this.setTranslations(this.currentLanguage);
  }

  setTranslations(lang: Language) {
    const t = ContactComponent.TRANSLATIONS[lang] || ContactComponent.TRANSLATIONS['en'];
    this.translations.aboutAgent.title = t.aboutAgent.title;
    this.translations.aboutAgent.subtitle = t.aboutAgent.subtitle;
    this.translations.aboutSection.furnished = t.aboutSection.furnished;
    this.translations.aboutSection.student = t.aboutSection.student;
    this.translations.aboutSection.premium = t.aboutSection.premium;
    this.translations.aboutSection.service = t.aboutSection.service;
    this.translations.form.header = t.form.header;
    this.translations.form.subheader = t.form.subheader;
    this.translations.form.moveInDate = t.form.moveInDate;
    this.translations.form.moveInDateRequired = t.form.moveInDateRequired;
    this.translations.form.name = t.form.name;
    this.translations.form.nameRequired = t.form.nameRequired;
    this.translations.form.nameMinLength = t.form.nameMinLength;
    this.translations.form.email = t.form.email;
    this.translations.form.emailRequired = t.form.emailRequired;
    this.translations.form.emailInvalid = t.form.emailInvalid;
    this.translations.form.phone = t.form.phone;
    this.translations.form.phoneRequired = t.form.phoneRequired;
    this.translations.form.phoneInvalid = t.form.phoneInvalid;
    this.translations.form.maxBudget = t.form.maxBudget;
    this.translations.form.maxBudgetRequired = t.form.maxBudgetRequired;
    this.translations.form.maxBudgetMin = t.form.maxBudgetMin;
    this.translations.form.unitType = t.form.unitType;
    this.translations.form.unitTypeRequired = t.form.unitTypeRequired;
    this.translations.form.selectUnitType = t.form.selectUnitType;
    this.translations.form.studio = t.form.studio;
    this.translations.form['1bedroom'] = t.form['1bedroom'];
    this.translations.form['2bedrooms'] = t.form['2bedrooms'];
    this.translations.form['3bedrooms'] = t.form['3bedrooms'];
    this.translations.form.message = t.form.message;
    this.translations.form.messageRequired = t.form.messageRequired;
    this.translations.form.sending = t.form.sending;
    this.translations.form.submitRequest = t.form.submitRequest;
    this.translations.form.successMessage = t.form.successMessage;
    this.translations.form.errorMessage = t.form.errorMessage;
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
        `Name: ${formData.Name}\n` +
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