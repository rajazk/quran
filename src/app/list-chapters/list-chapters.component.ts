import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { apis } from 'src/environments/environment';
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
  selector: 'app-list-chapters',
  templateUrl: './list-chapters.component.html',
  styleUrls: ['./list-chapters.component.scss']
})
export class ListChaptersComponent implements OnInit {
  @ViewChild('audioPlayer') audioPlayer: ElementRef;
  pageData: pageDbResponse | any
  params = new BehaviorSubject<pageParams>({
    page: 1,
    per_page: 1,
    words: true,
    language: 'en',
    word_fields: 'text_uthmani,audio_url',
    audio: 1
  })
  baseUrl = apis.baseUrl
  totalPagesArray = new Array(604)
  currentAudio: any
  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.queryParams.subscribe(params => {
      this.fetchPageData()
    })
  }
  fetchPageData() {
    this.api.getChaptersList(this.params.value, this.params.value.page).subscribe((r: pageDbResponse) => {
      this.pageData = r
      console.log('changed', this.pageData)

    })
  }
  ngOnInit(): void {
  }

  onPageChange(i: number) {
    console.log('hello=', this.params.value)
    this.params.next({ ...this.params.value, page: i })
    this.router.navigate(['/chapters'], { queryParams: { page: this.params.value.page } })
  }

  playAudio(audioUrl: string) {
    if (this.currentAudio) {
      this.currentAudio.pause()
    }
    if (audioUrl) {
      this.currentAudio = new Audio()
      this.currentAudio.src = `https://verses.quran.com/${audioUrl}`
      this.currentAudio.play()
    }
  }
}
