import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LanguageService } from '../../services/language.service';
import { DataService, Area } from '../../services/data.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="row">
            <!-- Company Info -->
            <div class="col col-12 col-md-4">
              <div class="footer-section">
                <div class="footer-logo">
                  <h3>Montreal4Rent</h3>
                </div>
                <p class="footer-description">
                  Spécialiste en location d'appartements de luxe à Montréal. 
                  Trouvez votre nouveau chez-vous avec Jessica Larmour.
                </p>
              </div>
            </div>

            <!-- Contact Info -->
            <div class="col col-12 col-md-4">
              <div class="footer-section">
                <h4>{{ t.footer?.contact }}</h4>
                <div class="contact-info">
                  <div class="contact-item">
                    <i class="fas fa-user"></i>
                    <div>
                      <strong>Jessica Larmour, Agent immobilier</strong>
                    </div>
                  </div>
                  <div class="contact-item">
                    <i class="fas fa-phone"></i>
                    <div>
                      <strong>{{ t.footer?.phone }}</strong>
                      <a href="tel:4385081566">438-508-1566</a>
                    </div>
                  </div>
                  <div class="contact-item">
                    <i class="fas fa-envelope"></i>
                    <div>
                      <strong>{{ t.footer?.email }}</strong>
                      <a href="mailto:info@montreal4rent.com">info&#64;montreal4rent.com</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Areas Served -->
            <div class="col col-12 col-md-4">
              <div class="footer-section">
                <h4>{{ t.footer?.areas }}</h4>
                <ul class="areas-list">
                  <li *ngFor="let area of areas">
                    <a [routerLink]="['/appartements']" [queryParams]="{area: area.id}">
                      {{ currentLanguage === 'fr' ? area.nameFr : area.nameEn }}
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer Bottom -->
        <div class="footer-bottom">
          <div class="row align-items-center">
            <div class="col col-12 col-md-6">
              <p class="copyright">
                © {{ currentYear }} Montreal4Rent. {{ t.footer?.rights }}. | 
                {{ currentLanguage === 'fr' ? 'Site développé par' : 'Site developed by' }} 
                <a href="https://daniel.seguin.dev" target="_blank" rel="noopener" class="dev-link">SeguinDev</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  `,
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit, OnDestroy {
  areas: Area[] = [];
  t: any = {};
  currentLanguage = 'fr';
  currentYear = new Date().getFullYear();
  
  private destroy$ = new Subject<void>();

  constructor(
    private languageService: LanguageService,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.subscribeToLanguageChanges();
    this.loadAreas();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private subscribeToLanguageChanges(): void {
    this.languageService.currentLanguage$
      .pipe(takeUntil(this.destroy$))
      .subscribe(lang => this.currentLanguage = lang);

    this.languageService.getCurrentTranslations()
      .pipe(takeUntil(this.destroy$))
      .subscribe(translations => this.t = translations);
  }

  private loadAreas(): void {
    this.dataService.getAreas()
      .pipe(takeUntil(this.destroy$))
      .subscribe(areas => this.areas = areas);
  }
}