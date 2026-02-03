import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DataService, Apartment, Area, ToggleOption, UnitType } from '../../services/data.service';
import { LanguageService } from '../../services/language.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-apartments',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, CurrencyPipe],
  template: `
    <div class="apartments-page">
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-content">
          <div class="container">
            <h1>{{ currentLanguage === 'fr' ? 'Appartements' : 'Apartments' }}</h1>
            <p class="hero-description">{{ currentLanguage === 'fr' ? 'D&eacute;couvrez notre collection compl&egrave;te d\'appartements &agrave; Montr&eacute;al' : 'Explore our complete collection of apartments in Montreal' }}</p>
          </div>
        </div>
        <div class="hero-image">
          <img src="assets/images/unfurnished1.jpg" alt="Apartments banner" loading="lazy">
        </div>
      </section>

      <!-- Search Section (like Home) -->
      <section class="search-section">
        <div class="container">
          <div class="search-card card">
            <div class="card-body">
              <div class="search-header">
                <h2 class="text-center mb-3">{{ t.home?.search?.title || (currentLanguage === 'fr' ? 'Rechercher' : 'Search') }}</h2>
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
                  onerror="this.src='assets/images/' + apartment.images[0]"
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
                    <span>{{ getUnitType(apartment) }}</span>
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
            <h3></h3>
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
  toggles: ToggleOption[] = [];
  unitTypes: UnitType[] = [];
  loading = true;
  t: any = {};
  currentLanguage = 'fr';
  selectedToggles: Set<string> = new Set<string>();
  showFilters = false;

  // Filters
  selectedArea = '';
  selectedBedrooms: string = '';
  selectedFurnished: string = '';
  selectedUnitType: string = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;
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
        filtered = filtered.filter(apt => this.getBedrooms(apt) >= 3);
      } else {
        filtered = filtered.filter(apt => this.getBedrooms(apt) === bedrooms);
      }
    }

    if (this.selectedFurnished !== '') {
      const furnished = this.selectedFurnished === 'true';
      filtered = filtered.filter(apt => apt.furnished === furnished);
    }

    if (this.selectedUnitType) {
      filtered = filtered.filter(apt => (apt.unit_type_name || '').toLowerCase() === this.selectedUnitType.toLowerCase());
    }

    // Note: toggles selection UI present for parity with Home; not applied to filtering per requirements

    // Apply sorting
    this.filteredApartments = this.dataService.sortApartments(filtered, this.sortBy);
  }

  clearFilters(): void {
    this.selectedArea = '';
    this.selectedBedrooms = '';
    this.selectedFurnished = '';
    this.selectedToggles.clear();
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
      this.selectedToggles.size > 0 ||
      this.selectedUnitType !== '' ||
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

  trackByToggle(index: number, toggle: ToggleOption): string {
    return `${toggle.toggle_name}-${index}`;
  }

  bookTour(apartment?: Apartment): void {
    // Trigger the header booking modal by dispatching a custom event
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

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
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