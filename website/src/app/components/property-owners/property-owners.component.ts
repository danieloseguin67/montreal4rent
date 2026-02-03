import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

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
            <p class="hero-description">Leasing and rental services for Montreal property owners.</p>
            <p>Specializing in high-volume rentals: multi-residential, new construction, and value-add properties.</p>
          </div>
        </div>
        <div class="hero-image">
          <img src="assets/images/unfurnished1.jpg" alt="Property Owners" loading="lazy">
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
              <h3>Tenant Screening</h3>
              <p>Rigorous screening including credit, income verification, and rental history.</p>
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
            src="assets/images/montrealdowntown.jpg" 
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
export class PropertyOwnersComponent {}
