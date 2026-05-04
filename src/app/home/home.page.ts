import {Component, inject} from '@angular/core';
import { addIcons } from 'ionicons';
import {
  cloudUploadOutline,
  documentOutline,
  closeOutline,
  addOutline,
  layersOutline
} from 'ionicons/icons';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonItem,
  IonLabel,
  IonButton,
  IonSpinner,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonProgressBar,
  IonBadge,
  IonIcon,
  IonButtons, IonBackButton
} from '@ionic/angular/standalone';
import {Diagnostic} from "../services/diagnostic";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonItem, IonButton, IonSpinner, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonProgressBar, IonBadge, IonIcon, IonButtons, IonBackButton],
})
export class HomePage {

  constructor() {
    addIcons({
      'cloud-upload-outline': cloudUploadOutline,
      'document-outline': documentOutline,
      'close-outline': closeOutline,
      'add-outline': addOutline,
      'layers-outline': layersOutline
    });
  }
  private diagService =  inject(Diagnostic);
  selectedFile: File | null = null;
  result: any = null;
  isLoading = false;

  // Variables pour la barre de progression
  normalScore = 0;
  pneumoniaScore = 0;


  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
  }

  analyze() {
    if (!this.selectedFile) return;
    this.isLoading = true;

    this.diagService.predict(this.selectedFile).subscribe({
      next: (res) => {
        this.result = res;
        // On récupère les scores du tableau [ [score_normal, score_pneumonie] ]
        this.normalScore = res.raw_scores[0][0];
        this.pneumoniaScore = res.raw_scores[0][1];
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  reset() {
    this.selectedFile = null;
    this.result = null;
    this.isLoading = false;
    this.normalScore = 0;
    this.pneumoniaScore = 0;
  }
}
