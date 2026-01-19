import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Apartment {
  id: string;
  title: string;
  titleEn: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  squareFootage: number;
  price: number;
  area: string;
  furnished: boolean;
  available: boolean;
  features: string[];
  featuresEn: string[];
  images: string[];
  description: string;
  descriptionEn: string;
}

export interface Area {
  id: string;
  name: string;
  nameFr: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
}

export interface ApartmentData {
  apartments: Apartment[];
}

export interface AreaData {
  areas: Area[];
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apartmentsSubject = new BehaviorSubject<Apartment[]>([]);
  private areasSubject = new BehaviorSubject<Area[]>([]);
  
  public apartments$ = this.apartmentsSubject.asObservable();
  public areas$ = this.areasSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadData();
  }

  private loadData(): void {
    // Load apartments
    this.http.get<ApartmentData>('assets/data/apartments.json').subscribe({
      next: (data) => this.apartmentsSubject.next(data.apartments),
      error: (error) => console.error('Error loading apartments:', error)
    });

    // Load areas
    this.http.get<AreaData>('assets/data/areas.json').subscribe({
      next: (data) => this.areasSubject.next(data.areas),
      error: (error) => console.error('Error loading areas:', error)
    });
  }

  getApartments(): Observable<Apartment[]> {
    return this.apartments$;
  }

  getApartment(id: string): Observable<Apartment | undefined> {
    return this.apartments$.pipe(
      map(apartments => apartments.find(apt => apt.id === id))
    );
  }

  getAreas(): Observable<Area[]> {
    return this.areas$;
  }

  getArea(id: string): Observable<Area | undefined> {
    return this.areas$.pipe(
      map(areas => areas.find(area => area.id === id))
    );
  }

  getApartmentsByArea(areaId: string): Observable<Apartment[]> {
    return this.apartments$.pipe(
      map(apartments => apartments.filter(apt => apt.area === areaId))
    );
  }

  getFeaturedApartments(limit: number = 6): Observable<Apartment[]> {
    return this.apartments$.pipe(
      map(apartments => apartments.filter(apt => apt.available).slice(0, limit))
    );
  }

  searchApartments(filters: {
    area?: string;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    furnished?: boolean;
  }): Observable<Apartment[]> {
    return this.apartments$.pipe(
      map(apartments => {
        return apartments.filter(apt => {
          if (filters.area && apt.area !== filters.area) return false;
          if (filters.minPrice && apt.price < filters.minPrice) return false;
          if (filters.maxPrice && apt.price > filters.maxPrice) return false;
          if (filters.bedrooms !== undefined && apt.bedrooms !== filters.bedrooms) return false;
          if (filters.furnished !== undefined && apt.furnished !== filters.furnished) return false;
          return true;
        });
      })
    );
  }

  sortApartments(apartments: Apartment[], sortBy: 'price-asc' | 'price-desc'): Apartment[] {
    return [...apartments].sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        default:
          return 0;
      }
    });
  }
}