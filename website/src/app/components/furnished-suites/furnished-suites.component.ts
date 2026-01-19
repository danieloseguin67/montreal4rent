import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService, Language } from '../../services/language.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-furnished-suites',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="furnished-suites-page">
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-content">
          <div class="container">
            <h1>{{ currentLanguage === 'fr' ? 'Suites Meublées' : 'Furnished Suites' }}</h1>
            <p class="hero-description">{{ currentLanguage === 'fr' ? 'Prêt à emménager ! Nos suites entièrement meublées sont équipées de tout ce dont vous avez besoin pour une vie confortable à Montréal.' : 'Move in ready! Our fully furnished suites come equipped with everything you need for comfortable living in Montreal.' }}</p>
          </div>
        </div>
        <div class="hero-image">
          <img src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&h=600&fit=crop" alt="Furnished apartment" loading="lazy">
        </div>
      </section>

      <!-- Features Section -->
      <section class="features-section">
        <div class="container">
          <h2>{{ currentLanguage === 'fr' ? 'Tout Ce Dont Vous Avez Besoin' : 'Everything You Need' }}</h2>
          <div class="features-grid">
            <div class="feature-card">
              <img src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop" alt="Living room" loading="lazy">
              <h3>{{ currentLanguage === 'fr' ? 'Salon Complet' : 'Complete Living Room' }}</h3>
              <p>{{ currentLanguage === 'fr' ? 'Canapés confortables, table basse, meuble TV et tous les éléments essentiels pour la détente.' : 'Comfortable sofas, coffee table, TV stand, and all the essentials for relaxation.' }}</p>
            </div>
            <div class="feature-card">
              <img src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop" alt="Bedroom" loading="lazy">
              <h3>{{ currentLanguage === 'fr' ? 'Chambres Entièrement Meublées' : 'Fully Furnished Bedrooms' }}</h3>
              <p>{{ currentLanguage === 'fr' ? 'Matelas de qualité, cadres de lit, commodes et amplement d&rsquo;espace de rangement.' : 'Quality mattresses, bed frames, dressers, and ample storage space.' }}</p>
            </div>
            <div class="feature-card">
              <img src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop" alt="Kitchen" loading="lazy">
              <h3>{{ currentLanguage === 'fr' ? 'Cuisine Équipée' : 'Equipped Kitchen' }}</h3>
              <p>{{ currentLanguage === 'fr' ? 'Tous les appareils, ustensiles de cuisine, vaisselle et tout le nécessaire pour cuisiner et dîner.' : 'All appliances, cookware, dishes, and everything needed to cook and dine.' }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Amenities Section -->
      <section class="amenities-section">
        <div class="container">
          <h2>{{ currentLanguage === 'fr' ? 'Commodités Incluses' : 'Included Amenities' }}</h2>
          <div class="amenities-list">
            <div class="amenity-item">
              <i class="fas fa-couch"></i>
              <span>{{ currentLanguage === 'fr' ? 'Mobilier Premium' : 'Premium Furniture' }}</span>
            </div>
            <div class="amenity-item">
              <i class="fas fa-utensils"></i>
              <span>{{ currentLanguage === 'fr' ? 'Essentiels de Cuisine' : 'Kitchen Essentials' }}</span>
            </div>
            <div class="amenity-item">
              <i class="fas fa-tv"></i>
              <span>{{ currentLanguage === 'fr' ? 'Configuration Divertissement' : 'Entertainment Setup' }}</span>
            </div>
            <div class="amenity-item">
              <i class="fas fa-bed"></i>
              <span>{{ currentLanguage === 'fr' ? 'Literie de Qualité' : 'Quality Bedding' }}</span>
            </div>
            <div class="amenity-item">
              <i class="fas fa-wifi"></i>
              <span>{{ currentLanguage === 'fr' ? 'Internet Haute Vitesse' : 'High-Speed Internet' }}</span>
            </div>
            <div class="amenity-item">
              <i class="fas fa-concierge-bell"></i>
              <span>{{ currentLanguage === 'fr' ? 'Support 24/7' : '24/7 Support' }}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styleUrls: ['./furnished-suites.component.scss']
})
export class FurnishedSuitesComponent implements OnInit, OnDestroy {
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
}