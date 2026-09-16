import { AppData, BackupFile, Bill, BusinessSettings, Product } from "./types";
import { formatBillNumber } from "./format";

// v2 intentionally starts with no catalog or invoices. Changing the key keeps
// data from earlier versions out of the new empty workspace.
const STORAGE_KEY = "skandhas-masala-data-v2";
const LEGACY_STORAGE_KEY = "skandhas-masala-data-v1";
const APP_VERSION = 2;

export class StorageError extends Error {}

function createEmptyData(): AppData {
  return {
    version: APP_VERSION,
    products: [],
    bills: [],
    billCounter: 1,
    settings: {
      businessName: "",
      tagline: "",
      address: "",
      phone: "",
      email: "",
      gstNumber: "",
      invoiceFooter: ""
    }
  };
}

/** Basic structural validation for data loaded from localStorage or an import file. */
function isValidAppData(data: unknown): data is AppData {
  if (!data || typeof data !== "object") return false;
  const d = data as Partial<AppData>;
  if (!Array.isArray(d.products) || !Array.isArray(d.bills)) return false;
  if (!d.settings || typeof d.settings !== "object") return false;
  if (typeof d.billCounter !== "number") return false;
  return true;
}

/** Add payment fields introduced after the first release without changing old bills. */
function normalizeData(data: AppData): AppData {
  return {
    ...data,
    version: APP_VERSION,
    bills: data.bills.map((bill) => {
      const deliveryCharge = Number.isFinite(bill.deliveryCharge) ? Math.max(0, bill.deliveryCharge) : 0;
      const grandTotal = Number.isFinite(bill.grandTotal) ? bill.grandTotal : 0;
      // Bills created before dues existed were already completed invoices.
      const paidAmount = Number.isFinite(bill.paidAmount) ? Math.min(Math.max(bill.paidAmount!, 0), grandTotal) : grandTotal;
      return { ...bill, deliveryCharge, paidAmount, dueAmount: Math.max(0, grandTotal - paidAmount) };
    })
  };
}

function isLocalStorageAvailable(): boolean {
  try {
    if (typeof window === "undefined") return false;
    const testKey = "__skm_test__";
    window.localStorage.setItem(testKey, "1");
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

export function loadData(): AppData {
  if (!isLocalStorageAvailable()) {
    // No persistent storage available (private browsing, disabled storage, etc.)
    // Fall back to a fresh in-memory empty dataset so the app still works.
    return createEmptyData();
  }

  try {
    // The v1 key contained the shipped placeholder records; remove it once so
    // they do not remain in the browser's local storage.
    window.localStorage.removeItem(LEGACY_STORAGE_KEY);
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = createEmptyData();
      persist(initial);
      return initial;
    }
    const parsed = JSON.parse(raw);
    if (!isValidAppData(parsed)) {
      throw new StorageError("Corrupted data shape");
    }
    return normalizeData(parsed);
  } catch (err) {
    // Corrupted / invalid JSON — recover gracefully instead of crashing the app.
    const initial = createEmptyData();
    try {
      persist(initial);
    } catch {
      /* ignore secondary failure */
    }
    return initial;
  }
}

function persist(data: AppData): void {
  if (!isLocalStorageAvailable()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    throw new StorageError(
      "Could not save data to your browser's storage. It may be full or disabled."
    );
  }
}

export function saveData(data: AppData): void {
  persist(data);
}

export function nextBillNumber(data: AppData): string {
  return formatBillNumber(data.billCounter);
}

export function addProductToData(data: AppData, product: Product): AppData {
  return { ...data, products: [product, ...data.products] };
}

export function updateProductInData(data: AppData, product: Product): AppData {
  return {
    ...data,
    products: data.products.map((p) => (p.id === product.id ? product : p))
  };
}

export function deleteProductFromData(data: AppData, productId: string): AppData {
  return {
    ...data,
    products: data.products.filter((p) => p.id !== productId)
  };
}

export function addBillToData(data: AppData, bill: Bill): AppData {
  return {
    ...data,
    bills: [bill, ...data.bills],
    billCounter: data.billCounter + 1
  };
}

export function deleteBillFromData(data: AppData, billId: string): AppData {
  return { ...data, bills: data.bills.filter((b) => b.id !== billId) };
}

export function updateBillInData(data: AppData, bill: Bill): AppData {
  return { ...data, bills: data.bills.map((existing) => (existing.id === bill.id ? bill : existing)) };
}

export function updateSettingsInData(
  data: AppData,
  settings: BusinessSettings
): AppData {
  return { ...data, settings };
}

export function buildBackup(data: AppData): BackupFile {
  return {
    exportedAt: new Date().toISOString(),
    appVersion: APP_VERSION,
    data
  };
}

export function parseBackupFile(raw: string): AppData {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new StorageError("This file is not valid JSON.");
  }
  const backup = parsed as Partial<BackupFile>;
  const candidate = backup && typeof backup === "object" && "data" in backup
    ? (backup as BackupFile).data
    : (parsed as AppData);

  if (!isValidAppData(candidate)) {
    throw new StorageError(
      "This backup file doesn't match the expected format."
    );
  }
  return normalizeData(candidate);
}

export function clearAllData(): AppData {
  const empty = createEmptyData();
  persist(empty);
  return empty;
}
