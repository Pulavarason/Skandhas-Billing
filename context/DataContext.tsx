"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode
} from "react";
import { AppData, Bill, BusinessSettings, Product } from "@/lib/types";
import {
  addBillToData,
  addProductToData,
  clearAllData,
  deleteBillFromData,
  deleteProductFromData,
  loadPersistentData,
  parseBackupFile,
  saveData,
  updateProductInData,
  updateBillInData,
  updateSettingsInData
} from "@/lib/storage";
import { formatBillNumber } from "@/lib/format";
import { downloadExcelExport } from "@/lib/excel";

interface DataContextValue {
  data: AppData;
  isReady: boolean;
  nextBillNumberPreview: string;
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  addBill: (bill: Omit<Bill, "id" | "billNumber" | "createdAt">) => Bill;
  deleteBill: (billId: string) => void;
  recordPayment: (billId: string, amount: number) => void;
  updateSettings: (settings: BusinessSettings) => void;
  exportBackup: () => void;
  importBackup: (file: File) => Promise<void>;
  wipeAllData: () => void;
}

const DataContext = createContext<DataContextValue | undefined>(undefined);

const emptyData: AppData = {
  version: 1,
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

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(emptyData);
  const [isReady, setIsReady] = useState(false);
  const dataRef = useRef<AppData>(emptyData);

  useEffect(() => {
    let mounted = true;
    void loadPersistentData().then((loaded) => {
      if (!mounted) return;
      dataRef.current = loaded;
      setData(loaded);
      setIsReady(true);
    });
    return () => { mounted = false; };
  }, []);

  const persist = useCallback((updater: (prev: AppData) => AppData) => {
    // Commit before a mobile route change can unmount the current page.
    const next = updater(dataRef.current);
    saveData(next);
    dataRef.current = next;
    setData(next);
    return next;
  }, []);

  const addProduct = useCallback(
    (product: Product) => persist((prev) => addProductToData(prev, product)),
    [persist]
  );

  const updateProduct = useCallback(
    (product: Product) => persist((prev) => updateProductInData(prev, product)),
    [persist]
  );

  const deleteProduct = useCallback(
    (productId: string) => persist((prev) => deleteProductFromData(prev, productId)),
    [persist]
  );

  const addBill = useCallback(
    (bill: Omit<Bill, "id" | "billNumber" | "createdAt">): Bill => {
      const billNumber = formatBillNumber(dataRef.current.billCounter);
      const fullBill: Bill = {
        ...bill,
        id: `bill_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        billNumber,
        createdAt: new Date().toISOString()
      };
      persist((prev) => addBillToData(prev, fullBill));
      return fullBill;
    },
    [persist]
  );

  const deleteBill = useCallback(
    (billId: string) => persist((prev) => deleteBillFromData(prev, billId)),
    [persist]
  );

  const recordPayment = useCallback(
    (billId: string, amount: number) => {
      if (!Number.isFinite(amount) || amount <= 0) return;
      persist((prev) => {
        const bill = prev.bills.find((entry) => entry.id === billId);
        if (!bill) return prev;
        const alreadyPaid = bill.paidAmount ?? bill.grandTotal;
        const paidAmount = Math.min(bill.grandTotal, alreadyPaid + amount);
        return updateBillInData(prev, { ...bill, paidAmount, dueAmount: Math.max(0, bill.grandTotal - paidAmount) });
      });
    },
    [persist]
  );

  const updateSettings = useCallback(
    (settings: BusinessSettings) =>
      persist((prev) => updateSettingsInData(prev, settings)),
    [persist]
  );

  const exportBackup = useCallback(() => {
    downloadExcelExport(data);
  }, [data]);

  const importBackup = useCallback(async (file: File) => {
    const text = await file.text();
    const parsed = parseBackupFile(text);
    saveData(parsed);
    dataRef.current = parsed;
    setData(parsed);
  }, []);

  const wipeAllData = useCallback(() => {
    const empty = clearAllData();
    dataRef.current = empty;
    setData(empty);
  }, []);

  const nextBillNumberPreview = formatBillNumber(dataRef.current.billCounter);

  return (
    <DataContext.Provider
      value={{
        data,
        isReady,
        nextBillNumberPreview,
        addProduct,
        updateProduct,
        deleteProduct,
        addBill,
        deleteBill,
        recordPayment,
        updateSettings,
        exportBackup,
        importBackup,
        wipeAllData
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData(): DataContextValue {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
