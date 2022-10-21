import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ApiService, pageParams } from '../services/api.service';


export interface pageDbResponse {
  pagination: {
    current_page: 1
    next_page: null
    per_page: 7
    total_pages: 1
    total_records: 7
  },
  verses: []
}
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  pageData: pageDbResponse | any
  totalPagesArray = new Array(604)
  totalPagesArrayFiltered: any = []
  totalJuzArray = new Array(30)
  totalJuzArrayFiltered: any = []

  selectedNavigation = 'surah'
  pageSearch = ''
  juzSearch = ''
  selectedPage = 1
  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.totalPagesArrayFiltered = [...this.totalPagesArray].map((r, index) => {
      return {
        page: index + 1
      }
    })
    this.totalPagesArray = [...this.totalPagesArrayFiltered]
    this.totalJuzArrayFiltered = [...this.totalJuzArray].map((r, index) => {
      return {
        juzNo: index + 1
      }
    })
    this.totalJuzArray = [...this.totalJuzArrayFiltered]
  }

  ngOnInit(): void {

  }


  onPageChange(i: number) {
    this.selectedPage = +i
    this.router.navigate(['/'], { queryParams: { page: +i, nav: 'pages' } })
  }

  onJuzChange(i: number) {
    this.selectedPage = +i

    this.router.navigate(['/'], { queryParams: { juz: +i, nav: 'juz', page: 1 } })
  }

  FilterPageArray() {
    this.totalPagesArrayFiltered = [...this.totalPagesArray].filter(r => r.page.toString().includes(this.pageSearch.toString()))
  }
  FilterJuzArray() {
    this.totalJuzArrayFiltered = [...this.totalJuzArray].filter(r => r.juzNo.toString().includes(this.juzSearch.toString()))
  }
}
