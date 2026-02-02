import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences'; // Import Preferences

@Injectable({
  providedIn: 'root'
})
export class DataMahasiswaService {

  // Kunci penyimpanan (ibarat nama laci)
  private KEY_MAHASISWA = 'data_mahasiswa_app';

  constructor() { }

  // =========================
  // FUNGSI 1: Membaca Data
  // =========================
  async getData() {
    const { value } = await Preferences.get({ key: this.KEY_MAHASISWA });
    return value ? JSON.parse(value) : [];
  }

  // =========================
  // FUNGSI 2: Menambah Data
  // =========================
  async tambahData(mahasiswaBaru: any) {
    const dataLama = await this.getData();
    mahasiswaBaru.id = Date.now();
    dataLama.push(mahasiswaBaru);

    await Preferences.set({
      key: this.KEY_MAHASISWA,
      value: JSON.stringify(dataLama)
    });

    return dataLama;
  }

  // =========================
  // FUNGSI 3: Menghapus Data
  // =========================
  async hapusData(id: number) {
    const dataLama = await this.getData();
    const dataBaru = dataLama.filter((item: any) => item.id !== id);

    await Preferences.set({
      key: this.KEY_MAHASISWA,
      value: JSON.stringify(dataBaru)
    });

    return dataBaru;
  }

  // =========================
  // ✏️ FUNGSI 4: EDIT DATA
  // =========================
  async editData(id: number, dataUpdate: any) {
    const dataLama = await this.getData();

    const index = dataLama.findIndex((item: any) => item.id === id);

    if (index !== -1) {
      dataLama[index] = {
        ...dataLama[index],
        ...dataUpdate
      };

      await Preferences.set({
        key: this.KEY_MAHASISWA,
        value: JSON.stringify(dataLama)
      });
    }

    return dataLama;
  }
}
