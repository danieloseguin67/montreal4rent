import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-rooms-for-rent',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="rooms-for-rent-page">
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-image">
          <img 
            src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1920&h=1080&fit=crop&crop=center" 
            alt="Cozy room rental space"
          >
        </div>
        <div class="hero-content">
          <div class="container">
            <div class="hero-text">
              <h1>{{ currentLanguage === 'fr' ? 'Chambres à Louer' : 'Rooms for Rent' }}</h1>
              <p class="hero-description">
                {{ currentLanguage === 'fr' 
                  ? 'Découvrez nos chambres confortables et abordables dans le cœur de Montréal. Parfait pour les étudiants et les jeunes professionnels.' 
                  : 'Discover our comfortable and affordable rooms in the heart of Montreal. Perfect for students and young professionals.' }}
              </p>
            </div>
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
                <img 
                  src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop&crop=center" 
                  alt="Single room"
                >
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

            <!-- Double Room -->
            <div class="room-type-card">
              <div class="room-image">
                <img 
                  src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&h=400&fit=crop&crop=center" 
                  alt="Double room"
                >
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
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="cta-section">
        <div class="container">
          <div class="cta-content">
            <h2>{{ currentLanguage === 'fr' ? 'Intéressé par nos chambres?' : 'Interested in our rooms?' }}</h2>
            <p>
              {{ currentLanguage === 'fr' 
                ? 'Contactez-nous dès aujourd&rsquo;hui pour planifier une visite et découvrir votre nouveau chez-vous.' 
                : 'Contact us today to schedule a visit and discover your new home.' }}
            </p>
            <a href="/contact" class="btn btn-primary">
              {{ currentLanguage === 'fr' ? 'Nous Contacter' : 'Contact Us' }}
            </a>
          </div>
        </div>
      </section>
    </div>
  `,
  styleUrls: ['./rooms-for-rent.component.scss']
})
export class RoomsForRentComponent {
  currentLanguage: string = 'en';

  constructor(private languageService: LanguageService) {
    this.languageService.currentLanguage$.subscribe(
      (language) => this.currentLanguage = language
    );
  }
}