import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { Subject, filter, takeUntil } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  template: `
    <app-header></app-header>
    <div class="main-content" id="app-main-content" tabindex="-1" role="main">
      <router-outlet></router-outlet>
    </div>
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
export class AppComponent implements OnInit, OnDestroy {
  title = 'montreal4rent';

  private destroy$ = new Subject<void>();
  
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

    // On every navigation, focus the top menu bar so screen readers
    // start at the header consistently (instead of the browser URL).
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        const focusContentAfterNav = sessionStorage['focusContentAfterNav'] === '1';
        delete sessionStorage['focusContentAfterNav'];
        setTimeout(() => {
          if (focusContentAfterNav) {
            const contentMain = document.querySelector('.main-content main[tabindex="-1"], .main-content main') as HTMLElement | null;
            (contentMain ?? document.getElementById('app-main-content'))?.focus();
            return;
          }

          document.getElementById('top-menu-bar')?.focus();
        }, 0);
      });

    // Initial focus on first load.
    setTimeout(() => {
      document.getElementById('top-menu-bar')?.focus();
    }, 0);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}