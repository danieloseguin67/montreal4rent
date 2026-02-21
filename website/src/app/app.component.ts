import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  template: `
    <app-header></app-header>
    <main class="main-content">
      <router-outlet></router-outlet>
    </main>
    <app-footer></app-footer>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      overflow-x: hidden;
      max-width: 100vw;
    }
    
    .main-content {
      min-height: calc(100vh - 80px - 200px); // Account for header and footer
      padding-top: 80px; // Account for fixed header
      width: 100%;
      overflow-x: hidden;
      max-width: 100%;
      box-sizing: border-box;
      
      @media (max-width: 767.98px) {
        padding-top: 110px; // Account for taller mobile header
      }
      
      @media (max-width: 374.98px) {
        padding-top: 115px; // Account for even taller tiny screen header
      }
    }
  `]
})
export class AppComponent implements OnInit {
  title = 'montreal4rent';
  
  constructor(private router: Router) {}
  
  ngOnInit() {
    // Handle GitHub Pages SPA redirect
    const redirect = sessionStorage['redirect'];
    delete sessionStorage['redirect'];
    if (redirect && redirect !== location.href) {
      // Get base href from document
      const baseHref = document.getElementsByTagName('base')[0]?.href || location.origin + '/';
      const path = redirect.replace(baseHref, '');
      this.router.navigateByUrl('/' + path);
    }
  }
}