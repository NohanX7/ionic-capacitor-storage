import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonItem, IonInput, IonButton, IonText, IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { Router } from '@angular/router'; // Import Router
import { DataMahasiswaService } from '../services/data-mahasiswa.service'; // Import Service

@Component({
  selector: 'app-tambah-mhs',
  templateUrl: './tambah-mhs.page.html',
  styleUrls: ['./tambah-mhs.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton,
    IonItem, IonInput, IonButton, IonText, IonSelect, IonSelectOption,
    CommonModule, FormsModule, ReactiveFormsModule
  ]
})
export class TambahMhsPage implements OnInit {

  // Variabel untuk menampung form
  formMahasiswa!: FormGroup;

  // PERBAIKAN DI SINI: Inject Service dan Router ke Constructor
  constructor(
    private formBuilder: FormBuilder,
    private dataService: DataMahasiswaService, // <--- Service Data
    private router: Router                     // <--- Service Router (Pindah Halaman)
  ) { }

  ngOnInit() {
    // Inisialisasi Form
    this.formMahasiswa = this.formBuilder.group({
      nama: ['', [Validators.required, Validators.minLength(3)]],
      nim: ['', [Validators.required, Validators.pattern('^[0-9]*$')]], // Hanya angka
      jurusan: ['', [Validators.required]]
    });
  }

  // Fungsi yang dipanggil saat tombol Simpan diklik
  // PERBAIKAN: Tambahkan 'async' karena penyimpanan butuh waktu
  async simpanData() {
    if (this.formMahasiswa.valid) {

      // 1. Panggil Service untuk menyimpan data
      await this.dataService.tambahData(this.formMahasiswa.value);

      // 2. Tampilkan pesan sukses
      console.log('Data Disimpan:', this.formMahasiswa.value);
      alert('Data Berhasil Disimpan!');

      // 3. Reset Form & Kembali ke Halaman Home
      this.formMahasiswa.reset();
      this.router.navigateByUrl('/home');

    } else {
      console.log('Form tidak valid');
      this.markFormGroupTouched(this.formMahasiswa); // Agar error merah muncul
    }
  }

  // Helper agar error muncul semua jika user memaksa klik submit
  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
    });
  }
}
