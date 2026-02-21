import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CacheBustingService } from '../../services/cache-busting.service';

@Component({
  selector: 'app-property-owners',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="property-owners-page">
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-content">
          <div class="container">
            <h1>Property Owners</h1>
              <p class="hero-description">High-Performance Leasing for Multi-Residential Properties</p>
              <p class="hero-subtitle">Specializing in high-volume rentals, new construction, and value-add assets.</p>
          </div>
        </div>
        <div class="hero-image">
          <img [src]="getImageUrl('property-rental-owners.jpg')" alt="Property Owners" loading="lazy">
        </div>
      </section>

      <!-- Services Section -->
      <section class="services-section">
        <div class="container">
          <div class="services-grid">
            <div class="service-card">
              <h3>Leasing</h3>
              <p>Professional leasing processes designed to minimize vacancy and maximize rent.</p>
            </div>
            <div class="service-card">
              <h3>Property Evaluation & Market Positioning</h3>
              <ul>
                <li>On-site evaluation of rent-ready condition with clear recommendations on repairs & cleaning</li>
                <li>Pricing analysis</li>
                <li>Comparable research</li>
                <li>Promotion structuring</li>
                <li>Ongoing feedback from showings</li>
                <li>Market response used to refine pricing</li>
                <li>Fully furnished VS Unfurnished marketing strategies</li>
              </ul>
            </div>
            <div class="service-card">
              <h3>Marketing</h3>
              <p>Targeted marketing campaigns, high-quality listings, and lead management.</p>
            </div>
          </div>

          
        </div>
      </section>

      <!-- Bottom Showcase Image -->
      <section class="showcase-section">
        <div class="container">
          <img 
            [src]="getImageUrl('montrealdowntown.jpg')" 
            alt="Montreal condo high-rise" 
            loading="lazy" 
            class="showcase-image"
          >
        </div>
      </section>
    </div>
  `,
  styleUrls: ['./property-owners.component.scss']
})
export class PropertyOwnersComponent {
  constructor(private cacheBusting: CacheBustingService) {}

  getImageUrl(imagePath: string): string {
    return this.cacheBusting.getImageUrl(imagePath);
  }
}
