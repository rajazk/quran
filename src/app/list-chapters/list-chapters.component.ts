import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { apis } from 'src/environments/environment';
import { ApiService, pageParams } from '../services/api.service';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { faPause } from '@fortawesome/free-solid-svg-icons';
import { faComment } from '@fortawesome/free-solid-svg-icons';
import { faShareNodes } from '@fortawesome/free-solid-svg-icons';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
export interface pageDbResponse {
  pagination: {
    current_page: number
    next_page: null
    per_page: number
    total_pages: number
    total_records: number
  },
  verses: [],
  verse?: any
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
  faPause = faPause
  pageData: pageDbResponse | any
  params = new BehaviorSubject<pageParams>({
    page: 1,
    per_page: 7,
    words: true,
    language: 'en',
    word_fields: 'text_uthmani,audio_url',
    audio: 1,
    nav: 'pages',
    juz: 1,
    hizb: 1,
    surah: 1,
    verse: 1
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
  selectedVerseData: any = {}
  selectedVerse: any = null
  selectedWord: any = null
  selectedVerseIndex: any = null
  selectedWordIndex: any = null
  constructor(
    public api: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.queryParams.subscribe(params => {
      if (!params.hasOwnProperty('nav')) {
        this.router.navigate(['/'], { queryParams: { nav: 'pages' } })
      }
      const initialParams: any = { ...this.params.value }
      Object.keys(params).forEach(key => {
        initialParams[key] = params[key]
      })
      this.params.next({ ...initialParams })
      this.fetchPageData()
    })
  }

  ngOnInit(): void {
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
    if (this.params.value.nav === 'surah') {
      apiDetails = this.api.getVersesByVerseId(this.params.value)
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
      } else if (this.params.value.nav === 'surah') {
        console.log('asdf');
        const data = {
          verses: [
            { ...r.verse }
          ]
        }
        this.pageData = data
      } else {
        this.pageData = r
      }
    })
  }
  pauseAudio() {
    clearInterval(this.verseSetInterval)
    clearInterval(this.wordSetInterval)
    this.selectedWord = null
    if (this.currentAudio) {
      this.currentAudio.pause()
      this.currentAudio = null
    }
  }

  onPageChange(i: number) {
    this.params.next({ ...this.params.value, page: i })
    this.router.navigate(['/'], { queryParams: { page: this.params.value.page } })
  }

  playAudioOfWord(word: any, wordIndex: number, surahIndex: number) {
    const audioUrl = word.audio_url
    this.pauseAudio()
    if (audioUrl && !this.currentAudio) {
      this.totalVerseTime = this.getWordTime(wordIndex, surahIndex)
      this.currentAudio = new Audio()
      this.currentAudio.src = `https://verses.quran.com/${audioUrl}`
      this.currentAudio.play()
      this.selectedWord = `${surahIndex} ${wordIndex}`
      this.currentAudio.onended = () => {
        this.pauseAudio()
      };
    }
  }


  playVerseAudio(surrah: any) {
    const audioUrl = surrah.audio.url
    this.pauseAudio()
    if (audioUrl && !this.currentAudio) {
      this.totalVerseTime = this.getVerseTime(surrah)
      this.currentAudio = new Audio()
      this.currentAudio.src = `https://verses.quran.com/${audioUrl}`
      this.currentAudio.play()
    }
    this.currentAudioToPlayIndex = this.pageData.verses.findIndex((item: any) => item.id === surrah.id)
    this.highlightWords()
    this.verseSetInterval = setTimeout(() => {
      this.pauseAudio()
    }, this.totalVerseTime);
  }
  onPlayFullAudio() {
    this.pauseAudio()
    this.playFullAudioWIP()
  }
  playFullAudio() {
    const arrayLength = this.pageData.verses.length
    this.totalVerseTime = this.getVerseTime(this.pageData.verses[this.currentAudioToPlayIndex])
    this.currentAudio = new Audio
    this.currentAudio.src = `https://verses.quran.com/${this.pageData.verses[this.currentAudioToPlayIndex].audio.url}`
    this.currentAudio.play()
    this.highlightWords()
    this.verseSetInterval = setInterval(() => {
      this.pauseAudio()
      this.currentAudioToPlayIndex++
      if (this.currentAudioToPlayIndex < arrayLength) {
        this.playFullAudio()
      }
    }, this.totalVerseTime);
  }

  playFullAudioWIP() {
    const arrayLength = this.pageData.verses.length
    this.totalVerseTime = this.getVerseTime(this.pageData.verses[this.currentAudioToPlayIndex])
    this.currentAudio = new Audio
    this.currentAudio.src = `https://verses.quran.com/${this.pageData.verses[this.currentAudioToPlayIndex].audio.url}`
    this.currentAudio.play()
    this.highlightWords()
    this.verseSetInterval = setInterval(() => {
      this.pauseAudio()
      this.currentAudioToPlayIndex++
      if (this.currentAudioToPlayIndex < arrayLength) {
        this.playFullAudio()
      }
    }, this.totalVerseTime);
  }
  getVerseTime(verse: any) {
    const verseTime = verse.audio.segments[verse.audio.segments.length - 1][3]

    return verseTime
  }
  getWordTime(wordIndex: any, surahIndex: any) {
    const wordTimeArrayPreviousIndexValue = this.pageData.verses[surahIndex].audio.segments[wordIndex - 1]
    const wordTimeArray = this.pageData.verses[surahIndex].audio.segments[wordIndex]
    const wordTime = wordTimeArray[3] - (wordTimeArrayPreviousIndexValue ? wordTimeArrayPreviousIndexValue[3] : 0)
    console.log(wordTime);


    return wordTime
  }
  highlightWords() {
    this.wordSetInterval = setInterval(() => {
      const verseAudioSegment = this.pageData.verses[this.currentAudioToPlayIndex].audio.segments
      const wordIndex = verseAudioSegment.findIndex((time: any) => (time[3] / 1000) >= (this.currentAudio.currentTime))
      if (wordIndex > -1) {
        this.selectedWord = `${this.currentAudioToPlayIndex} ${wordIndex}`
      }
    }, 0)
  }
  onAudioEnded() {

  }
}
