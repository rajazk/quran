import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { apis } from 'src/environments/environment';
import { ApiService, pageParams } from '../services/api.service';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { faComment } from '@fortawesome/free-solid-svg-icons';
import { faShareNodes } from '@fortawesome/free-solid-svg-icons';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
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
  faPlay = faPlay;
  faComment = faComment
  faShareNodes = faShareNodes
  faCircleInfo = faCircleInfo
  pageData: pageDbResponse | any
  params = new BehaviorSubject<pageParams>({
    page: 1,
    per_page: 7,
    words: true,
    language: 'en',
    word_fields: 'text_uthmani,audio_url',
    audio: 1,
    nav: 'pages',
    juz: 1
  })
  baseUrl = apis.baseUrl
  totalPagesArray = new Array(604)
  currentAudio: any
  fullSurahAudio: any
  verseSetInterval: any
  wordSetInterval: any
  totalVerseTime: any = null
  currentAudioToPlayIndex = 0
  isLoading = false
  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.queryParams.subscribe(params => {
      const initialParams: any = { ...this.params.value }
      Object.keys(params).forEach(key => {
        initialParams[key] = params[key]
      })
      this.params.next({ ...initialParams })
      this.fetchPageData()
    })
  }
  @HostListener("window:scroll", ["$event"])
  getScrollHeight(): void {
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 200 && !this.isLoading && this.params.value.nav === 'juz') {
      this.isLoading = true;
      if (
        this.params.value.page++ < this.pageData.pagination.total_pages && this.pageData
      ) {
        this.router.navigate(['/'], { queryParams: { juz: this.params.value.juz, nav: 'juz', page: this.params.value.page++ } })
      }
    }
  }
  fetchPageData() {
    this.isLoading = true
    let apiDetails = this.api.getVersesByPageNo(this.params.value)
    if (this.params.value.nav === 'juz') {
      apiDetails = this.api.getVersesByJuzNo(this.params.value)
    }
    apiDetails.subscribe((r: pageDbResponse) => {
      this.isLoading = false
      let oldData: any = { ...this.pageData }
      if (this.params.value.nav === 'juz' && this.pageData && +this.params.value.page !== 1) {
        let newData: any = {
          pagination: { ...r.pagination },
          verses: [],
        }
        newData.verses.push(...oldData.verses, ...r.verses)
        this.pageData = newData
      } else {
        this.pageData = r
      }
      console.log('PageDAta', this.pageData)
    })
  }

  ngOnInit(): void {
  }

  onPageChange(i: number) {
    this.params.next({ ...this.params.value, page: i })
    this.router.navigate(['/'], { queryParams: { page: this.params.value.page } })
  }

  playAudio(audioUrl: string) {
    if (this.currentAudio) {
      this.currentAudio.pause()
      this.currentAudio = null
    }
    if (audioUrl && !this.currentAudio) {
      this.currentAudio = new Audio()
      this.currentAudio.src = `https://verses.quran.com/${audioUrl}`
      this.currentAudio.play()
    }
  }
  playFullAudio() {
    const arrayLength = this.pageData.verses.length
    this.totalVerseTime = this.getVerseTime(this.pageData.verses[this.currentAudioToPlayIndex])
    this.currentAudio = new Audio
    this.currentAudio.src = `https://verses.quran.com/${this.pageData.verses[this.currentAudioToPlayIndex].audio.url}`
    this.currentAudio.play()
    this.highlightWords()
    this.verseSetInterval = setInterval(() => {
      this.currentAudioToPlayIndex++
      clearInterval(this.verseSetInterval)
      if (this.currentAudioToPlayIndex < arrayLength) {
        this.playFullAudio()
      }
    }, this.totalVerseTime);
  }
  getVerseTime(verse: any) {
    const verseTime = verse.audio.segments[verse.audio.segments.length - 1][3]

    return verseTime
  }
  highlightWords() {

  }
  onAudioEnded() {

  }
}
