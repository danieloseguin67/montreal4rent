import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService, Language } from '../../services/language.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="contact-page">
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-content">
          <div class="container">
            <h1>{{ currentLanguage === 'fr' ? 'Contactez-Nous' : 'Contact Us' }}</h1>
            <p class="hero-description">{{ currentLanguage === 'fr' ? 'Nous sommes là pour vous aider à trouver votre prochain chez-vous à Montréal.' : 'We are here to help you find your next home in Montreal.' }}</p>
          </div>
        </div>
        <div class="hero-image">
          <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=600&fit=crop" alt="Contact us" loading="lazy">
        </div>
      </section>

      <!-- Contact Info Section -->
      <section class="contact-info-section">
        <div class="container">
          <div class="contact-grid">
            <div class="contact-card">
              <div class="contact-icon">
                <i class="fas fa-envelope"></i>
              </div>
              <h3>{{ currentLanguage === 'fr' ? 'Email' : 'Email' }}</h3>
              <p><a href="mailto:Jessical@montreal4rent.com">Jessical@montreal4rent.com</a></p>
            </div>
            <div class="contact-card">
              <div class="contact-icon">
                <i class="fas fa-phone"></i>
              </div>
              <h3>{{ currentLanguage === 'fr' ? 'Téléphone' : 'Phone' }}</h3>
              <p><a href="tel:4385081566">(438) 508-1566</a></p>
            </div>
            <div class="contact-card">
              <div class="contact-icon">
                <i class="fas fa-map-marker-alt"></i>
              </div>
              <h3>{{ currentLanguage === 'fr' ? 'Localisation' : 'Location' }}</h3>
              <p>Montréal, QC<br>Canada</p>
            </div>
          </div>
        </div>
      </section>

      <!-- About Section -->
      <section class="about-section">
        <div class="container">
          <div class="about-content">
            <div class="about-text">
              <h2>{{ currentLanguage === 'fr' ? 'À Propos de Montreal4Rent' : 'About Montreal4Rent' }}</h2>
              <p>{{ currentLanguage === 'fr' ? 'Montreal4Rent se spécialise dans la location d\\'appartements de luxe à Montréal. Nous offrons des logements de qualité supérieure dans les meilleurs quartiers de la ville, parfaits pour les étudiants, les professionnels et les familles.' : 'Montreal4Rent specializes in luxury apartment rentals in Montreal. We offer premium housing in the best neighborhoods of the city, perfect for students, professionals, and families.' }}</p>
              <ul class="services-list">
                <li><i class="fas fa-check"></i> {{ currentLanguage === 'fr' ? 'Appartements meublés et non-meublés' : 'Furnished and unfurnished apartments' }}</li>
                <li><i class="fas fa-check"></i> {{ currentLanguage === 'fr' ? 'Logements adaptés aux étudiants' : 'Student-friendly housing' }}</li>
                <li><i class="fas fa-check"></i> {{ currentLanguage === 'fr' ? 'Emplacements premium' : 'Premium locations' }}</li>
                <li><i class="fas fa-check"></i> {{ currentLanguage === 'fr' ? 'Service client 24/7' : '24/7 customer service' }}</li>
              </ul>
            </div>
            <div class="about-image">
              <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop" alt="Montreal cityscape" loading="lazy">
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit, OnDestroy {
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