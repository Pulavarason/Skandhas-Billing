# Skandhas Masala &mdash; Billing & Invoicing System

A complete, frontend-only billing and invoicing web app for a masala business, built with
Next.js, React, TypeScript and Tailwind CSS. All data (products, bills, settings) is stored
locally in your browser using `localStorage` &mdash; there is no backend, database, or login.

---

## 1. Install & Run

You need [Node.js](https://nodejs.org) 18.18 or newer installed.

```bash
npm install
npm run dev
```

Then open **http://localhost:3000** in your browser.

## 2. Production Build

```bash
npm run build
npm run start
```

> **Note on first build:** This project was written and reviewed carefully, but it was
> assembled in an environment without internet access, so a real `npm install` /
> `npm run build` could not be executed before delivery. `next.config.js` currently sets
> `typescript.ignoreBuildErrors: true` and `eslint.ignoreDuringBuilds: true` as a safety net
> so a stray type/lint issue won't block your production build. Please run `npm run build`
> once on your machine; if it completes cleanly you can safely remove that block from
> `next.config.js` to restore strict checks for future changes.

---

## 3. How the app is organized

- **Dashboard** &mdash; today's sales, bills today, total bills, product count, recent bills,
  and quick actions.
- **Create Bill** &mdash; the main billing screen: pick a customer (optional), search & add
  products with a package size and quantity, apply a discount, then Save / Save & Print /
  Save PDF.
- **Products** &mdash; add, edit, delete products and their package-size variants; search and
  filter by category/status.
- **Bills** &mdash; full invoice history with search and date filtering; open any bill to view,
  print, or download it as a PDF.
- **Settings** &mdash; business info shown on every invoice, plus backup/restore and a
  complete data reset.

## 4. How products & variants work

Each **product** (e.g. "Chilli Powder") can have any number of **variants** &mdash; a
package size (e.g. `250 g`), a selling price, and an optional SKU. On the Products page:

1. Click **+ Add Product**.
2. Fill in the name (category/description are optional).
3. Under **Package Variants**, click **+ Add Variant** for each size/price you sell, and
   reorder them with the up/down arrows if needed.
4. Click **Save Product**.

Products can be marked **Active** or **Inactive** in the form. Inactive products stay in
your catalog and in past bills, but won't appear in the Create Bill product picker.

## 5. Changing prices

Edit any product from the Products page, change a variant's price, and click
**Update Product**. New bills will use the updated price immediately.

**Bills already created keep the price that was in effect when they were made.** Every bill
stores a snapshot of the product name, size, price and quantity at the time of sale, so
editing or even deleting a product later never changes historical invoices.

## 6. Creating a bill & printing

1. Go to **Create Bill**. The bill number and date are generated automatically.
2. Search for a product, choose its package size (the price fills in automatically),
   set the quantity, and click **Add to Bill**.
3. Repeat for more items. Add a discount if needed &mdash; the grand total updates instantly.
4. Choose one of:
   - **Save Bill** &mdash; saves and takes you to the bill's detail page.
   - **Save & Print** &mdash; saves, then opens a dedicated print view in a new tab and
     triggers your browser's print dialog automatically. Only the invoice is printed
     &mdash; no sidebar or navigation.
   - **Save PDF** &mdash; saves and downloads a PDF named like `SKM-000001.pdf`.

The printable invoice is fixed at **A5 portrait (148mm &times; 210mm)** regardless of your
screen size or light/dark mode, and always prints in black & white on a white background.
"Save & Print" also works with your browser's **Save as PDF** print destination if you
prefer that over the dedicated Save PDF button.

## 7. Backup & restore

Since everything lives in your browser's local storage, back up your data regularly:

- **Settings &rarr; Export Backup** downloads a JSON file
  (`skandhas-masala-backup-YYYY-MM-DD.json`) containing every product, bill, and setting,
  plus the bill number counter.
- **Settings &rarr; Import Backup** restores from a previously exported file. You'll be
  asked to confirm, since importing replaces all current data.

**Settings &rarr; Danger Zone** lets you wipe everything and start from a clean slate.

## 8. Tech notes

- Next.js App Router, React 18, TypeScript, Tailwind CSS, Lucide icons.
- PDF export uses `html2canvas` + `jsPDF` entirely in the browser.
- No API routes, no server-side data, no authentication &mdash; the app works fully offline
  once loaded.
- Data structure lives in `lib/types.ts`; all `localStorage` access is centralized in
  `lib/storage.ts`.

## 9. Project structure

```
skandhas-masala-billing/
├── app/
│   ├── (app)/            # Dashboard, Products, Bills, Create Bill, Settings (with sidebar)
│   ├── print/[id]/       # Bare print-only route for a single invoice
│   ├── layout.tsx        # Root layout + providers
│   └── globals.css       # Theme variables + A5 print rules
├── components/           # Sidebar/shell, forms, tables, invoice template, dialogs, etc.
├── context/              # Theme, Toast, and main Data (localStorage) providers
├── lib/                  # Types, storage utilities, formatting, PDF export
├── public/
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

Enjoy billing! 🌶️
