import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DataService, Apartment, Area, ToggleOption, UnitType } from '../../services/data.service';
import { LanguageService } from '../../services/language.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-condo-rentals',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, CurrencyPipe],
  template: `
    <div class="condo-rentals-page">
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-content">
          <div class="container">
            <h1>{{ currentLanguage === 'fr' ? 'Condos à Louer' : 'Condo Rentals' }}</h1>
            <p class="hero-description">{{ currentLanguage === 'fr' ? 'Découvrez notre collection de condos à Montréal' : 'Browse our condo rentals in Montreal' }}</p>
          </div>
        </div>
        <div class="hero-image">
          <img src="assets/images/unfurnished1.jpg" alt="Condo rentals banner" loading="lazy">
        </div>
      </section>

      <!-- Search Section (same as Apartments) -->
      <section class="search-section">
        <div class="container">
          <div class="search-card card">
            <div class="card-body">
              <div class="search-header">
                <h2 class="text-center mb-3">{{ currentLanguage === 'fr' ? 'Recherche' : 'Search' }}</h2>
                <div class="text-center mb-3">
                  <button 
                    class="btn btn-filters-toggle" 
                    (click)="toggleFilters()"
                    [attr.aria-expanded]="showFilters"
                    [attr.aria-controls]="'search-filters'"
                  >
                    <i class="fas" [class.fa-chevron-down]="!showFilters" [class.fa-chevron-up]="showFilters"></i>
                    {{ showFilters ? (currentLanguage === 'fr' ? 'Masquer les filtres' : 'Hide Filters') : (currentLanguage === 'fr' ? 'Afficher les filtres' : 'Show Filters') }}
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
                      <label class="form-label">{{ currentLanguage === 'fr' ? 'Quartier' : 'Area' }}</label>
                      <select 
                        class="form-control form-select" 
                        [(ngModel)]="selectedArea"
                        (change)="onFiltersChanged()"
                      >
                        <option value="">{{ currentLanguage === 'fr' ? 'Tous les quartiers' : 'All Areas' }}</option>
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
                        <option value="1">1 {{ currentLanguage === 'fr' ? 'chambre' : 'Bedroom' }}</option>
                        <option value="2">2 {{ currentLanguage === 'fr' ? 'chambres' : 'Bedrooms' }}</option>
                        <option value="3">3+ {{ currentLanguage === 'fr' ? 'chambres' : 'Bedrooms' }}</option>
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
                      <label class="form-label">{{ currentLanguage === 'fr' ? 'Trier par' : 'Sort By' }}</label>
                      <select 
                        class="form-control form-select" 
                        [(ngModel)]="sortBy"
                        (change)="onFiltersChanged()"
                      >
                        <option value="price-asc">{{ currentLanguage === 'fr' ? 'Prix ↑' : 'Price ↑' }}</option>
                        <option value="price-desc">{{ currentLanguage === 'fr' ? 'Prix ↓' : 'Price ↓' }}</option>
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
                    {{ currentLanguage === 'fr' ? 'Effacer' : 'Clear' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Condos Grid -->
      <section class="apartments-grid-section">
        <div class="container">
          <!-- Loading State -->
          <div class="text-center" *ngIf="loading">
            <div class="spinner"></div>
            <p>{{ currentLanguage === 'fr' ? 'Chargement...' : 'Loading...' }}</p>
          </div>

          <!-- Condos Grid -->
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
                  {{ apartment.available ? (currentLanguage === 'fr' ? 'Disponible' : 'Available') : (currentLanguage === 'fr' ? 'Non disponible' : 'Not Available') }}
                </div>
                <div class="apartment-price">{{ apartment.price | currency:'CAD':'symbol':'1.0-0' }}/{{ currentLanguage === 'fr' ? 'mois' : 'month' }}</div>
                <div class="image-overlay">
                  <a class="btn btn-primary btn-sm" [routerLink]="['/appartement', apartment.id]">
                    {{ currentLanguage === 'fr' ? 'Voir les détails' : 'View Details' }}
                  </a>
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
                      {{ apartment.bathrooms === 1 ? (currentLanguage === 'fr' ? 'salle de bain' : 'bathroom') : (currentLanguage === 'fr' ? 'salles de bain' : 'bathrooms') }}
                    </span>
                  </div>
                  <div class="detail-item">
                    <i class="fas fa-ruler-combined"></i>
                    <span>{{ apartment.squareFootage }} {{ currentLanguage === 'fr' ? 'pi²' : 'sqft' }}</span>
                  </div>
                  <div class="detail-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>{{ getAreaName(apartment.area) }}</span>
                  </div>
                </div>

                <div class="apartment-description">
                  <p>{{ currentLanguage === 'fr' ? apartment.description : apartment.descriptionEn }}</p>
                </div>

                <div class="apartment-actions">
                  <a 
                    [routerLink]="['/appartement', apartment.id]" 
                    class="btn btn-primary"
                  >
                    {{ currentLanguage === 'fr' ? 'Voir les détails' : 'View Details' }}
                  </a>
                  <button 
                    class="btn btn-outline"
                    *ngIf="apartment.available"
                    (click)="bookTour(apartment)"
                  >
                    {{ currentLanguage === 'fr' ? 'Réserver une visite' : 'Book a Tour' }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- No Results -->
          <div class="no-results text-center" *ngIf="!loading && filteredApartments.length === 0">
            <i class="fas fa-search"></i>
            <h3>{{ currentLanguage === 'fr' ? 'Aucun condo trouvé' : 'No condos found' }}</h3>
            <p>{{ currentLanguage === 'fr' ? 'Essayez d\'ajuster vos critères de recherche.' : 'Try adjusting your search criteria.' }}</p>
            <button class="btn btn-primary" (click)="clearFilters()">
              {{ currentLanguage === 'fr' ? 'Effacer les filtres' : 'Clear Filters' }}
            </button>
          </div>
        </div>
      </section>
    </div>
  `,
  styleUrls: ['./condo-rentals.component.scss']
})
export class CondoRentalsComponent implements OnInit, OnDestroy {
  apartments: Apartment[] = [];
  filteredApartments: Apartment[] = [];
  areas: Area[] = [];
  toggles: ToggleOption[] = [];
  unitTypes: UnitType[] = [];
  loading = true;
  currentLanguage = 'fr';
  selectedToggles: Set<string> = new Set<string>();
  showFilters = false;

