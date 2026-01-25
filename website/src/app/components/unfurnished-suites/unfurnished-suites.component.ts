import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService, Language } from '../../services/language.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-unfurnished-suites',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="unfurnished-suites-page">
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-content">
          <div class="container">
            <h1>{{ currentLanguage === 'fr' ? 'Suites Non Meubl&eacute;es' : 'Unfurnished Suites' }}</h1>
            <p class="hero-description">{{ currentLanguage === 'fr' ? 'Cr&eacute;ez votre espace id&eacute;al ! Nos suites spacieuses et modernes vous offrent la libert&eacute; de personnaliser votre foyer selon vos go&ucirc;ts.' : 'Create your ideal space! Our spacious and modern suites give you the freedom to personalize your home to your taste.' }}</p>
          </div>
        </div>
        <div class="hero-image">
          <img src="assets/images/unfurnished1.jpg" alt="Empty apartment" loading="lazy">
        </div>
      </section>

      <!-- Features Section -->
      <section class="features-section">
        <div class="container">
          <h2>{{ currentLanguage === 'fr' ? 'Libert&eacute; et Flexibilit&eacute;' : 'Freedom and Flexibility' }}</h2>
          <div class="features-grid">
            <div class="feature-card">
              <img src="assets/images/unfurnished2.jpg" alt="Open space apartment" loading="lazy">
              <h3>{{ currentLanguage === 'fr' ? 'Espaces Ouverts' : 'Open Spaces' }}</h3>
              <p>{{ getFloorPlanText() }}</p>
            </div>
            <div class="feature-card">
              <img src="assets/images/unfurnished3.jpg" alt="Personalized" loading="lazy">
              <h3>{{ currentLanguage === 'fr' ? 'Personnalisation' : 'Personalization' }}</h3>
              <p>{{ getPersonalizationText() }}</p>
            </div>
            <div class="feature-card">
              <img src="assets/images/unfurnished4.jpg" alt="Modern amenities" loading="lazy">
              <h3>{{ currentLanguage === 'fr' ? 'Commodit&eacute;s Modernes' : 'Modern Amenities' }}</h3>
              <p>{{ getAppliancesText() }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Amenities Section -->
      <section class="amenities-section">
        <div class="container">
          <h2>{{ currentLanguage === 'fr' ? 'Inclus dans Votre Location' : 'Included in Your Rental' }}</h2>
          <div class="amenities-list">
            <div class="amenity-item">
              <i class="fas fa-home"></i>
              <span>{{ currentLanguage === 'fr' ? 'Espaces Spacieux' : 'Spacious Layouts' }}</span>
            </div>
            <div class="amenity-item">
              <i class="fas fa-kitchen-set"></i>
              <span>{{ currentLanguage === 'fr' ? '&Eacute;lectrom&eacute;nagers Inclus' : 'Appliances Included' }}</span>
            </div>
            <div class="amenity-item">
              <i class="fas fa-paint-roller"></i>
              <span>{{ currentLanguage === 'fr' ? 'Finitions Modernes' : 'Modern Finishes' }}</span>
            </div>
            <div class="amenity-item">
              <i class="fas fa-warehouse"></i>
              <span>{{ currentLanguage === 'fr' ? 'Rangement G&eacute;n&eacute;reux' : 'Ample Storage' }}</span>
            </div>
            <div class="amenity-item">
              <i class="fas fa-wifi"></i>
              <span>{{ currentLanguage === 'fr' ? 'Internet Inclus' : 'Internet Included' }}</span>
            </div>
            <div class="amenity-item">
              <i class="fas fa-tools"></i>
              <span>{{ currentLanguage === 'fr' ? 'Entretien 24/7' : '24/7 Maintenance' }}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styleUrls: ['./unfurnished-suites.component.scss']
})
export class UnfurnishedSuitesComponent implements OnInit, OnDestroy {
  currentLanguage: Language = 'fr';
  private destroy$ = new Subject<void>();

  constructor(private languageService: LanguageService) {}

  ngOnInit(): void {
    this.languageService.currentLanguage$
      .pipe(takeUntil(this.destroy$))
      .subscribe(lang => this.currentLanguage = lang);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getFloorPlanText(): string {
    return this.currentLanguage === 'fr' 
      ? 'Plans d\'étage spacieux et ouverts pour maximiser vos possibilités d\'aménagement.'
      : 'Spacious and open floor plans to maximize your layout possibilities.';
  }

  getPersonalizationText(): string {
    return this.currentLanguage === 'fr'
      ? 'Apportez vos propres meubles et décorations pour créer un chez-vous unique.'
      : 'Bring your own furniture and decorations to create a unique home.';
  }

  getAppliancesText(): string {
    return this.currentLanguage === 'fr'
      ? 'Appareils électroménagers intégrés et finitions modernes dans chaque unité.'
      : 'Built-in appliances and modern finishes in every unit.';
  }
}