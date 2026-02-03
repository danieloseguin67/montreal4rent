import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LanguageService, Language } from '../../services/language.service';
import { Subject, takeUntil } from 'rxjs';
import { DataService, Apartment, Area } from '../../services/data.service';

@Component({
  selector: 'app-rooms-for-rent',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, CurrencyPipe],
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
                  ? 'Chambres à louer à Montréal — pour étudiants uniquement.' 
                  : 'Rooms for rent in Montreal — for students only.' }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Rooms Listings (no filters) -->
      <section class="apartments-grid-section">
        <div class="container">
          <!-- Loading State -->
          <div class="text-center" *ngIf="loading">
            <div class="spinner"></div>
            <p>{{ t.common?.loading || (currentLanguage === 'fr' ? 'Chargement...' : 'Loading...') }}</p>
          </div>

          <!-- Rooms Grid -->
          <div class="apartments-grid" *ngIf="!loading && roomApartments.length > 0">
            <div 
              class="apartment-card card slide-up" 
              *ngFor="let apartment of roomApartments; trackBy: trackByApartment"
            >
              <div class="apartment-image">
                <img 
                  [src]="'assets/images/' + apartment.images[0]" 
                  [alt]="currentLanguage === 'fr' ? apartment.title : apartment.titleEn"
                  onerror="this.src='assets/images/' + apartment.images[0]"
                >
                <div class="apartment-badge" [class.available]="apartment.available">
                  {{ apartment.available ? (t.common?.available || (currentLanguage === 'fr' ? 'Disponible' : 'Available')) : (t.common?.notAvailable || (currentLanguage === 'fr' ? 'Non disponible' : 'Not Available')) }}
                </div>
                <div class="apartment-price">{{ apartment.price | currency:'CAD':'symbol':'1.0-0' }}/{{ t.common?.month || (currentLanguage === 'fr' ? 'mois' : 'month') }}</div>
                <div class="image-overlay">
                  <button class="btn btn-primary btn-sm" [routerLink]="['/appartement', apartment.id]">
                    {{ t.common?.viewDetails || (currentLanguage === 'fr' ? 'Voir détails' : 'View Details') }}
                  </button>
                </div>
              </div>
              
              <div class="card-body">
                <h3 class="apartment-title">
                  {{ currentLanguage === 'fr' ? apartment.title : apartment.titleEn }}
                </h3>
                
                <div class="apartment-details">
                  <div class="detail-item">
                    <i class="fas fa-bed"></i>
                    <span>{{ getUnitType(apartment) }}</span>
                  </div>
                  <div class="detail-item">
                    <i class="fas fa-bath"></i>
                    <span>
                      {{ apartment.bathrooms }} 
                      {{ apartment.bathrooms === 1 ? (t.common?.bathroom || (currentLanguage === 'fr' ? 'salle de bain' : 'bathroom')) : (t.common?.bathrooms || (currentLanguage === 'fr' ? 'salles de bain' : 'bathrooms')) }}
                    </span>
                  </div>
                  <div class="detail-item">
                    <i class="fas fa-ruler-combined"></i>
                    <span>{{ apartment.squareFootage }} {{ t.common?.sqft || 'sqft' }}</span>
                  </div>
                  <div class="detail-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>{{ getAreaName(apartment.area) }}</span>
                  </div>
                </div>

                <div class="apartment-features">
                  <span class="feature-badge" [class.furnished]="apartment.furnished">
                    {{ apartment.furnished ? (t.common?.furnished || (currentLanguage === 'fr' ? 'Meublé' : 'Furnished')) : (t.common?.unfurnished || (currentLanguage === 'fr' ? 'Non meublé' : 'Unfurnished')) }}
                  </span>
                </div>

                <div class="apartment-description">
                  <p>{{ currentLanguage === 'fr' ? apartment.description : apartment.descriptionEn }}</p>
                </div>

                <div class="apartment-actions">
                  <a 
                    [routerLink]="['/appartement', apartment.id]" 
                    class="btn btn-primary"
                  >
                    {{ t.common?.viewDetails || (currentLanguage === 'fr' ? 'Voir détails' : 'View Details') }}
                  </a>
                  <button 
                    class="btn btn-outline"
                    *ngIf="apartment.available"
                    (click)="bookTour(apartment)"
                  >
                    {{ t.common?.bookNow || (currentLanguage === 'fr' ? 'Réserver' : 'Book Now') }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- No Results -->
          <div class="no-results text-center" *ngIf="!loading && roomApartments.length === 0">
            <i class="fas fa-search"></i>
            <h3>{{ currentLanguage === 'fr' ? 'Aucun résultat' : 'No results' }}</h3>
            <p>{{ currentLanguage === 'fr' ? 'Aucune chambre à louer trouvée.' : 'No rooms for rent found.' }}</p>
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

  // Rooms listing state
  apartments: Apartment[] = [];
  roomApartments: Apartment[] = [];
  areas: Area[] = [];
  loading = true;
  t: any = {};

  constructor(
    private languageService: LanguageService,
    private formBuilder: FormBuilder,
    private router: Router,
    private dataService: DataService
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

    this.languageService.getCurrentTranslations()
      .pipe(takeUntil(this.destroy$))
      .subscribe(translations => this.t = translations);

    // Load apartments and filter for rooms only
    this.dataService.getApartments()
      .pipe(takeUntil(this.destroy$))
      .subscribe(apartments => {
        this.apartments = apartments;
        this.roomApartments = apartments.filter(a => !!a.roomtorent);
        this.loading = false;
      });

    // Load areas for display names
    this.dataService.getAreas()
      .pipe(takeUntil(this.destroy$))
      .subscribe(areas => this.areas = areas);
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

  // Helpers reused from apartments page for consistent display
  getAreaName(areaId: string): string {
    const area = this.areas.find(a => a.id === areaId);
    if (!area) return areaId;
    return this.currentLanguage === 'fr' ? area.nameFr : area.nameEn;
  }

  trackByApartment(index: number, apartment: Apartment): string {
    return apartment.id;
  }

  bookTour(apartment?: Apartment): void {
    const bookingEvent = new CustomEvent('openBookingModal');
    window.dispatchEvent(bookingEvent);
  }

  getBedrooms(apartment: Apartment): number {
    if (typeof apartment.bedrooms === 'number') return apartment.bedrooms;
    const name = (apartment.unit_type_name || '').toLowerCase();
    if (name.includes('studio')) return 0;
    if (name.startsWith('1')) return 1;
    if (name.startsWith('2')) return 2;
    if (name.startsWith('3')) return 3;
    const m = name.match(/(\d+)/);
    return m ? parseInt(m[1], 10) : 0;
  }

  getUnitType(apartment: Apartment): string {
    return apartment.unit_type_name || (this.getBedrooms(apartment) === 0 ? 'Studio' : `${this.getBedrooms(apartment)} Bedroom${this.getBedrooms(apartment) > 1 ? 's' : ''}`);
  }
}