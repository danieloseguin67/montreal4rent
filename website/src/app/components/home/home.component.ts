import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DataService, Apartment, Area } from '../../services/data.service';
import { LanguageService } from '../../services/language.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-background">
        <div class="hero-overlay"></div>
      </div>
      <div class="container">
        <div class="hero-content">
          <div class="hero-text fade-in">
            <h1>{{ t.home?.hero?.title }}</h1>
            <p class="hero-subtitle">{{ t.home?.hero?.subtitle }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Search Section -->
    <section class="search-section">
      <div class="container">
        <div class="search-card card">
          <div class="card-body">
            <div class="search-header">
              <h2 class="text-center mb-3">{{ t.home?.search?.title }}</h2>
              <div class="text-center mb-3">
                <button 
                  class="btn btn-filters-toggle" 
                  (click)="toggleFilters()"
                  [attr.aria-expanded]="showFilters"
                  [attr.aria-controls]="'search-filters'"
                >
                  <i class="fas" [class.fa-chevron-down]="!showFilters" [class.fa-chevron-up]="showFilters"></i>
                  {{ showFilters ? (t.home?.search?.hideFilters || 'Hide Filters') : (t.home?.search?.showFilters || 'Show Filters') }}
                </button>
              </div>
            </div>
            
            <div 
              class="search-form collapse"
              [class.show]="showFilters"
              id="search-filters"
            >
              <div class="row">
                <div class="col col-12 col-md-3">
                  <div class="form-group">
                    <label class="form-label">{{ t.home?.search?.area }}</label>
                    <select 
                      class="form-control form-select" 
                      [(ngModel)]="selectedArea"
                      (change)="onFiltersChanged()"
                    >
                      <option value="">{{ t.home?.search?.allAreas }}</option>
                      <option *ngFor="let area of areas" [value]="area.id">
                        {{ currentLanguage === 'fr' ? area.nameFr : area.nameEn }}
                      </option>
                    </select>
                  </div>
                </div>
                <div class="col col-12 col-md-3">
                  <div class="form-group">
                    <label class="form-label">{{ t.common?.bedrooms }}</label>
                    <select 
                      class="form-control form-select" 
                      [(ngModel)]="selectedBedrooms"
                      (change)="onFiltersChanged()"
                    >
                      <option value="">{{ t.home?.search?.allBedrooms }}</option>
                      <option value="0">Studio</option>
                      <option value="1">1 {{ t.common?.bedroom }}</option>
                      <option value="2">2 {{ t.common?.bedrooms }}</option>
                      <option value="3">3+ {{ t.common?.bedrooms }}</option>
                    </select>
                  </div>
                </div>
                <div class="col col-12 col-md-3">
                  <div class="form-group">
                    <label class="form-label">{{ t.home?.search?.maxPrice }}</label>
                    <select 
                      class="form-control form-select" 
                      [(ngModel)]="selectedMaxPrice"
                      (change)="onFiltersChanged()"
                    >
                      <option value="">{{ t.home?.search?.allPrices }}</option>
                      <option value="1000">1 000 $</option>
                      <option value="1500">1 500 $</option>
                      <option value="2000">2 000 $</option>
                      <option value="2500">2 500 $</option>
                      <option value="3000">3 000 $</option>
                      <option value="3500">3 500 $</option>
                      <option value="4000">4 000 $</option>
                      <option value="4500">4 500 $</option>
                      <option value="5000">5 000 $+</option>
                    </select>
                  </div>
                </div>
                <div class="col col-12 col-md-3">
                  <div class="form-group">
                    <label class="form-label">{{ t.home?.search?.sortBy }}</label>
                    <select 
                      class="form-control form-select" 
                      [(ngModel)]="sortBy"
                      (change)="onFiltersChanged()"
                    >
                      <option value="price-asc">{{ t.home?.search?.priceAsc }}</option>
                      <option value="price-desc">{{ t.home?.search?.priceDesc }}</option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="text-center mt-3">
                <button 
                  class="btn btn-outline" 
                  (click)="clearFilters()"
                  *ngIf="hasActiveFilters()"
                >
                  {{ t.common?.clear }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Apartments -->
    <section class="featured-apartments">
      <div class="container">
        <div class="section-header text-center mb-5">
          <h2>{{ t.home?.featured?.title }}</h2>
          <p class="section-subtitle">{{ t.home?.featured?.subtitle }}</p>
        </div>

        <!-- Loading State -->
        <div class="text-center" *ngIf="loading">
          <div class="spinner"></div>
          <p>{{ t.common?.loading }}</p>
        </div>

        <!-- Apartments Grid -->
        <div class="apartments-grid" *ngIf="!loading && filteredApartments.length > 0">
          <div 
            class="apartment-card card slide-up" 
            *ngFor="let apartment of filteredApartments; trackBy: trackByApartment"
          >
            <div class="apartment-image">
              <img 
                [src]="'assets/images/' + apartment.images[0]" 
                [alt]="currentLanguage === 'fr' ? apartment.title : apartment.titleEn"
                onerror="this.src='assets/images/placeholder-apartment.jpg'"
              >
              <div class="apartment-badge" [class.available]="apartment.available">
                {{ apartment.available ? t.common?.available : t.common?.notAvailable }}
              </div>
              <div class="apartment-price">{{ apartment.price | currency:'CAD':'symbol':'1.0-0' }}/{{ t.common?.month }}</div>
            </div>
            
            <div class="card-body">
              <h3 class="apartment-title">
                {{ currentLanguage === 'fr' ? apartment.title : apartment.titleEn }}
              </h3>
              
              <div class="apartment-details">
                <div class="detail-item">
                  <i class="fas fa-bed"></i>
                  <span>
                    {{ apartment.bedrooms }} 
                    {{ apartment.bedrooms === 1 ? t.common?.bedroom : t.common?.bedrooms }}
                  </span>
                </div>
                <div class="detail-item">
                  <i class="fas fa-bath"></i>
                  <span>
                    {{ apartment.bathrooms }} 
                    {{ apartment.bathrooms === 1 ? t.common?.bathroom : t.common?.bathrooms }}
                  </span>
                </div>
                <div class="detail-item">
                  <i class="fas fa-ruler-combined"></i>
                  <span>{{ apartment.squareFootage }} {{ t.common?.sqft }}</span>
                </div>
                <div class="detail-item">
                  <i class="fas fa-map-marker-alt"></i>
                  <span>{{ getAreaName(apartment.area) }}</span>
                </div>
              </div>

              <div class="apartment-features">
                <span class="feature-badge" [class.furnished]="apartment.furnished">
                  {{ apartment.furnished ? t.common?.furnished : t.common?.unfurnished }}
                </span>
              </div>

              <div class="apartment-actions">
                <a 
                  [routerLink]="['/appartement', apartment.id]" 
                  class="btn btn-primary"
                >
                  {{ t.common?.viewDetails }}
                </a>
                <button 
                  class="btn btn-outline"
                  *ngIf="apartment.available"
                  (click)="bookTour(apartment)"
                >
                  {{ t.common?.bookNow }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- No Results -->
        <div class="no-results text-center" *ngIf="!loading && filteredApartments.length === 0">
          <i class="fas fa-search"></i>
          <h3>Aucun résultat trouvé</h3>
          <p>Essayez d'ajuster vos critères de recherche.</p>
          <button class="btn btn-primary" (click)="clearFilters()">
            Effacer les filtres
          </button>
        </div>
      </div>
    </section>

    <!-- About Agent Section -->
    <section class="about-agent">
      <div class="container">
        <div class="row align-items-center">
          <div class="col col-12 col-md-6">
            <div class="agent-image">
              <img 
                src="../../../images/jessica-larmour.jpg" 
                alt="Jessica Larmour"
                onerror="this.src='../../../images/placeholder-agent.jpg'"
              >
            </div>
          </div>
          <div class="col col-12 col-md-6">
            <div class="agent-content">
              <h2>{{ t.home?.aboutAgent?.title }}</h2>
              <h3 class="agent-name">{{ t.home?.aboutAgent?.name }}</h3>
              <p>{{ t.home?.aboutAgent?.description }}</p>
              
              <div class="agent-contact">
                <div class="contact-item">
                  <i class="fas fa-phone"></i>
                  <a href="tel:4385081566">{{ t.home?.aboutAgent?.phone }}</a>
                </div>
                <div class="contact-item">
                  <i class="fas fa-envelope"></i>
                  <a href="mailto:larmour.j.a@gmail.com">{{ t.home?.aboutAgent?.email }}</a>
                </div>
              </div>

              <div class="agent-actions">
                <a routerLink="/contact" class="btn btn-primary">
                  Contactez-moi
                </a>
                <button class="btn btn-outline" (click)="bookTour()">
                  {{ t.navigation?.bookTour }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  apartments: Apartment[] = [];
  filteredApartments: Apartment[] = [];
  areas: Area[] = [];
  loading = true;
  t: any = {};
  currentLanguage = 'fr';

  // Filters
  selectedArea = '';
  selectedBedrooms: string = '';
  selectedMaxPrice: string = '';
  sortBy: 'price-asc' | 'price-desc' = 'price-asc';
  showFilters = false; // Start with filters collapsed

  private destroy$ = new Subject<void>();

  constructor(
    private dataService: DataService,
    private languageService: LanguageService
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.subscribeToLanguageChanges();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadData(): void {
    this.dataService.getFeaturedApartments(8)
      .pipe(takeUntil(this.destroy$))
      .subscribe(apartments => {
        this.apartments = apartments;
        this.applyFilters();
        this.loading = false;
      });

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

  onFiltersChanged(): void {
    this.applyFilters();
  }

  private applyFilters(): void {
    let filtered = [...this.apartments];

    // Apply filters
    if (this.selectedArea) {
      filtered = filtered.filter(apt => apt.area === this.selectedArea);
    }

    if (this.selectedBedrooms !== '') {
      const bedrooms = parseInt(this.selectedBedrooms);
      if (bedrooms >= 3) {
        filtered = filtered.filter(apt => apt.bedrooms >= 3);
      } else {
        filtered = filtered.filter(apt => apt.bedrooms === bedrooms);
      }
    }

    if (this.selectedMaxPrice) {
      const maxPrice = parseInt(this.selectedMaxPrice);
      filtered = filtered.filter(apt => apt.price <= maxPrice);
    }

    // Apply sorting
    this.filteredApartments = this.dataService.sortApartments(filtered, this.sortBy);
  }

  clearFilters(): void {
    this.selectedArea = '';
    this.selectedBedrooms = '';
    this.selectedMaxPrice = '';
    this.sortBy = 'price-asc';
    this.applyFilters();
  }

  hasActiveFilters(): boolean {
    return !!(this.selectedArea || this.selectedBedrooms !== '' || this.selectedMaxPrice);
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  getAreaName(areaId: string): string {
    const area = this.areas.find(a => a.id === areaId);
    if (!area) return areaId;
    return this.currentLanguage === 'fr' ? area.nameFr : area.nameEn;
  }

  trackByApartment(index: number, apartment: Apartment): string {
    return apartment.id;
  }

  bookTour(apartment?: Apartment): void {
    // Trigger the header booking modal by dispatching a custom event
    const bookingEvent = new CustomEvent('openBookingModal');
    window.dispatchEvent(bookingEvent);
  }
}