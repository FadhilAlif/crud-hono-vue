// src/composables/useToastService.ts

import { useToast } from "primevue/usetoast";
import type { ToastMessageOptions } from "primevue/toast";

const DEFAULT_LIFE = 3000;
const ERROR_LIFE = 5000;

/**
 * Hook composable kustom untuk menampilkan notifikasi toast
 * dengan cara yang terpusat dan konsisten.
 */
export function useToastService() {
  const toast = useToast();

  /**
   * Menampilkan toast sukses.
   * @param summary - Judul pesan (mis. "Sukses")
   * @param detail - Isi pesan (mis. "Data berhasil disimpan.")
   * @param life - Opsional: Ganti durasi default
   */
  const success = (
    summary: string,
    detail: string,
    life: number = DEFAULT_LIFE
  ) => {
    toast.add({
      severity: "success",
      summary: summary,
      detail: detail,
      life: life,
    });
  };

  /**
   * Menampilkan toast error.
   * @param summary - Judul pesan (mis. "Gagal")
   * @param detail - Isi pesan (mis. "Terjadi kesalahan.")
   * @param life - Opsional: Ganti durasi default
   */
  const error = (
    summary: string,
    detail: string,
    life: number = ERROR_LIFE
  ) => {
    toast.add({
      severity: "error",
      summary: summary,
      detail: detail,
      life: life,
    });
  };

  /**
   * Menampilkan toast peringatan.
   * @param summary - Judul pesan (mis. "Peringatan")
   * @param detail - Isi pesan (mis. "Harap periksa input Anda.")
   * @param life - Opsional: Ganti durasi default
   */
  const warn = (
    summary: string,
    detail: string,
    life: number = DEFAULT_LIFE
  ) => {
    toast.add({
      severity: "warn",
      summary: summary,
      detail: detail,
      life: life,
    });
  };

  /**
   * Menampilkan toast info.
   * @param summary - Judul pesan (mis. "Informasi")
   * @param detail - Isi pesan (mis. "Ada pembaruan baru.")
   * @param life - Opsional: Ganti durasi default
   */
  const info = (
    summary: string,
    detail: string,
    life: number = DEFAULT_LIFE
  ) => {
    toast.add({
      severity: "info",
      summary: summary,
      detail: detail,
      life: life,
    });
  };

  /**
   * Menampilkan toast kustom jika diperlukan,
   * meskipun sebaiknya gunakan metode semantik di atas.
   */
  const show = (options: ToastMessageOptions) => {
    toast.add(options);
  };

  return { show, success, error, warn, info };
}
