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
  params = new BehaviorSubject<pageParams | any>({
    page: 1,
    per_page: 1,
    words: true,
    language: 'en',
    word_fields: 'text_uthmani,audio_url',
    audio: 1
  })
  pageData: pageDbResponse | any
  totalPagesArray = new Array(604)
  totalPagesArrayFiltered: any = []
  totalJuzArray = new Array(30)
  selectedNavigation = 'surah'
  pageSearch = ''
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
    this.totalJuzArray.map((r, index) => {
      return {
        page: index + 1
      }
    })
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const initialParams: any = { ...this.params.value }
      Object.keys(params).forEach(key => {
        initialParams[key] = params[key]
      })
      this.params.next({ ...initialParams })
      this.fetchPageData()
    })
  }
  fetchPageData() {
    this.api.getChaptersList(this.params.value, this.params.value.page).subscribe((r: pageDbResponse) => {
      this.pageData = r
      // console.log('PageDAta', this.pageData)
    })
  }

  onPageChange(i: number) {
    this.params.next({ ...this.params.value, page: +i })
    console.log('va;ues', this.params.value)
    this.router.navigate(['/'], { queryParams: { page: this.params.value.page } })
  }

  FilterPageArray() {
    this.totalPagesArrayFiltered = [...this.totalPagesArray].filter(r => r.page.toString().includes(this.pageSearch.toString()))
  }
}
