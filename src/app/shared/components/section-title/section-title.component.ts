import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { ROUTES_KEYS } from '../../config/routes-keys.config';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { StorageService } from '../../../core';

@Component({
  selector: 'app-section-title',
  imports: [CommonModule, MatDividerModule],
  templateUrl: './section-title.component.html',
  styleUrl: './section-title.component.scss'
})
export class SectionTitleComponent {

  @Input() sectionTitle: string | undefined
  ROUTES_KEYS = ROUTES_KEYS

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private storageService: StorageService,
  ) {}

  ngOnInit() {
    this.sectionTitle = this.route.snapshot?.routeConfig?.data?.['title']
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => {
        let route = this.router.routerState.root;
        while (route.firstChild) {
          route = route.firstChild
        }
        return route
      }),
      filter(route => route.outlet === 'primary')
    ).subscribe(route => {
      if (route.snapshot.routeConfig?.path === ROUTES_KEYS.home) {
        this.sectionTitle = `Olá ${this.storageService.getUserNickname()}!`
      } else {
        this.sectionTitle = route.snapshot.routeConfig?.title?.toString()
      }
    });
  }


}
