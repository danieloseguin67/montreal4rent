import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LanguageService, Language } from '../../services/language.service';
import { EmailService } from '../../services/email.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <header class="header">
      <div class="container">
        <div class="header-content" [class.french-layout]="currentLanguage === 'fr'">
          <!-- Logo -->
          <div class="logo">
            <a routerLink="/" class="logo-link">
              <h1>Montreal4Rent</h1>
            </a>
          </div>

          <!-- Desktop Navigation -->
          <nav class="desktop-nav" aria-label="Main navigation">
            <ul class="nav-list">
              
              <li>
                <a 
                  [routerLink]="currentLanguage === 'fr' ? '/appartements' : '/apartments'" 
                  routerLinkActive="active"
                >{{ currentLanguage === 'fr' ? 'Appartements' : 'Apartments' }}</a>
              </li>
              <li>
                <a 
                  [routerLink]="currentLanguage === 'fr' ? '/suites-meublées' : '/furnished-suites'" 
                  routerLinkActive="active"
                >{{ currentLanguage === 'fr' ? 'Entièrement Meublés' : 'Fully Furnished' }}</a>
              </li>
              <li>
                <a 
                  [routerLink]="currentLanguage === 'fr' ? '/suites-non-meublées' : '/condo-rentals'" 
                  routerLinkActive="active"
                >{{ currentLanguage === 'fr' ? 'Condos à Louer' : 'Condo Rentals' }}</a>
              </li>
              <li>
                <a 
                  [routerLink]="currentLanguage === 'fr' ? '/chambres-à-louer' : '/rooms-for-rent'" 
                  routerLinkActive="active"
                >{{ currentLanguage === 'fr' ? 'Chambres à Louer' : 'Rooms for Rent' }}</a>
              </li>
              <li>
                <a 
                  [routerLink]="'/property-owners'" 
                  routerLinkActive="active"
                >{{ currentLanguage === 'fr' ? 'Propriétaires' : 'Property Owners' }}</a>
              </li>
              <li>
                <a 
                  [routerLink]="'/contact'" 
                  routerLinkActive="active"
                >{{ currentLanguage === 'fr' ? 'Contactez-Nous' : 'Contact Us' }}</a>
              </li>
            </ul>
          </nav>

          <!-- Right Side Actions -->
          <div class="header-actions">
            <!-- Language Switcher -->
            <div class="language-switcher" [class.active]="showLanguageDropdown">
              <button 
                class="language-btn"
                (click)="toggleLanguageDropdown()"
                [attr.aria-expanded]="showLanguageDropdown"
                aria-label="Changer de langue"
              >
                <span class="current-lang">{{ currentLanguage === 'fr' ? 'FR' : 'EN' }}</span>
                <i class="fas fa-chevron-down"></i>
              </button>
              <div class="language-dropdown" *ngIf="showLanguageDropdown">
                <button 
                  class="language-option" 
                  [class.active]="currentLanguage === 'fr'"
                  (click)="setLanguage('fr')"
                >
                  <span class="flag">🇫🇷</span>
                  Français
                </button>
                <button 
                  class="language-option" 
                  [class.active]="currentLanguage === 'en'"
                  (click)="setLanguage('en')"
                >
                  <span class="flag">EN</span>
                  English
                </button>
              </div>
            </div>

            <!-- Book Tour Button -->
            <button class="book-tour-btn" (click)="openBookingModal()">
              {{ t.navigation?.bookTour }}
            </button>

            <!-- Mobile Menu Button - Shows on tablet and mobile only -->
            <button 
              class="mobile-menu-btn"
              (click)="toggleMobileMenu()"
              [attr.aria-expanded]="showMobileMenu"
              aria-label="Menu principal"
            >
              <i class="fas" [class.fa-bars]="!showMobileMenu" [class.fa-times]="showMobileMenu"></i>
            </button>
          </div>
        </div>

        <!-- Mobile Menu -->
        <div class="mobile-menu" [class.show]="showMobileMenu" *ngIf="showMobileMenu">
          <nav class="mobile-nav" aria-label="Navigation mobile">
            <ul class="mobile-nav-list">
              
              <li>
                <a 
                  [routerLink]="currentLanguage === 'fr' ? '/appartements' : '/apartments'" 
                  (click)="closeMobileMenu()" 
                  routerLinkActive="active"
                >{{ currentLanguage === 'fr' ? 'Appartements' : 'Apartments' }}</a>
              </li>
              <li>
                <a 
                  [routerLink]="currentLanguage === 'fr' ? '/suites-meublées' : '/furnished-suites'" 
                  (click)="closeMobileMenu()" 
                  routerLinkActive="active"
                >{{ currentLanguage === 'fr' ? 'Entièrement Meublés' : 'Fully Furnished' }}</a>
              </li>
              <li>
                <a 
                  [routerLink]="currentLanguage === 'fr' ? '/suites-non-meublées' : '/condo-rentals'" 
                  (click)="closeMobileMenu()" 
                  routerLinkActive="active"
                >{{ currentLanguage === 'fr' ? 'Condos à Louer' : 'Condo Rentals' }}</a>
              </li>
              <li>
                <a 
                  [routerLink]="currentLanguage === 'fr' ? '/chambres-à-louer' : '/rooms-for-rent'" 
                  (click)="closeMobileMenu()" 
                  routerLinkActive="active"
                >{{ currentLanguage === 'fr' ? 'Chambres à Louer' : 'Rooms for Rent' }}</a>
              </li>
              <li>
                <a 
                  [routerLink]="'/property-owners'" 
                  (click)="closeMobileMenu()" 
                  routerLinkActive="active"
                >{{ currentLanguage === 'fr' ? 'Propriétaires' : 'Property Owners' }}</a>
              </li>
              <li>
                <a 
                  [routerLink]="'/contact'" 
                  (click)="closeMobileMenu()" 
                  routerLinkActive="active"
                >{{ currentLanguage === 'fr' ? 'Contactez-Nous' : 'Contact Us' }}</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <!-- Mobile Menu Overlay -->
      <div 
        class="mobile-menu-overlay" 
        *ngIf="showMobileMenu"
        (click)="closeMobileMenu()"
      ></div>

      <!-- Booking Modal -->
      <div class="booking-modal-overlay" *ngIf="showBookingModal" (click)="closeBookingModal()">
        <div class="booking-modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>{{ t.navigation?.bookTour }}</h3>
            <button class="modal-close" (click)="closeBookingModal()">
              <i class="fas fa-times"></i>
            </button>
          </div>
          
          <div class="modal-body">
            <form class="booking-form" (ngSubmit)="submitBookingForm()" #bookingFormRef="ngForm">
              <div class="form-group">
                <label for="name">{{ currentLanguage === 'fr' ? 'Nom complet' : 'Full Name' }} *</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name"
                  [(ngModel)]="bookingForm.name" 
                  class="form-control" 
                  required
                  #nameField="ngModel"
                  placeholder="{{ currentLanguage === 'fr' ? 'Votre nom complet' : 'Your full name' }}"
                >
              </div>
              
              <div class="form-group">
                <label for="email">{{ currentLanguage === 'fr' ? 'Courriel' : 'Email' }} *</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email"
                  [(ngModel)]="bookingForm.email" 
                  class="form-control" 
                  required
                  #emailField="ngModel"
                  placeholder="{{ currentLanguage === 'fr' ? 'votre@email.com' : 'your@email.com' }}"
                >
              </div>
              
              <div class="form-group">
                <label for="phone">{{ currentLanguage === 'fr' ? 'Téléphone' : 'Phone Number' }} *</label>
                <input 
                  type="tel" 
                  id="phone" 
                  name="phone"
                  [(ngModel)]="bookingForm.phone" 
                  class="form-control" 
                  required
                  #phoneField="ngModel"
                  placeholder="{{ currentLanguage === 'fr' ? '(514) 123-4567' : '(514) 123-4567' }}"
                >
              </div>
              
              <div class="form-group">
                <label for="message">{{ currentLanguage === 'fr' ? 'Message' : 'Message' }}</label>
                <textarea 
                  id="message" 
                  name="message"
                  [(ngModel)]="bookingForm.message" 
                  class="form-control" 
                  rows="4"
                  placeholder="{{ currentLanguage === 'fr' ? 'Décrivez vos besoins et préférences...' : 'Describe your needs and preferences...' }}"
                ></textarea>
              </div>
              
              <div *ngIf="bookingSuccess" class="alert alert-success">
                {{ bookingSuccess }}
              </div>

              <div *ngIf="bookingError" class="alert alert-error">
                {{ bookingError }}
              </div>
              
              <div class="form-actions">
                <button type="button" class="btn btn-outline" (click)="closeBookingModal()">
                  {{ currentLanguage === 'fr' ? 'Annuler' : 'Cancel' }}
                </button>
                <button type="submit" class="btn btn-primary" [disabled]="!bookingFormRef.form.valid || sendingBooking">
                  <i class="fas fa-paper-plane"></i>
                  {{ sendingBooking ? (currentLanguage === 'fr' ? 'Envoi en cours...' : 'Sending...') : (currentLanguage === 'fr' ? 'Envoyer un courriel' : 'Send Email') }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </header>
  `,
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  showMobileMenu = false;
  showLanguageDropdown = false;
  showBookingModal = false;
  currentLanguage: Language = 'fr';
  t: any = {};
  
  bookingForm = {
    name: '',
    email: '',
    phone: '',
    message: ''
  };
  
  sendingBooking = false;
  bookingSuccess = '';
  bookingError = '';
  
  private destroy$ = new Subject<void>();

  constructor(
    private languageService: LanguageService,
    private emailService: EmailService
  ) {}

  ngOnInit(): void {
    this.languageService.currentLanguage$
      .pipe(takeUntil(this.destroy$))
      .subscribe(lang => this.currentLanguage = lang);

    this.languageService.getCurrentTranslations()
      .pipe(takeUntil(this.destroy$))
      .subscribe(translations => this.t = translations);
    
    // Listen for booking modal events from other components
    window.addEventListener('openBookingModal', () => {
      this.openBookingModal();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    // Remove the event listener
    window.removeEventListener('openBookingModal', () => {
      this.openBookingModal();
    });
  }

  toggleMobileMenu(): void {
    this.showMobileMenu = !this.showMobileMenu;
    // Prevent body scroll when menu is open
    document.body.style.overflow = this.showMobileMenu ? 'hidden' : 'auto';
  }

  closeMobileMenu(): void {
    this.showMobileMenu = false;
    document.body.style.overflow = 'auto';
  }

  toggleLanguageDropdown(): void {
    this.showLanguageDropdown = !this.showLanguageDropdown;
  }

  setLanguage(language: Language): void {
    this.languageService.setLanguage(language);
    this.showLanguageDropdown = false;
  }

  openBookingModal(): void {
    this.showBookingModal = true;
    this.closeMobileMenu();
    document.body.style.overflow = 'hidden';
  }

  closeBookingModal(): void {
    this.showBookingModal = false;
    document.body.style.overflow = 'auto';
  }

  submitBookingForm(): void {
    this.bookingSuccess = '';
    this.bookingError = '';

    // Check if all required fields are filled
    if (!this.bookingForm.name || !this.bookingForm.email || !this.bookingForm.phone) {
      this.bookingError = this.currentLanguage === 'fr' 
        ? 'Veuillez remplir tous les champs obligatoires.'
        : 'Please fill in all required fields.';
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.bookingForm.email)) {
      this.bookingError = this.currentLanguage === 'fr' 
        ? 'Veuillez entrer une adresse courriel valide.'
        : 'Please enter a valid email address.';
      return;
    }
    
    this.sendingBooking = true;

    // Prepare email details
    const subject = this.currentLanguage === 'fr' 
      ? 'Demande de visite - Montreal4Rent'
      : 'Book a Tour - Montreal4Rent';
    
    const emailBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">${this.currentLanguage === 'fr' ? 'Nouvelle demande de visite' : 'New Tour Request'}</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Name:</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${this.bookingForm.name}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Email:</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${this.bookingForm.email}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Phone:</td>
            <td style="padding: 8px; border-bottom: 1px solid #ddd;">${this.bookingForm.phone}</td>
          </tr>
        </table>
        ${this.bookingForm.message ? `
        <div style="margin-top: 20px; padding: 15px; background-color: #f5f5f5; border-left: 4px solid #007bff;">
          <h3 style="margin-top: 0; color: #333;">${this.currentLanguage === 'fr' ? 'Message' : 'Message'}:</h3>
          <p style="white-space: pre-wrap; color: #555;">${this.bookingForm.message}</p>
        </div>` : ''}
      </div>
    `;
    
    // Send email via backend PHP service
    this.emailService.sendEmail(
      this.bookingForm.email,
      'info@montreal4rent.com',
      subject,
      emailBody,
      'book-tour',
      this.bookingForm.name
    ).subscribe({
      next: (success) => {
        this.sendingBooking = false;
        if (success) {
          this.bookingSuccess = this.currentLanguage === 'fr'
            ? 'Votre demande a été envoyée avec succès!'
            : 'Your tour request has been sent successfully!';
          setTimeout(() => {
            this.bookingForm = { name: '', email: '', phone: '', message: '' };
            this.closeBookingModal();
          }, 2000);
        } else {
          this.bookingError = this.currentLanguage === 'fr'
            ? 'Erreur lors de l\'envoi. Veuillez réessayer.'
            : 'Error sending request. Please try again.';
        }
      },
      error: (err) => {
        this.sendingBooking = false;
        this.bookingError = this.currentLanguage === 'fr'
          ? 'Erreur lors de l\'envoi. Veuillez réessayer.'
          : 'Error sending request. Please try again.';
        console.error('Booking email error:', err);
      }
    });
  }

  bookTour(): void {
    this.openBookingModal();
  }
}