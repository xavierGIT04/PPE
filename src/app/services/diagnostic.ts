import {inject, Injectable} from '@angular/core';
import {Observable} from "rxjs";
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Diagnostic {

  private readonly API_URL = 'http://localhost:8787/api/analyze/upload';
  private http = inject(HttpClient);

  predict(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(this.API_URL, formData);
  }
}
