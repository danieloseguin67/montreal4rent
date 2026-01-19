import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService, Language } from '../../services/language.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="students-page">
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-content">
          <div class="container">
            <h1>{{ currentLanguage === 'fr' ? 'Logements Étudiants à Montréal' : 'Student Housing in Montreal' }}</h1>
            <p class="hero-description">{{ currentLanguage === 'fr' ? 'Trouvez le logement parfait pour vos études à Montréal. Nos appartements adaptés aux étudiants offrent commodité, confort et communauté.' : 'Find the perfect accommodation for your studies in Montreal. Our student-friendly apartments offer convenience, comfort, and community.' }}</p>
          </div>
        </div>
        <div class="hero-image">
          <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&h=600&fit=crop" alt="Students studying" loading="lazy">
        </div>
      </section>

      <!-- Features Section -->
      <section class="features-section">
        <div class="container">
          <h2>{{ currentLanguage === 'fr' ? 'Parfait pour les Étudiants' : 'Perfect for Students' }}</h2>
          <div class="features-grid">
            <div class="feature-card">
              <img src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop" alt="Study area" loading="lazy">
              <h3>{{ currentLanguage === 'fr' ? 'Espaces d\\'Étude' : 'Study-Friendly Spaces' }}</h3>
              <p>{{ currentLanguage === 'fr' ? 'Environnements calmes parfaits pour étudier avec des espaces de travail dédiés.' : 'Quiet environments perfect for studying with dedicated workspace areas.' }}</p>
            </div>
            <div class="feature-card">
              <img src="https://images.unsplash.com/photo-1555854877-bab0e460b1e1?w=400&h=300&fit=crop" alt="Kitchen" loading="lazy">
              <h3>{{ currentLanguage === 'fr' ? 'Cuisines Équipées' : 'Fully Equipped Kitchens' }}</h3>
              <p>{{ currentLanguage === 'fr' ? 'Cuisinez vos propres repas et économisez avec nos installations de cuisine modernes.' : 'Cook your own meals and save money with our modern kitchen facilities.' }}</p>
            </div>
            <div class="feature-card">
              <img src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop" alt="Metro station" loading="lazy">
              <h3>{{ currentLanguage === 'fr' ? 'Près des Universités' : 'Near Universities' }}</h3>
              <p>{{ currentLanguage === 'fr' ? 'Proche de McGill, Concordia et UQAM avec un accès facile au métro.' : 'Close to McGill, Concordia, and UQAM with easy metro access.' }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Amenities Section -->
      <section class="amenities-section">
        <div class="container">
          <h2>{{ currentLanguage === 'fr' ? 'Commodités Étudiantes' : 'Student Amenities' }}</h2>
          <div class="amenities-list">
            <div class="amenity-item">
              <i class="fas fa-wifi"></i>
              <span>{{ currentLanguage === 'fr' ? 'Internet Haute Vitesse' : 'High-Speed Internet' }}</span>
            </div>
            <div class="amenity-item">
              <i class="fas fa-washing-machine"></i>
              <span>{{ currentLanguage === 'fr' ? 'Installations de Lavage' : 'Laundry Facilities' }}</span>
            </div>
            <div class="amenity-item">
              <i class="fas fa-dumbbell"></i>
              <span>{{ currentLanguage === 'fr' ? 'Centre de Fitness' : 'Fitness Center' }}</span>
            </div>
            <div class="amenity-item">
              <i class="fas fa-users"></i>
              <span>{{ currentLanguage === 'fr' ? 'Salles d\\'Étude' : 'Study Rooms' }}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styleUrls: ['./students.component.scss']
})
export class StudentsComponent implements OnInit, OnDestroy {
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