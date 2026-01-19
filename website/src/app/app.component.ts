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
    .main-content {
      min-height: calc(100vh - 80px - 200px); // Account for header and footer
      padding-top: 80px; // Account for fixed header
    }
  `]
})
export class AppComponent implements OnInit {
  title = 'montreal4rent';
  
  constructor(private router: Router) {}
  
  ngOnInit() {
    // Handle GitHub Pages SPA redirect
    const redirect = sessionStorage.redirect;
    delete sessionStorage.redirect;
    if (redirect && redirect !== location.href) {
      const path = redirect.replace(location.origin + '/montreal4rent/', '');
      this.router.navigateByUrl('/' + path);
    }
  }
}