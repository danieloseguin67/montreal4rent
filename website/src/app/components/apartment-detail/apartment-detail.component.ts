import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { DataService, Apartment, Area } from '../../services/data.service';
import { LanguageService } from '../../services/language.service';
import { Subject, takeUntil, switchMap } from 'rxjs';

@Component({
  selector: 'app-apartment-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="apartment-detail" *ngIf="apartment">
      <!-- Navigation Bar -->
      <div class="detail-navigation">
        <div class="container">
          <button class="btn btn-outline back-btn" (click)="goBack()">
            <i class="fas fa-arrow-left"></i>
            {{ t.common?.back || 'Retour' }}
          </button>
          <span class="breadcrumb">{{ t.navigation?.apartments }} / {{ currentLanguage === 'fr' ? apartment.title : apartment.titleEn }}</span>
        </div>
      </div>

      <!-- Hero Section -->
      <section class="apartment-hero">
        <div class="hero-image">
          <img 
            [src]="'assets/images/' + apartment.images[currentImageIndex]" 
            [alt]="currentLanguage === 'fr' ? apartment.title : apartment.titleEn"
            onerror="this.src='assets/images/placeholder-apartment.jpg'"
          >
          <div class="image-navigation" *ngIf="apartment.images.length > 1">
            <button 
              class="nav-btn prev" 
              (click)="previousImage()"
              [disabled]="currentImageIndex === 0"
            >
              <i class="fas fa-chevron-left"></i>
            </button>
            <button 
              class="nav-btn next" 
              (click)="nextImage()"
              [disabled]="currentImageIndex === apartment.images.length - 1"
            >
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
          <div class="image-counter" *ngIf="apartment.images.length > 1">
            {{ currentImageIndex + 1 }} / {{ apartment.images.length }}
          </div>
        </div>
        
        <div class="hero-content">
          <div class="container">
            <div class="apartment-header">
              <div class="apartment-title-section">
                <h1>{{ currentLanguage === 'fr' ? apartment.title : apartment.titleEn }}</h1>
                <div class="apartment-location">
                  <i class="fas fa-map-marker-alt"></i>
                  <span>{{ getAreaName(apartment.area) }}, Montréal</span>
                </div>
              </div>
              
              <div class="apartment-price-section">
                <div class="price">{{ apartment.price | currency:'CAD':'symbol':'1.0-0' }}</div>
                <div class="price-period">/{{ t.common?.month }}</div>
                <div class="availability" [class.available]="apartment.available">
                  {{ apartment.available ? t.common?.available : t.common?.notAvailable }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Quick Info Bar -->
      <section class="quick-info">
        <div class="container">
          <div class="info-grid">
            <div class="info-item">
              <i class="fas fa-bed"></i>
              <div>
                <span class="value">{{ apartment.bedrooms }}</span>
                <span class="label">{{ apartment.bedrooms === 1 ? t.common?.bedroom : t.common?.bedrooms }}</span>
              </div>
            </div>
            <div class="info-item">
              <i class="fas fa-bath"></i>
              <div>
                <span class="value">{{ apartment.bathrooms }}</span>
                <span class="label">{{ apartment.bathrooms === 1 ? t.common?.bathroom : t.common?.bathrooms }}</span>
              </div>
            </div>
            <div class="info-item">
              <i class="fas fa-ruler-combined"></i>
              <div>
                <span class="value">{{ apartment.squareFootage }}</span>
                <span class="label">{{ t.common?.sqft }}</span>
              </div>
            </div>
            <div class="info-item">
              <i class="fas fa-home"></i>
              <div>
                <span class="value">{{ apartment.furnished ? t.common?.furnished : t.common?.unfurnished }}</span>
                <span class="label">Type</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Main Content -->
      <section class="apartment-content">
        <div class="container">
          <div class="row">
            <!-- Description and Features -->
            <div class="col col-12 col-lg-8">
              <div class="content-section">
                <h2>Description</h2>
                <p class="description">
                  {{ currentLanguage === 'fr' ? apartment.description : apartment.descriptionEn }}
                </p>
              </div>

              <div class="content-section">
                <h2>Caractéristiques</h2>
                <div class="features-grid">
                  <div 
                    class="feature-item" 
                    *ngFor="let feature of (currentLanguage === 'fr' ? apartment.features : apartment.featuresEn)"
                  >
                    <i class="fas fa-check"></i>
                    <span>{{ feature }}</span>
                  </div>
                </div>
              </div>

              <!-- Image Gallery -->
              <div class="content-section" *ngIf="apartment.images.length > 1">
                <h2>Galerie</h2>
                <div class="gallery-grid">
                  <div 
                    class="gallery-item" 
                    *ngFor="let image of apartment.images; let i = index"
                    (click)="selectImage(i)"
                    [class.active]="i === currentImageIndex"
                  >
                    <img 
                      [src]="'assets/images/' + image" 
                      [alt]="'Image ' + (i + 1)"
                      onerror="this.src='assets/images/placeholder-apartment.jpg'"
                    >
                  </div>
                </div>
              </div>
            </div>

            <!-- Sidebar -->
            <div class="col col-12 col-lg-4">
              <div class="sidebar">
                <!-- Contact Card -->
                <div class="contact-card card">
                  <div class="card-body">
                    <div class="agent-info">
                      <div class="agent-avatar">
                        <img 
                          src="assets/images/placeholder-apartment.jpg" 
                          alt="Jessica Larmour"
                          onerror="this.src='assets/images/placeholder-apartment.jpg'"
                        >
                      </div>
                      <div class="agent-details">
                        <h3>Jessica Larmour</h3>
                        <p>Agent immobilier</p>
                      </div>
                    </div>

                    <div class="contact-actions">
                      <button class="btn btn-primary btn-block" (click)="bookTour()">
                        <i class="fas fa-calendar-alt"></i>
                        {{ t.navigation?.bookTour }}
                      </button>
                      <div class="contact-options">
                        <a href="tel:4385081566" class="btn btn-outline">
                          <i class="fas fa-phone"></i>
                          Appeler
                        </a>
                        <a href="mailto:larmour.j.a@gmail.com" class="btn btn-outline">
                          <i class="fas fa-envelope"></i>
                          Email
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Similar Apartments -->
                <div class="similar-apartments" *ngIf="similarApartments.length > 0">
                  <h3>Appartements similaires</h3>
                  <div class="similar-list">
                    <div 
                      class="similar-item" 
                      *ngFor="let similar of similarApartments"
                      [routerLink]="['/appartement', similar.id]"
                    >
                      <div class="similar-image">
                        <img 
                          [src]="'assets/images/' + similar.images[0]" 
                          [alt]="currentLanguage === 'fr' ? similar.title : similar.titleEn"
                          onerror="this.src='assets/images/placeholder-apartment.jpg'"
                        >
                      </div>
                      <div class="similar-content">
                        <h4>{{ currentLanguage === 'fr' ? similar.title : similar.titleEn }}</h4>
                        <p class="similar-price">{{ similar.price | currency:'CAD':'symbol':'1.0-0' }}/mois</p>
                        <div class="similar-details">
                          {{ similar.bedrooms }} ch. • {{ similar.bathrooms }} sdb
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Loading State -->
    <div class="loading-container text-center" *ngIf="loading">
      <div class="spinner"></div>
      <p>{{ t.common?.loading }}</p>
    </div>

    <!-- Error State -->
    <div class="error-container text-center" *ngIf="!loading && !apartment">
      <i class="fas fa-exclamation-triangle"></i>
      <h2>Appartement non trouvé</h2>
      <p>L'appartement que vous recherchez n'existe pas ou n'est plus disponible.</p>
      <a routerLink="/appartements" class="btn btn-primary">
        Voir tous les appartements
      </a>
    </div>
  `,
  styleUrls: ['./apartment-detail.component.scss']
})
export class ApartmentDetailComponent implements OnInit, OnDestroy {
  apartment: Apartment | null = null;
  similarApartments: Apartment[] = [];
  areas: Area[] = [];
  currentImageIndex = 0;
  loading = true;
  t: any = {};
  currentLanguage = 'fr';

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private languageService: LanguageService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.subscribeToLanguageChanges();
    this.loadApartment();
    this.loadAreas();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  goBack(): void {
    this.location.back();
  }

  private loadApartment(): void {
    this.route.paramMap
      .pipe(
        switchMap(params => {
          const id = params.get('id');
          return id ? this.dataService.getApartment(id) : [];
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(apartment => {
        this.apartment = apartment || null;
        this.loading = false;
        
        if (apartment) {
          this.loadSimilarApartments(apartment);
        }
      });
  }

  private loadSimilarApartments(apartment: Apartment): void {
    this.dataService.getApartmentsByArea(apartment.area)
      .pipe(takeUntil(this.destroy$))
      .subscribe(apartments => {
        this.similarApartments = apartments
          .filter(apt => apt.id !== apartment.id && apt.available)
          .slice(0, 3);
      });
  }

  private loadAreas(): void {
    this.dataService.getAreas()
      .pipe(takeUntil(this.destroy$))
      .subscribe(areas => this.areas = areas);
  }

  private subscribeToLanguageChanges(): void {
    this.languageService.currentLanguage$
      .pipe(takeUntil(this.destroy$))
      .subscribe(lang => this.currentLanguage = lang);

    this.languageService.getCurrentTranslations()
      .pipe(takeUntil(this.destroy$))
      .subscribe(translations => this.t = translations);
  }

  getAreaName(areaId: string): string {
    const area = this.areas.find(a => a.id === areaId);
    if (!area) return areaId;
    return this.currentLanguage === 'fr' ? area.nameFr : area.nameEn;
  }

  previousImage(): void {
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
    }
  }

  nextImage(): void {
    if (this.apartment && this.currentImageIndex < this.apartment.images.length - 1) {
      this.currentImageIndex++;
    }
  }

  selectImage(index: number): void {
    this.currentImageIndex = index;
  }

  bookTour(): void {
    // Trigger the header booking modal by dispatching a custom event
    const bookingEvent = new CustomEvent('openBookingModal');
    window.dispatchEvent(bookingEvent);
  }
}