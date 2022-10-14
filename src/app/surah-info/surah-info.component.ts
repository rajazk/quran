import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-surah-info',
  templateUrl: './surah-info.component.html',
  styleUrls: ['./surah-info.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SurahInfoComponent implements OnInit {
  faArrowLeft = faArrowLeft
  surahInfoData: any = null
  chapterData: any = null
  params = {
    language: 'en'
  }
  surahId: number
  constructor(private route: ActivatedRoute, private apiService: ApiService) {

  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const initialParams: any = { ...params }
      Object.keys(params).forEach(key => {
        initialParams[key] = params[key]
      })
      this.params = { ...initialParams }
    })
    this.route.params.subscribe(params => {
      this.surahId = params['id']
    });
    this.apiService.getChapterInfo(this.params, this.surahId).subscribe(r => {
      this.surahInfoData = r
    })
    this.apiService.getChapter(this.surahId).subscribe(r => {
      this.chapterData = r
      console.log('chapter', r)
    })
  }

}
