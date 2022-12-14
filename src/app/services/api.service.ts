import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { apis } from '../../environments/environment';
export interface pageParams {
  language?: string
  words?: boolean
  page: number
  per_page?: number
  word_fields: string
  audio: any
  nav: string
  juz: number
  hizb?: number
  surah?: number,
  verse?: number,
  translations?: string
}
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  baseUrl = apis.baseUrl
  isSidebarShow = true
  chaptersData: any = []
  translations = new Subject()
  constructor(
    private http: HttpClient,
  ) {
    this.getChapters().subscribe(r => {
      console.log('chapter data', r);
      this.chaptersData = r.chapters
    })
    this.getLanguages().subscribe(r=>{
      console.log('languages=',r);

    })
  }
  getVersesByPageNo(paramsToSend: pageParams): Observable<any> {
    let params: any = { ...paramsToSend }
    delete (params.nav)
    delete (params.juz)
    delete (params.page)
    delete (params.per_page)
    const url = `${this.baseUrl}/verses/by_page/${paramsToSend.page}`
    return this.http.get<any>(url, { params: { ...params } })
  }

  getVersesByJuzNo(paramsToSend: pageParams): Observable<any> {
    let params: any = { ...paramsToSend }
    delete (params.nav)
    const url = `${this.baseUrl}/verses/by_juz/${paramsToSend.juz}`
    return this.http.get<any>(url, { params: { ...params } })
  }

  getVersesByVerseId(paramsToSend: pageParams): Observable<any> {
    const url = `${this.baseUrl}/verses/by_key/${paramsToSend.surah}:${paramsToSend.verse}?language=en&words=true`
    return this.http.get<any>(url, { params: { ...paramsToSend } })
  }

  getLanguages(): Observable<any> {
    const url = `${this.baseUrl}/resources/languages`
    return this.http.get<any>(url)
  }

  getChapterInfo(paramsToSend: { language: string }, surahId: number): Observable<any> {
    const url = `${this.baseUrl}/chapters/${surahId}/info`
    return this.http.get<any>(url, { params: { ...paramsToSend } })
  }

  getChapter(surahId: number): Observable<any> {
    const url = `${this.baseUrl}/chapters/${surahId}`
    return this.http.get<any>(url)
  }

  getChapters(): Observable<any> {
    const url = `${this.baseUrl}/chapters`
    return this.http.get<any>(url)
  }
}
