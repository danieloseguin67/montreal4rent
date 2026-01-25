import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LanguageService, Language } from '../../services/language.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-rooms-for-rent',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="rooms-for-rent-page">
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-image">
           <img src="assets/images/rentaroom.jpg" alt="Cozy room rental space" loading="lazy">
        </div>
        <div class="hero-content">
          <div class="container">
            <div class="hero-text">
              <h1>{{ currentLanguage === 'fr' ? 'Chambres à Louer' : 'Rooms for Rent' }}</h1>
              <p class="hero-description">
                {{ currentLanguage === 'fr' 
                  ? 'Découvrez nos chambres confortables et abordables dans le cœur de Montréal. Parfait pour les étudiants et les jeunes professionnels.' 
                  : 'Discover our comfortable and affordable rooms in the heart of Montreal. Perfect for students and young professionals.' }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="features-section">
        <div class="container">
          <h2>{{ currentLanguage === 'fr' ? 'Nos Chambres' : 'Our Rooms' }}</h2>
          
          <div class="room-types-grid">
            <!-- Single Room -->
            <div class="room-type-card">
              <div class="room-image">
                <img src="assets/images/rentaroom2.jpg" alt="Single room" loading="lazy">
              </div>
              <div class="room-content">
                <h3>{{ currentLanguage === 'fr' ? 'Chambre Simple' : 'Single Room' }}</h3>
                <p class="room-description">
                  {{ currentLanguage === 'fr' 
                    ? 'Chambre privée avec lit simple, bureau et espace de rangement. Idéale pour les étudiants qui recherchent un espace personnel abordable.' 
                    : 'Private room with single bed, desk, and storage space. Ideal for students looking for affordable personal space.' }}
                </p>
                <div class="room-features">
                  <div class="feature-item">
                    <i class="fas fa-bed"></i>
                    <span>{{ currentLanguage === 'fr' ? 'Lit simple' : 'Single bed' }}</span>
                  </div>
                  <div class="feature-item">
                    <i class="fas fa-desk"></i>
                    <span>{{ currentLanguage === 'fr' ? 'Bureau' : 'Desk' }}</span>
                  </div>
                  <div class="feature-item">
                    <i class="fas fa-closet"></i>
                    <span>{{ currentLanguage === 'fr' ? 'Garde-robe' : 'Closet' }}</span>
                  </div>
                  <div class="feature-item">
                    <i class="fas fa-wifi"></i>
                    <span>{{ currentLanguage === 'fr' ? 'Wi-Fi gratuit' : 'Free Wi-Fi' }}</span>
                  </div>
                </div>
              </div>
            </div>

            <br>
            <br>

            <!-- Double Room -->
            <div class="room-type-card">
              <div class="room-image">
                <img src="assets/images/rentaroom3.jpg" alt="Double room" loading="lazy">
              </div>
              <div class="room-content">
                <h3>{{ currentLanguage === 'fr' ? 'Chambre Double' : 'Double Room' }}</h3>
                <p class="room-description">
                  {{ currentLanguage === 'fr' 
                    ? 'Chambre spacieuse avec lit double, espace de travail et coin détente. Parfaite pour plus de confort et d&rsquo;espace.' 
                    : 'Spacious room with double bed, work area, and relaxation corner. Perfect for more comfort and space.' }}
                </p>
                <div class="room-features">
                  <div class="feature-item">
                    <i class="fas fa-bed"></i>
                    <span>{{ currentLanguage === 'fr' ? 'Lit double' : 'Double bed' }}</span>
                  </div>
                  <div class="feature-item">
                    <i class="fas fa-couch"></i>
                    <span>{{ currentLanguage === 'fr' ? 'Coin détente' : 'Seating area' }}</span>
                  </div>
                  <div class="feature-item">
                    <i class="fas fa-tv"></i>
                    <span>{{ currentLanguage === 'fr' ? 'Télévision' : 'Television' }}</span>
                  </div>
                  <div class="feature-item">
                    <i class="fas fa-snowflake"></i>
                    <span>{{ currentLanguage === 'fr' ? 'Climatisation' : 'Air conditioning' }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <br>
          <br>

          <!-- Shared Amenities -->
          <div class="shared-amenities">
            <h3>{{ currentLanguage === 'fr' ? 'Espaces Partagés' : 'Shared Spaces' }}</h3>
            <p>
              {{ currentLanguage === 'fr' 
                ? 'Toutes nos chambres incluent l&rsquo;accès aux espaces communs entièrement équipés pour votre confort quotidien.' 
                : 'All our rooms include access to fully equipped common areas for your daily comfort.' }}
            </p>
            <div class="amenities-grid">
              <div class="amenity-item">
                <i class="fas fa-utensils"></i>
                <span>{{ currentLanguage === 'fr' ? 'Cuisine équipée' : 'Equipped kitchen' }}</span>
              </div>
              <div class="amenity-item">
                <i class="fas fa-shower"></i>
                <span>{{ currentLanguage === 'fr' ? 'Salle de bain partagée' : 'Shared bathroom' }}</span>
              </div>
              <div class="amenity-item">
                <i class="fas fa-washer"></i>
                <span>{{ currentLanguage === 'fr' ? 'Buanderie' : 'Laundry' }}</span>
              </div>
              <div class="amenity-item">
                <i class="fas fa-parking"></i>
                <span>{{ currentLanguage === 'fr' ? 'Stationnement' : 'Parking' }}</span>
              </div>
              <div class="sharedroom-image">
                <img src="assets/images/rentaroom4.jpg" alt="Shared room" loading="lazy">
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Contact Form Section -->
      <section class="contact-form-section">
        <div class="container">
          <div class="form-header">
            <h2>{{ currentLanguage === 'fr' ? 'Réservez une chambre' : 'Book a Room' }}</h2>
            <p>{{ currentLanguage === 'fr' ? 'Remplissez le formulaire ci-dessous et nous vous répondrons rapidement.' : 'Fill out the form below and we will get back to you quickly.' }}</p>
          </div>
          
          <form [formGroup]="roomRentalForm" (ngSubmit)="onSubmit()" novalidate>
            <div class="form-group">
              <label for="name">{{ currentLanguage === 'fr' ? 'Nom complet' : 'Full Name' }} *</label>
              <input 
                type="text" 
                id="name"
                formControlName="name"
                maxlength="256"
                [class.invalid]="roomRentalForm.get('name')?.invalid && (roomRentalForm.get('name')?.touched || roomRentalForm.get('name')?.dirty)">
              <div class="error-message" *ngIf="roomRentalForm.get('name')?.invalid && (roomRentalForm.get('name')?.touched || roomRentalForm.get('name')?.dirty)"> 
                <span *ngIf="roomRentalForm.get('name')?.errors?.['required']">
                  {{ currentLanguage === 'fr' ? 'Le nom est requis.' : 'Name is required.' }}
                </span>
                <span *ngIf="roomRentalForm.get('name')?.errors?.['minlength']">
                  {{ currentLanguage === 'fr' ? 'Le nom doit contenir au moins 2 caractères.' : 'Name must be at least 2 characters long.' }}
                </span>
              </div>
            </div>

            <div class="form-group">
              <label for="email">{{ currentLanguage === 'fr' ? 'Courriel' : 'Email' }} *</label>
              <input 
                type="email" 
                id="email" 
                formControlName="email"
                maxlength="256"
                [class.invalid]="roomRentalForm.get('email')?.invalid && (roomRentalForm.get('email')?.touched || roomRentalForm.get('email')?.dirty)">
              <div class="error-message" *ngIf="roomRentalForm.get('email')?.invalid && (roomRentalForm.get('email')?.touched || roomRentalForm.get('email')?.dirty)">
                <span *ngIf="roomRentalForm.get('email')?.errors?.['required']">
                  {{ currentLanguage === 'fr' ? 'L\'email est requis.' : 'Email is required.' }}
                </span>
                <span *ngIf="roomRentalForm.get('email')?.errors?.['email']">
                  {{ currentLanguage === 'fr' ? 'Veuillez entrer une adresse email valide.' : 'Please enter a valid email address.' }}
                </span>
              </div>
            </div>

            <div class="form-group">
              <label for="phone">{{ currentLanguage === 'fr' ? 'Numéro de téléphone' : 'Phone Number' }} *</label>
              <input
                type="tel"
                id="phone"
                formControlName="phone"
                [class.invalid]="roomRentalForm.get('phone')?.invalid && (roomRentalForm.get('phone')?.touched || roomRentalForm.get('phone')?.dirty)">
              <div class="error-message" *ngIf="roomRentalForm.get('phone')?.invalid && (roomRentalForm.get('phone')?.touched || roomRentalForm.get('phone')?.dirty)">
                <span *ngIf="roomRentalForm.get('phone')?.errors?.['required']">
                  {{ currentLanguage === 'fr' ? 'Le numéro de téléphone est requis.' : 'Phone number is required.' }}
                </span>
                <span *ngIf="roomRentalForm.get('phone')?.errors?.['pattern']">
                  {{ currentLanguage === 'fr' ? 'Veuillez entrer un numéro de téléphone valide.' : 'Please enter a valid phone number.' }}
                </span>
              </div>
            </div>

            <div class="form-group">
              <label for="maxBudget">{{ currentLanguage === 'fr' ? 'Budget maximum (CAD)' : 'Max Budget (CAD)' }} *</label>
              <input
                type="number"
                id="maxBudget"
                formControlName="maxBudget"
                [class.invalid]="roomRentalForm.get('maxBudget')?.invalid && (roomRentalForm.get('maxBudget')?.touched || roomRentalForm.get('maxBudget')?.dirty)">
              <div class="error-message" *ngIf="roomRentalForm.get('maxBudget')?.invalid && (roomRentalForm.get('maxBudget')?.touched || roomRentalForm.get('maxBudget')?.dirty)">
                <span *ngIf="roomRentalForm.get('maxBudget')?.errors?.['required']">
                  {{ currentLanguage === 'fr' ? 'Le budget maximum est requis.' : 'Max budget is required.' }}
                </span>
                <span *ngIf="roomRentalForm.get('maxBudget')?.errors?.['min']">
                  {{ currentLanguage === 'fr' ? 'Le budget doit être supérieur à 0.' : 'Budget must be greater than 0.' }}
                </span>
              </div>
            </div>

            <div class="form-group">
              <label for="message">{{ currentLanguage === 'fr' ? 'Message' : 'Message' }}</label>
              <textarea 
                id="message"
                formControlName="message"
                rows="5">
              </textarea>
            </div>

            <div class="form-actions">
              <button 
                type="submit" 
                class="send-email-btn"
                [disabled]="roomRentalForm.invalid || isSubmitting">
                <i class="fas fa-paper-plane" *ngIf="!isSubmitting"></i>
                <i class="fas fa-spinner fa-spin" *ngIf="isSubmitting"></i>
                {{ isSubmitting ? (currentLanguage === 'fr' ? 'Envoi...' : 'Sending...') : (currentLanguage === 'fr' ? 'Envoyer la demande' : 'Send Request') }}
              </button>
            </div>
            
            <div class="form-message success" *ngIf="showSuccessMessage">
              <i class="fas fa-check-circle"></i>
              {{ currentLanguage === 'fr' ? 'Votre message a été envoyé avec succès! Nous vous répondrons bientôt.' : 'Your message has been sent successfully! We\'ll get back to you soon.' }}
            </div>
          </form>
        </div>
      </section>
    </div>
  `,
  styleUrls: ['./rooms-for-rent.component.scss']
})
export class RoomsForRentComponent implements OnInit, OnDestroy {
  currentLanguage: Language = 'fr';
  roomRentalForm: FormGroup;
  isSubmitting = false;
  showSuccessMessage = false;
  private destroy$ = new Subject<void>();

  constructor(
    private languageService: LanguageService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.roomRentalForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[\+]?[1-9][\d]{0,15}$/)]],
      maxBudget: ['', [Validators.required, Validators.min(1)]],
      message: ['']
    });
  }

  ngOnInit(): void {
    this.languageService.currentLanguage$
      .pipe(takeUntil(this.destroy$))
      .subscribe((language) => this.currentLanguage = language);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit(): void {
    if (this.roomRentalForm.valid) {
      this.isSubmitting = true;
      this.showSuccessMessage = false;

      const formData = this.roomRentalForm.value;
      
      const subject = encodeURIComponent('Montreal4Rent - Room Rental Inquiry');
      const body = encodeURIComponent(
        `Name: ${formData.name}\n` +
        `Email: ${formData.email}\n` +
        `Phone: ${formData.phone}\n` +
        `Max Budget: $${formData.maxBudget}\n\n` +
        `Message:\n${formData.message || 'No additional message'}`
      );
      
      const mailtoLink = `mailto:info@montreal4rent.com?subject=${subject}&body=${body}`;
      window.location.href = mailtoLink;
      
      this.isSubmitting = false;
      this.showSuccessMessage = true;
      
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 2000);
    } else {
      Object.keys(this.roomRentalForm.controls).forEach(key => {
        this.roomRentalForm.get(key)?.markAsTouched();
      });
    }
  }
}