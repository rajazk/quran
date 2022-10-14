import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
    per_page: 1,
    words: true,
    language: 'en',
    word_fields: 'text_uthmani,audio_url',
    audio: 1
  })
  baseUrl = apis.baseUrl
  totalPagesArray = new Array(604)
  currentAudio: any
  fullSurahAudio: any
  verseSetInterval: any
  wordSetInterval: any
  totalVerseTime: any = null
  currentAudioToPlayIndex = 0
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
      console.log(params)
      this.params.next({ ...initialParams })

      this.fetchPageData()
    })
  }
  fetchPageData() {
    this.api.getChaptersList(this.params.value, this.params.value.page).subscribe((r: pageDbResponse) => {
      this.pageData = r
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
