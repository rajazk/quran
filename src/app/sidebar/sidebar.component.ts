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
  surahSearch = ''
  verseSearch = ''
  selectedPage = 1
  selectedVerse = 1
  chaptersList: any = []
  filteredChaptersList: any = []
  versesArray: any = []
  filteredVersesArray: any = []
  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {

    this.route.queryParams.subscribe((params: any) => {
      this.selectedNavigation = params.nav
      this.selectedPage = params.page ? +params.page : +params.surah
      if (this.selectedNavigation === 'surah') {
        this.selectedPage = +params.surah

        this.selectedVerse = +params.verse
        this.api.getChapters().subscribe(r => {
          this.chaptersList = [...r.chapters]
          this.filteredChaptersList = [...r.chapters]
          this.versesArray = new Array(this.chaptersList[this.selectedPage - 1].verses_count)
          this.filteredVersesArray = [... this.versesArray].map((r, index) => {
            return {
              page: index + 1
            }
          })
          this.versesArray = [...this.filteredVersesArray]
        })
      } else if (this.selectedNavigation === 'juz') {
        this.selectedPage = +params.juz

        this.totalJuzArrayFiltered = [...this.totalJuzArray].map((r, index) => {
          return {
            juzNo: index + 1
          }
        })
        this.totalJuzArray = [...this.totalJuzArrayFiltered]
      } else {
        this.selectedPage = +params.page

        this.totalPagesArrayFiltered = [...this.totalPagesArray].map((r, index) => {
          return {
            page: index + 1
          }
        })
        this.totalPagesArray = [...this.totalPagesArrayFiltered]
      }
    })
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

  onSurahChange(i: number) {
    this.selectedPage = +i

    this.router.navigate(['/'], { queryParams: { surah: +i, verse: 1, nav: 'surah' } })
  }
  onVerseChange(i: number) {
    this.selectedVerse = +i

    this.router.navigate(['/'], { queryParams: { surah: this.selectedPage, verse: +i, nav: 'surah' } })
  }
  FilterPageArray() {
    this.totalPagesArrayFiltered = [...this.totalPagesArray].filter(r => r.page.toString().includes(this.pageSearch.toString()))
  }
  FilterJuzArray() {
    this.totalJuzArrayFiltered = [...this.totalJuzArray].filter(r => r.juzNo.toString().includes(this.juzSearch.toString()))
  }

  FilterSearchArray() {
    this.filteredChaptersList = [...this.chaptersList].filter(r => {
      let objToBeConsider = false
      if (r.id.toString().includes(this.surahSearch.toString()) || r.name_simple.includes(this.surahSearch.toString())) {
        objToBeConsider = true
      }
      return objToBeConsider
    })
  }

  FilterVerseArray() {
    this.filteredVersesArray = [...this.versesArray].filter(r => r.page.toString().includes(this.verseSearch.toString()))
  }
}
