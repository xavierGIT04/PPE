// home.page.ts — Tableau de bord clinique (fusionné)
import { Component, inject, OnInit } from '@angular/core';
import { Router }                    from '@angular/router';
import { PneumoniaResponse }         from '../model/pneumonia.model';
import { Diagnostic }                from '../services/diagnostic';
import {
  IonAccordion,
  IonAccordionGroup,
  IonBackButton,
  IonBadge,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonChip,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonNote,
  IonProgressBar,
  IonSpinner,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonButtons,
    IonTitle,
    IonBackButton,
    IonContent,
    IonSpinner,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonProgressBar,
    IonLabel,
    IonIcon,
    IonChip,
    IonButton,
    IonNote,
    IonAccordionGroup,
    IonAccordion,
    IonItem,
  ],
})
export class HomePage implements OnInit {

  // ── État global ────────────────────────────────────────────────────────────
  response:    PneumoniaResponse | null = null;
  loading      = false;
  error:       string | null = null;

  // ── Upload ─────────────────────────────────────────────────────────────────
  selectedFile: File | null = null;

  // ── UI toggles ─────────────────────────────────────────────────────────────
  showExplain = false;   // panneau pédagogique "Comment lire cette carte ?"

  // ── Services ───────────────────────────────────────────────────────────────
  private svc    = inject(Diagnostic);
  private router = inject(Router);

  // ── Lifecycle ──────────────────────────────────────────────────────────────

  ngOnInit(): void {
    // Support navigation avec un fichier passé en state (ex: depuis une autre page)
    const file: File | undefined =
      this.router.getCurrentNavigation()?.extras?.state?.['file'];
    if (file) {
      this.selectedFile = file;
      this.analyze(file);
    }
  }

  // ── Gestion du fichier ─────────────────────────────────────────────────────

  /** Déclenché par <input type="file"> */
  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input.files?.[0] ?? null;
    // Réinitialise les résultats précédents si l'utilisateur choisit un nouveau fichier
    this.response = null;
    this.error    = null;
  }

  // ── Analyse ────────────────────────────────────────────────────────────────

  analyze(file: File): void {
    this.loading  = true;
    this.error    = null;
    this.response = null;

    this.svc.analyze(file).subscribe({
      next:  r  => { this.response = r; this.loading = false; },
      error: () => {
        this.error   = "Erreur d'analyse. Veuillez réessayer.";
        this.loading = false;
      },
    });
  }

  // ── Reset ──────────────────────────────────────────────────────────────────

  /** Remet le composant dans son état initial (zone d'upload) */
  reset(): void {
    this.response     = null;
    this.selectedFile = null;
    this.error        = null;
    this.showExplain  = false;
  }

  // ── Getters (vue) ──────────────────────────────────────────────────────────

  get isPneumonia():     boolean { return this.response?.prediction === 'PNEUMONIA'; }
  get alertColor():      string  { return this.isPneumonia ? 'danger' : 'success'; }
  get gaugePercent():    number  { return this.response?.confidence ?? 0; }
  get heatmapSrc():      string  { return `data:image/png;base64,${this.response?.heatmap_base64}`; }
  get confidenceLabel(): string  { return `${this.response?.confidence?.toFixed(1)} %`; }
  get zones()                    { return this.response?.clinical?.attention_analysis?.activated_zones ?? []; }
}