  // Filters
  selectedArea = '';
  selectedBedrooms: string = '';
  sortBy: 'price-asc' | 'price-desc' = 'price-asc';

  private destroy$ = new Subject<void>();

  constructor(
    private dataService: DataService,
    private languageService: LanguageService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.subscribeToLanguageChanges();
    this.initQueryParamListener();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initQueryParamListener(): void {
    this.route.queryParamMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const area = params.get('area') || '';
        if (area !== this.selectedArea) {
          this.selectedArea = area;
          this.applyFilters();
        }
      });
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

    this.dataService.getToggles()
      .pipe(takeUntil(this.destroy$))
      .subscribe(opts => this.toggles = opts);

    this.dataService.getUnitTypes()
      .pipe(takeUntil(this.destroy$))
      .subscribe(types => this.unitTypes = types);
  }

  private subscribeToLanguageChanges(): void {
    this.languageService.currentLanguage$
      .pipe(takeUntil(this.destroy$))
      .subscribe(lang => this.currentLanguage = lang);
  }

  onFiltersChanged(): void {
    this.applyFilters();
  }

  private applyFilters(): void {
    let filtered = this.apartments.filter(apt => !!apt.condorentals);

    if (this.selectedArea) {
      filtered = filtered.filter(apt => apt.area === this.selectedArea);
    }

    if (this.selectedBedrooms !== '') {
      const bedrooms = parseInt(this.selectedBedrooms);
      if (bedrooms >= 3) {
        filtered = filtered.filter(apt => this.getBedrooms(apt) >= 3);
      } else {
        filtered = filtered.filter(apt => this.getBedrooms(apt) === bedrooms);
      }
    }

    this.filteredApartments = this.dataService.sortApartments(filtered, this.sortBy);
  }

  clearFilters(): void {
    this.selectedArea = '';
    this.selectedBedrooms = '';
    this.selectedToggles.clear();
    this.sortBy = 'price-asc';
    this.applyFilters();
  }

  hasActiveFilters(): boolean {
    return !!(this.selectedArea || this.selectedBedrooms !== '' || this.selectedToggles.size > 0 || this.sortBy !== 'price-asc');
  }

  getAreaName(areaId: string): string {
    const area = this.areas.find(a => a.id === areaId);
    if (!area) return areaId;
    return this.currentLanguage === 'fr' ? area.nameFr : area.nameEn;
  }

  trackByApartment(index: number, apartment: Apartment): string {
    return apartment.id;
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  onToggleChanged(name: string, checked: boolean): void {
    if (checked) {
      this.selectedToggles.add(name);
    } else {
      this.selectedToggles.delete(name);
    }
    // Toggle filtering not applied to results yet
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
    const b = this.getBedrooms(apartment);
    return apartment.unit_type_name || (b === 0 ? 'Studio' : `${b} Bedroom${b > 1 ? 's' : ''}`);
  }

  bookTour(apartment?: Apartment): void {
    const bookingEvent = new CustomEvent('openBookingModal');
    window.dispatchEvent(bookingEvent);
  }
}
