import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DataService, Apartment, Area, ToggleOption } from '../../services/data.service';
import { LanguageService } from '../../services/language.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, CurrencyPipe],
  template: `
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-background">
        <div class="hero-overlay"></div>
      </div>
      <div class="container">
        <div class="hero-content">
          <div class="hero-text fade-in">
            <h1 class="hero-title">
              <span class="hero-title-top">{{ t.home?.hero?.titleTop || t.home?.hero?.title }}</span>
              <span class="hero-title-bottom" *ngIf="t.home?.hero?.titleBottom">{{ t.home?.hero?.titleBottom }}</span>
            </h1>
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
                    <label class="form-label">Unit Type</label>
                    <select 
                      class="form-control form-select" 
                      [(ngModel)]="selectedBedrooms"
                      (change)="onFiltersChanged()"
                    >
                      <option value="">All Unit Types</option>
                      <option value="0">Studio</option>
                      <option value="1">1 {{ t.common?.bedroom }}</option>
                      <option value="2">2 {{ t.common?.bedrooms }}</option>
                      <option value="3">3+ {{ t.common?.bedrooms }}</option>
                    </select>
                  </div>
                </div>
                <div class="col col-12">
                  <div class="form-group">
                    <label class="form-label">Options</label>
                    <div class="options-grid">
                      <div class="form-check" *ngFor="let opt of toggles">
                        <input 
                          class="form-check-input" 
                          type="checkbox" 
                          [checked]="selectedToggles.has(opt.toggle_name)"
                          (change)="onToggleChanged(opt.toggle_name, $any($event.target).checked)"
                          [id]="'toggle-' + opt.toggle_name"
                        >
                        <label class="form-check-label" [for]="'toggle-' + opt.toggle_name">
                          <span class="me-2">{{ opt.toggle_image }}</span>{{ opt.toggle_name }}
                        </label>
                      </div>
                    </div>
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
                onerror="this.src='assets/images/' + apartment.images[0]"
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
        <div class="row justify-content-center">
          <div class="col col-12 col-lg-8">
            <div class="agent-content text-center">
              <h2>{{ t.home?.aboutAgent?.title }}</h2>
              <h3 class="agent-subtitle">{{ t.home?.aboutAgent?.subtitle }}</h3>
              
              <div class="agent-contact">
                <div class="contact-item">
                  <i class="fas fa-envelope"></i>
                  <a href="mailto:info@montreal4rent.com">{{ t.home?.aboutAgent?.email }}</a>
                </div>
              </div>

              <div class="agent-actions">
                <a routerLink="/contact" class="btn btn-primary">
                  {{ t.home?.aboutAgent?.contactButton }}
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
  toggles: ToggleOption[] = [];
  selectedToggles: Set<string> = new Set<string>();
  loading = true;
  t: any = {};
  currentLanguage = 'fr';

  // Filters
  selectedArea = '';
  selectedBedrooms: string = '';
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
      .subscribe(areas => {
        console.log('Loaded areas:', areas);
        this.areas = areas;
      });

    this.dataService.getToggles()
      .pipe(takeUntil(this.destroy$))
      .subscribe(opts => {
        this.toggles = opts || [];
      });
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
    console.log('Filters changed. Selected area:', this.selectedArea);
    this.applyFilters();
  }

  private applyFilters(): void {
    let filtered = [...this.apartments];

    // Apply filters
    if (this.selectedArea) {
      console.log('Filtering by selectedArea:', this.selectedArea);
      console.log('Available apartments areas:', this.apartments.map(apt => apt.area));
      filtered = filtered.filter(apt => {
        console.log(`Comparing apt.area '${apt.area}' === selectedArea '${this.selectedArea}':`, apt.area === this.selectedArea);
        return apt.area === this.selectedArea;
      });
      console.log('Filtered apartments count:', filtered.length);
    }

    if (this.selectedBedrooms !== '') {
      const bedrooms = parseInt(this.selectedBedrooms);
      if (bedrooms >= 3) {
        filtered = filtered.filter(apt => apt.bedrooms >= 3);
      } else {
        filtered = filtered.filter(apt => apt.bedrooms === bedrooms);
      }
    }

    // Apply sorting
    this.filteredApartments = this.dataService.sortApartments(filtered, this.sortBy);
  }

  clearFilters(): void {
    this.selectedArea = '';
    this.selectedBedrooms = '';
    this.sortBy = 'price-asc';
    this.selectedToggles.clear();
    this.applyFilters();
  }

  hasActiveFilters(): boolean {
    return !!(this.selectedArea || this.selectedBedrooms !== '' || this.selectedToggles.size > 0);
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

  onToggleChanged(name: string, checked: boolean): void {
    if (checked) {
      this.selectedToggles.add(name);
    } else {
      this.selectedToggles.delete(name);
    }
    // Not applying toggle filtering yet per requirements
  }
}