import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apis } from 'src/environments/environment';
export interface pageParams {
  language?: string
  words?: boolean
  page: number
  per_page?: number
  word_fields: string
  audio: any
}
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  baseUrl = apis.baseUrl
  constructor(
    private http: HttpClient,
  ) { }
  getChaptersList(paramsToSend: pageParams, pageNo: number): Observable<any> {
    const url = `${this.baseUrl}/verses/by_page/${pageNo}`
    return this.http.get<any>(url, { params: { ...paramsToSend } })
  }

  getChapterInfo(paramsToSend: { language: string }, surahId: number): Observable<any> {
    const url = `${this.baseUrl}/chapters/${surahId}/info`
    return this.http.get<any>(url, { params: { ...paramsToSend } })
  }

  getChapter(surahId: number): Observable<any> {
    const url = `${this.baseUrl}/chapters/${surahId}`
    return this.http.get<any>(url)
  }
}
