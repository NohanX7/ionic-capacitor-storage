import { CommonModule } from '@angular/common';
import { Component, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
  IonFab,
  IonFabButton,
  IonIcon,
  AlertController,
  IonSearchbar,
  IonText,
  IonSegment,
  IonSegmentButton
} from '@ionic/angular/standalone';

// Icon
import { addIcons } from 'ionicons';
import { add, trash, create } from 'ionicons/icons';

// Service
import { DataMahasiswaService } from '../services/data-mahasiswa.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonSearchbar,
    IonSegment,
    IonSegmentButton,
    IonList,
    IonItem,
    IonLabel,
    IonButtons,
    IonButton,
    IonFab,
    IonFabButton,
    IonIcon,
    IonText
  ],
})
export class HomePage {

  // =========================
  // STATE
  // =========================
  dataMahasiswa: any[] = [];
  dataMahasiswaAsli: any[] = [];

  modeSort: 'terbaru' | 'az' | 'za' = 'terbaru';
  keywordCari: string = '';

  constructor(
    private dataService: DataMahasiswaService,
    private alertController: AlertController,
    private cdr: ChangeDetectorRef
  ) {
    addIcons({ add, trash, create });
  }

  async ionViewWillEnter() {
    await this.loadData();
  }

  // =========================
  // LOAD DATA
  // =========================
  async loadData() {
    this.dataMahasiswaAsli = await this.dataService.getData();
    this.applyFilter();
  }

  // =========================
  // 🔍 SEARCH
  // =========================
  cariMahasiswa(event: any) {
    this.keywordCari = event.target.value?.toLowerCase() || '';
    this.applyFilter();
  }

  // =========================
  // 🔃 SORT
  // =========================
urutkanData(event: any) {
  const mode = event.detail.value as 'terbaru' | 'az' | 'za';

  if (!mode) return;

  this.modeSort = mode;
  this.applyFilter();
}


  // =========================
  // 🔁 APPLY SEARCH + SORT
  // =========================
  applyFilter() {
    let data = [...this.dataMahasiswaAsli];

    // Filter search
    if (this.keywordCari) {
      data = data.filter((mhs: any) =>
        mhs.nama.toLowerCase().includes(this.keywordCari) ||
        mhs.jurusan.toLowerCase().includes(this.keywordCari)
      );
    }

    // Sorting
    if (this.modeSort === 'terbaru') {
      data.sort((a, b) => b.id - a.id);
    }

    if (this.modeSort === 'az') {
      data.sort((a, b) =>
        a.nama.toLowerCase().localeCompare(b.nama.toLowerCase())
      );
    }

    if (this.modeSort === 'za') {
      data.sort((a, b) =>
        b.nama.toLowerCase().localeCompare(a.nama.toLowerCase())
      );
    }

    this.dataMahasiswa = data;
    this.cdr.detectChanges();
  }

// =========================
// ✏️ EDIT CEPAT (ALERT INPUT)
// =========================
async editCepat(mhs: any) {
  const alert = await this.alertController.create({
    header: 'Edit Data Mahasiswa',
    inputs: [
      {
        name: 'nim',
        type: 'text',
        placeholder: 'NIM',
        value: mhs.nim
      },
      {
        name: 'nama',
        type: 'text',
        placeholder: 'Nama Mahasiswa',
        value: mhs.nama
      },
      {
        name: 'jurusan',
        type: 'text',
        placeholder: 'Program Studi',
        value: mhs.jurusan
      }
    ],
    buttons: [
      {
        text: 'Batal',
        role: 'cancel'
      },
      {
        text: 'Simpan',
        handler: async (data) => {
          this.dataMahasiswaAsli = await this.dataService.editData(mhs.id, data);
          this.applyFilter(); // biar search + sort tetap sinkron
        }
      }
    ]
  });

  await alert.present();
}


  // =========================
  // 🗑️ HAPUS
  // =========================
  async konfirmasiHapus(id: number) {
    const alert = await this.alertController.create({
      header: 'Konfirmasi',
      message: 'Apakah Anda yakin ingin menghapus data ini?',
      buttons: [
        { text: 'No', role: 'cancel' },
        {
          text: 'Yes',
          handler: async () => {
            this.dataMahasiswaAsli = await this.dataService.hapusData(id);
            this.applyFilter();
          }
        }
      ]
    });

    await alert.present();
  }
}
