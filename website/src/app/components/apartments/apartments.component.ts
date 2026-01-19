import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DataService, Apartment, Area } from '../../services/data.service';
import { LanguageService } from '../../services/language.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-apartments',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="apartments-page">
      <!-- Page Header -->
      <section class="page-header">
        <div class="container">
          <div class="header-content">
            <h1>{{ t.navigation?.apartments }}</h1>
            <p>Découvrez notre collection complète d'appartements de luxe à Montréal</p>
          </div>
        </div>
      </section>

      <!-- Filters Section -->
      <section class="filters-section">
        <div class="container">
          <div class="filters-card card">
            <div class="card-body">
              <div class="row">
                <div class="col col-12 col-md-2">
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
                <div class="col col-12 col-md-2">
                  <div class="form-group">
                    <label class="form-label">{{ t.common?.bedrooms }}</label>
                    <select 
                      class="form-control form-select" 
                      [(ngModel)]="selectedBedrooms"
                      (change)="onFiltersChanged()"
                    >
                      <option value="">Tous</option>
                      <option value="0">Studio</option>
                      <option value="1">1 {{ t.common?.bedroom }}</option>
                      <option value="2">2 {{ t.common?.bedrooms }}</option>
                      <option value="3">3+ {{ t.common?.bedrooms }}</option>
                    </select>
                  </div>
                </div>
                <div class="col col-12 col-md-2">
                  <div class="form-group">
                    <label class="form-label">Prix min</label>
                    <input 
                      type="number" 
                      class="form-control"
                      placeholder="0"
                      [(ngModel)]="minPrice"
                      (ngModelChange)="onFiltersChanged()"
                    >
                  </div>
                </div>
                <div class="col col-12 col-md-2">
                  <div class="form-group">
                    <label class="form-label">Prix max</label>
                    <input 
                      type="number" 
                      class="form-control"
                      placeholder="10000"
                      [(ngModel)]="maxPrice"
                      (ngModelChange)="onFiltersChanged()"
                    >
                  </div>
                </div>
                <div class="col col-12 col-md-2">
                  <div class="form-group">
                    <label class="form-label">Type</label>
                    <select 
                      class="form-control form-select" 
                      [(ngModel)]="selectedFurnished"
                      (change)="onFiltersChanged()"
                    >
                      <option value="">Tous</option>
                      <option value="true">{{ t.common?.furnished }}</option>
                      <option value="false">{{ t.common?.unfurnished }}</option>
                    </select>
                  </div>
                </div>
                <div class="col col-12 col-md-2">
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
              <div class="filters-actions">
                <button 
                  class="btn btn-outline" 
                  (click)="clearFilters()"
                  *ngIf="hasActiveFilters()"
                >
                  {{ t.common?.clear }}
                </button>
                <span class="results-count">
                  {{ filteredApartments.length }} 
                  {{ filteredApartments.length === 1 ? 'résultat' : 'résultats' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Apartments Grid -->
      <section class="apartments-grid-section">
        <div class="container">
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
                <div class="image-overlay">
                  <button class="btn btn-primary btn-sm" [routerLink]="['/appartement', apartment.id]">
                    {{ t.common?.viewDetails }}
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

                <div class="apartment-description">
                  <p>{{ currentLanguage === 'fr' ? apartment.description : apartment.descriptionEn }}</p>
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
    </div>
  `,
  styleUrls: ['./apartments.component.scss']
})
export class ApartmentsComponent implements OnInit, OnDestroy {
  apartments: Apartment[] = [];
  filteredApartments: Apartment[] = [];
  areas: Area[] = [];
  loading = true;
  t: any = {};
  currentLanguage = 'fr';

  // Filters
  selectedArea = '';
  selectedBedrooms: string = '';
  selectedFurnished: string = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;
  sortBy: 'price-asc' | 'price-desc' = 'price-asc';

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
    this.dataService.getApartments()
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

    if (this.selectedFurnished !== '') {
      const furnished = this.selectedFurnished === 'true';
      filtered = filtered.filter(apt => apt.furnished === furnished);
    }

    if (this.minPrice !== null && this.minPrice > 0) {
      filtered = filtered.filter(apt => apt.price >= this.minPrice!);
    }

    if (this.maxPrice !== null && this.maxPrice > 0) {
      filtered = filtered.filter(apt => apt.price <= this.maxPrice!);
    }

    // Apply sorting
    this.filteredApartments = this.dataService.sortApartments(filtered, this.sortBy);
  }

  clearFilters(): void {
    this.selectedArea = '';
    this.selectedBedrooms = '';
    this.selectedFurnished = '';
    this.minPrice = null;
    this.maxPrice = null;
    this.sortBy = 'price-asc';
    this.applyFilters();
  }

  hasActiveFilters(): boolean {
    return !!(
      this.selectedArea || 
      this.selectedBedrooms !== '' || 
      this.selectedFurnished !== '' ||
      (this.minPrice !== null && this.minPrice > 0) ||
      (this.maxPrice !== null && this.maxPrice > 0)
    );
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