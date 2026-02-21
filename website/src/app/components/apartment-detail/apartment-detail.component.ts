import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { DataService, Apartment, Area } from '../../services/data.service';
import { LanguageService } from '../../services/language.service';
import { CacheBustingService } from '../../services/cache-busting.service';
import { Subject, takeUntil, switchMap } from 'rxjs';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-apartment-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <main #detailMain tabindex="-1">
      <div class="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {{ liveAnnouncement }}
      </div>

      <div class="apartment-detail" *ngIf="apartment">
      <!-- Hero Section -->
      <section class="apartment-hero">
        <div class="hero-image">
          <!-- Navigation Bar -->
          <div class="detail-navigation">
            <div class="container">
              <button class="btn btn-outline back-btn" (click)="goBack()" [attr.aria-label]="t.common?.back || 'Back'">
                <i class="fas fa-arrow-left" aria-hidden="true"></i>
                {{ t.common?.back || 'Retour' }}
              </button>
              <span class="breadcrumb">{{ t.navigation?.apartments }} / {{ currentLanguage === 'fr' ? apartment.title : apartment.titleEn }}</span>
            </div>
          </div>
          
          <img 
            [src]="getImageUrl(apartment.images[currentImageIndex])" 
            [alt]="currentLanguage === 'fr' ? apartment.title : apartment.titleEn"
            loading="eager"
            fetchpriority="high"
            decoding="async"
            (load)="onImageLoad()"
            (error)="onImageError($event, apartment)"
          >
          <div class="image-navigation" *ngIf="apartment.images.length > 1">
            <button 
              class="nav-btn prev" 
              (click)="previousImage()"
              [disabled]="currentImageIndex === 0"
              [attr.aria-label]="currentLanguage === 'fr' ? 'Image précédente' : 'Previous image'"
            >
              <i class="fas fa-chevron-left" aria-hidden="true"></i>
            </button>
            <button 
              class="nav-btn next" 
              (click)="nextImage()"
              [disabled]="currentImageIndex === apartment.images.length - 1"
              [attr.aria-label]="currentLanguage === 'fr' ? 'Image suivante' : 'Next image'"
            >
              <i class="fas fa-chevron-right" aria-hidden="true"></i>
            </button>
          </div>
          <div class="image-counter" *ngIf="apartment.images.length > 1">
            {{ currentImageIndex + 1 }} / {{ apartment.images.length }}
          </div>
        </div>
        
        <div class="hero-content" [class.visible]="imageLoaded">
          <div class="container">
            <div class="apartment-header">
              <div class="apartment-title-section">
                <h1
                  #pageHeading
                  tabindex="-1"
                  [attr.aria-label]="getListingAnnouncement(apartment)"
                >
                  {{ currentLanguage === 'fr' ? apartment.title : apartment.titleEn }}
                </h1>
                <div class="apartment-location">
                  <i class="fas fa-map-marker-alt" aria-hidden="true"></i>
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
          <div class="info-grid" role="list" aria-label="Apartment quick facts">
            <div
              class="info-item"
              role="listitem"
              tabindex="0"
              [attr.aria-label]="(apartment.bedrooms === 1 ? (t.common?.bedroom || 'Bedroom') : (t.common?.bedrooms || 'Bedrooms')) + ': ' + apartment.bedrooms"
            >
              <i class="fas fa-bed" aria-hidden="true"></i>
              <div>
                <span class="value">{{ apartment.bedrooms }}</span>
                <span class="label">{{ apartment.bedrooms === 1 ? t.common?.bedroom : t.common?.bedrooms }}</span>
              </div>
            </div>
            <div
              class="info-item"
              role="listitem"
              tabindex="0"
              [attr.aria-label]="(apartment.bathrooms === 1 ? (t.common?.bathroom || 'Bathroom') : (t.common?.bathrooms || 'Bathrooms')) + ': ' + apartment.bathrooms"
            >
              <i class="fas fa-bath" aria-hidden="true"></i>
              <div>
                <span class="value">{{ apartment.bathrooms }}</span>
                <span class="label">{{ apartment.bathrooms === 1 ? t.common?.bathroom : t.common?.bathrooms }}</span>
              </div>
            </div>
            <div
              class="info-item"
              role="listitem"
              tabindex="0"
              [attr.aria-label]="(t.common?.sqft || 'Square feet') + ': ' + apartment.squareFootage"
            >
              <i class="fas fa-ruler-combined" aria-hidden="true"></i>
              <div>
                <span class="value">{{ apartment.squareFootage }}</span>
                <span class="label">{{ t.common?.sqft }}</span>
              </div>
            </div>
            <div
              class="info-item"
              role="listitem"
              tabindex="0"
              [attr.aria-label]="(currentLanguage === 'fr' ? 'Type' : 'Type') + ': ' + (apartment.furnished ? (t.common?.furnished || 'Furnished') : (t.common?.unfurnished || 'Unfurnished'))"
            >
              <i class="fas fa-home" aria-hidden="true"></i>
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
                <h2 id="apartment-description-title">Description</h2>
                <p
                  class="sr-only"
                  tabindex="0"
                  (focus)="announceDescription(apartment)"
                >
                  {{ getListingAnnouncement(apartment) }}. {{ getSanitizedDescription(apartment) }}
                </p>

                <p class="description" aria-hidden="true">
                  {{ currentLanguage === 'fr' ? apartment.description : apartment.descriptionEn }}
                </p>
              </div>

              <div class="content-section" *ngIf="((currentLanguage === 'fr' ? apartment.features : apartment.featuresEn) || []).length > 0">
                <h2 id="apartment-features-title">Caractéristiques</h2>
                <ul class="features-grid" role="list" tabindex="0" (focus)="announceFeatures(apartment)" aria-labelledby="apartment-features-title">
                  <li 
                    class="feature-item" 
                    *ngFor="let feature of (currentLanguage === 'fr' ? apartment.features : apartment.featuresEn)"
                  >
                    <i class="fas fa-check" aria-hidden="true"></i>
                    <span>{{ feature }}</span>
                  </li>
                </ul>
              </div>

              <!-- Image Gallery -->
              <div class="content-section" *ngIf="apartment.images.length > 1">
                <h2>Galerie</h2>
                <div class="gallery-grid">
                  <button 
                    type="button"
                    class="gallery-item" 
                    *ngFor="let image of apartment.images; let i = index"
                    (click)="selectImage(i)"
                    [class.active]="i === currentImageIndex"
                    [attr.aria-label]="(currentLanguage === 'fr' ? 'Sélectionner l’image ' : 'Select image ') + (i + 1)"
                  >
                    <img 
                      [src]="getImageUrl(image)" 
                      alt=""
                      aria-hidden="true"
                      loading="lazy"
                      decoding="async"
                      (error)="onImageError($event, apartment)"
                    >
                  </button>
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
                      <div class="agent-details">
                        <h3>{{ currentLanguage === 'fr' ? 'Agent de location' : 'Leasing Agent' }}</h3>
                        <p>{{ currentLanguage === 'fr' ? 'Montreal4Rent' : 'Montreal4Rent' }}</p>
                      </div>
                    </div>

                    <div class="contact-actions">
                      <button class="btn btn-primary btn-block" (click)="bookTour()">
                        <i class="fas fa-calendar-alt" aria-hidden="true"></i>
                        {{ t.navigation?.bookTour }}
                      </button>
                      <div class="contact-actions2">
                        <a href="mailto:Rental.express.ca@gmail.com" class="btn btn-primary btn-block">
                          <i class="fas fa-envelope" aria-hidden="true"></i>
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
                    <button 
                      type="button"
                      class="similar-item" 
                      *ngFor="let similar of similarApartments"
                      (click)="openSimilarApartment(similar.id)"
                      [attr.aria-label]="currentLanguage === 'fr' ? ('Voir appartement ' + similar.title) : ('View apartment ' + similar.titleEn)"
                    >
                      <div class="similar-image">
                        <img 
                          [src]="getImageUrl(similar.images[0])" 
                          alt=""
                          aria-hidden="true"
                          loading="lazy"
                          decoding="async"
                          (error)="onImageError($event, similar)"
                        >
                      </div>
                      <div class="similar-content">
                        <h4>{{ currentLanguage === 'fr' ? similar.title : similar.titleEn }}</h4>
                        <p class="similar-price">{{ similar.price | currency:'CAD':'symbol':'1.0-0' }}/mois</p>
                        <div class="similar-details">
                          {{ similar.bedrooms }} ch. • {{ similar.bathrooms }} sdb
                        </div>
                      </div>
                    </button>
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
        <i class="fas fa-exclamation-triangle" aria-hidden="true"></i>
        <h2>Appartement non trouvé</h2>
        <p>L'appartement que vous recherchez n'existe pas ou n'est plus disponible.</p>
        <button type="button" class="btn btn-primary" (click)="openAllApartments()">
          {{ currentLanguage === 'fr' ? 'Voir tous les appartements' : 'View all apartments' }}
        </button>
      </div>
    </main>
  `,
  styleUrls: ['./apartment-detail.component.scss']
})
export class ApartmentDetailComponent implements OnInit, OnDestroy {
  apartment: Apartment | null = null;
  similarApartments: Apartment[] = [];
  areas: Area[] = [];
  currentImageIndex = 0;
  loading = true;
  imageLoaded = false;
  t: any = {};
  currentLanguage = 'fr';

  liveAnnouncement = '';

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private languageService: LanguageService,
    private location: Location,
    private cacheBusting: CacheBustingService,
    private router: Router,
    private titleService: Title
  ) {}

  announceDescription(apartment: Apartment): void {
    const text = `${this.getListingAnnouncement(apartment)}. ${this.getSanitizedDescription(apartment)}`.trim();
    this.setLiveAnnouncement(text);
  }

  announceFeatures(apartment: Apartment): void {
    const features = (this.currentLanguage === 'fr' ? apartment.features : apartment.featuresEn) || [];
    if (features.length === 0) return;
    const heading = this.currentLanguage === 'fr' ? 'Caractéristiques' : 'Features';
    this.setLiveAnnouncement(`${heading}. ${features.join(', ')}`);
  }

  private setLiveAnnouncement(text: string): void {
    // Clear first so screen readers re-announce reliably.
    this.liveAnnouncement = '';
    setTimeout(() => {
      this.liveAnnouncement = text;
    }, 0);
  }

  getListingAnnouncement(apartment: Apartment): string {
    const title = this.currentLanguage === 'fr' ? apartment.title : apartment.titleEn;
    const areaName = this.getAreaName(apartment.area);
    const availability = apartment.available
      ? (this.currentLanguage === 'fr' ? 'Disponible maintenant' : 'Available now')
      : (this.currentLanguage === 'fr' ? 'Non disponible' : 'Not available');

    const locationParts = [title, areaName, 'Montréal'].filter(part => !!(part || '').trim());
    return `${availability} — ${locationParts.join(', ')}`;
  }

  getSanitizedDescription(apartment: Apartment): string {
    const raw = (this.currentLanguage === 'fr' ? apartment.description : apartment.descriptionEn) || '';
    return this.stripEmojis(raw)
      .replace(/\s+/g, ' ')
      .replace(/\s+([,.;:!?])/g, '$1')
      .trim();
  }

  private stripEmojis(text: string): string {
    // Remove emoji/pictographs so screen readers don't stop or announce them.
    try {
      return text.replace(/\p{Extended_Pictographic}/gu, ' ');
    } catch {
      return text.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, ' ');
    }
  }

  openAllApartments(): void {
    const path = this.currentLanguage === 'fr' ? '/appartements' : '/apartments';
    this.router.navigate([path]);
  }

  openSimilarApartment(apartmentId: string): void {
    const basePath = this.currentLanguage === 'fr' ? '/appartement' : '/apartments';
    const url = this.router.serializeUrl(this.router.createUrlTree([basePath, apartmentId]));
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  ngOnInit(): void {
    // Scroll to top when component loads
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
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
          // Reset image index when loading new apartment
          this.currentImageIndex = 0;
          // Reset image loaded state
          this.imageLoaded = false;
          // Scroll to top when switching apartments
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return id ? this.dataService.getApartment(id) : [];
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(apartment => {
        this.apartment = apartment || null;
        this.loading = false;
        
        if (apartment) {
          this.updatePageMetadataAndAnnounce(apartment);
          this.loadSimilarApartments(apartment);
        }
      });
  }

  private updatePageMetadataAndAnnounce(apartment: Apartment): void {
    const title = this.currentLanguage === 'fr' ? apartment.title : apartment.titleEn;
    this.titleService.setTitle(title);
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
      this.imageLoaded = false;
      this.currentImageIndex--;
    }
  }

  nextImage(): void {
    if (this.apartment && this.currentImageIndex < this.apartment.images.length - 1) {
      this.imageLoaded = false;
      this.currentImageIndex++;
    }
  }

  selectImage(index: number): void {
    this.imageLoaded = false;
    this.currentImageIndex = index;
  }

  bookTour(): void {
    // Trigger the header booking modal by dispatching a custom event
    const bookingEvent = new CustomEvent('openBookingModal');
    window.dispatchEvent(bookingEvent);
  }

  getImageUrl(imagePath: string): string {
    return this.cacheBusting.getImageUrl(imagePath);
  }

  onImageLoad(): void {
    this.imageLoaded = true;
  }

  onImageError(event: Event, apartment: any) {
    const img = event.target as HTMLImageElement;
    // Prevent infinite error loop
    if (!img.src.includes('image-not-available')) {
      img.src = this.cacheBusting.getImageUrl('image-not-available.svg');
      // Don't set imageLoaded yet - let the fallback image load first
    } else {
      // Fallback image also failed, show the content anyway
      this.imageLoaded = true;
    }
  }
}