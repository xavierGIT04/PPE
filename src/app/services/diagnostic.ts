// services/pneumonia.service.ts
// Envoie l'image au backend Spring Boot et retourne la réponse typée

import {inject, Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PneumoniaResponse } from '../model/pneumonia.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class Diagnostic {

  // environment.apiUrl = "http://localhost:8080" en dev
  //                    = "https://api.monhopital.com" en prod
  private readonly endpoint = `${environment.apiUrl}/api/pneumonia/analyze`;

  private http = inject(HttpClient)

  constructor() {}

  /**
   * Envoie l'image radiologique au backend Spring Boot.
   * @param file  Fichier sélectionné par l'utilisateur (input[type=file])
   */
  analyze(file: File): Observable<PneumoniaResponse> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post<PneumoniaResponse>(this.endpoint, formData);
  }
}
