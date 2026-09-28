/* Creates the illustrated customer guide from the locally captured app screens. */
const fs = require("fs");
const path = require("path");
const { jsPDF } = require("jspdf");

const root = path.resolve(__dirname, "..");
const images = path.join(root, "docs", "user-guide-assets");
const output = path.join(root, "docs", "Skandhas-Masala-Billing-User-Guide.pdf");
const doc = new jsPDF({ unit: "mm", format: "a4", compress: true });
const W = 210;
const H = 297;
const M = 15;
let page = 1;

function color(value) { doc.setTextColor(...value); }
function line(y) { doc.setDrawColor(226, 232, 240); doc.line(M, y, W - M, y); }
function footer() {
  doc.setFont("helvetica", "normal"); doc.setFontSize(8); color([100, 116, 139]);
  doc.text("Skandhas Masala Billing System  |  User Guide", M, H - 10);
  doc.text(String(page), W - M, H - 10, { align: "right" });
}
function nextPage(title, kicker) {
  if (page > 1) doc.addPage();
  page += page === 1 ? 0 : 1;
  doc.setFillColor(180, 83, 9); doc.rect(0, 0, W, 7, "F");
  doc.setFont("helvetica", "bold"); doc.setFontSize(8); color([180, 83, 9]);
  doc.text(kicker.toUpperCase(), M, 19);
  doc.setFontSize(21); color([30, 41, 59]); doc.text(title, M, 29);
  line(35);
}
function wrap(text, x, y, width, size = 10, leading = 4.6, style = "normal") {
  doc.setFont("helvetica", style); doc.setFontSize(size); color([51, 65, 85]);
  const lines = doc.splitTextToSize(text, width);
  doc.text(lines, x, y, { lineHeightFactor: leading / size });
  return y + lines.length * leading;
}
function bullets(items, y) {
  items.forEach((item) => {
    doc.setFillColor(180, 83, 9); doc.circle(M + 1.5, y - 1.1, 1.2, "F");
    y = wrap(item, M + 6, y, W - (M * 2) - 6, 9.4, 4.4) + 2.2;
  });
  return y;
}
function image(file, y, maxH = 120) {
  const source = fs.readFileSync(path.join(images, file)).toString("base64");
  const data = `data:image/png;base64,${source}`;
  const iw = 1440, ih = 1100, maxW = W - M * 2;
  let w = maxW, h = w * ih / iw;
  if (h > maxH) { h = maxH; w = h * iw / ih; }
  const x = (W - w) / 2;
  doc.setDrawColor(203, 213, 225); doc.roundedRect(x - 1, y - 1, w + 2, h + 2, 2, 2, "S");
  doc.addImage(data, "PNG", x, y, w, h, undefined, "FAST");
  return y + h;
}
function caption(text, y) {
  doc.setFont("helvetica", "italic"); doc.setFontSize(8); color([100, 116, 139]);
  doc.text(text, W / 2, y, { align: "center" });
}
function screenPage(title, file, intro, points) {
  nextPage(title, "Feature guide");
  let y = wrap(intro, M, 43, W - M * 2, 10.2, 4.8) + 4;
  y = image(file, y, 112) + 6;
  y = bullets(points, y);
  footer();
}

// Cover
doc.setFillColor(120, 53, 15); doc.rect(0, 0, W, H, "F");
doc.setFillColor(180, 83, 9); doc.circle(188, 38, 46, "F");
doc.setFillColor(251, 191, 36); doc.circle(169, 268, 58, "F");
doc.setFont("helvetica", "bold"); doc.setFontSize(11); color([253, 230, 138]);
doc.text("SKANDHAS MASALA", M, 44);
doc.setFontSize(30); color([255, 255, 255]); doc.text("Billing System", M, 66);
doc.setFontSize(17); color([254, 243, 199]); doc.text("Illustrated User Guide", M, 79);
doc.setFont("helvetica", "normal"); doc.setFontSize(11); color([255, 237, 213]);
doc.text(["A practical guide to product management, billing,", "due collection, invoices, reports and data safety."], M, 102, { lineHeightFactor: 1.6 });
doc.setFillColor(255, 255, 255); doc.roundedRect(M, 136, 118, 46, 4, 4, "F");
doc.setFont("helvetica", "bold"); doc.setFontSize(12); color([120, 53, 15]); doc.text("Built for everyday billing", M + 10, 151);
doc.setFont("helvetica", "normal"); doc.setFontSize(10); color([71, 85, 105]);
doc.text(["Fast local billing • Product variants • PDF invoices", "Due tracking • Excel export • Works offline after loading"], M + 10, 163, { lineHeightFactor: 1.55 });
doc.setFontSize(9); color([255, 237, 213]); doc.text("Version 1.0  |  Customer documentation", M, H - 20);

// Start here
page = 1;
nextPage("Start here", "Getting started");
let y = wrap("This application keeps your business data in the current browser, so it is quick to use and does not require a login. Set it up once, then use the left menu to move between all sections.", M, 43, 180, 10.2, 4.8) + 4;
doc.setFillColor(255, 247, 237); doc.roundedRect(M, y, 180, 30, 3, 3, "F");
doc.setFont("helvetica", "bold"); doc.setFontSize(10); color([154, 52, 18]); doc.text("Recommended first-time setup", M + 6, y + 8);
y = bullets(["Open Settings and enter your business name, address, contact details, GST number (if applicable), and invoice footer.", "Open Products and add each item you sell with one or more package sizes and prices.", "Use Create Bill for a paid sale. Use Create Due Bill when the customer will pay later."], y + 15) + 4;
doc.setFont("helvetica", "bold"); doc.setFontSize(11); color([30, 41, 59]); doc.text("Navigation at a glance", M, y);
y += 7;
y = bullets(["Dashboard: sales snapshot and recent bills.", "Products: your sellable catalogue and package variants.", "Bills and Dues: history, invoices and payment collection.", "The moon/sun button switches between light and dark mode. On mobile, open the menu button to reveal navigation."], y);
footer();

screenPage("Dashboard", "dashboard.png", "The Dashboard is your sales snapshot. It is the first screen to check at the start or end of the day.", [
  "Today’s Sales, This Month and This Year show totals calculated from saved bills.",
  "Total Bills shows all invoices created, with the number raised today underneath.",
  "Daily Sales shows the last seven calendar days; a zero value simply means no saved bills for that day.",
  "Recent Bills provides a quick reference to your latest invoices."
]);

screenPage("Products", "products.png", "Products are the foundation of billing. Only active products with at least one package variant are available during bill creation.", [
  "Select Add Product to create a product. Enter its name; category and description are optional.",
  "Add every selling pack under Package Variants: enter its size (for example, 100 g or 1 kg), price and optional SKU. Add more variants for other sizes.",
  "Set Status to Active to make it available for new bills; use Inactive to keep it in the catalogue without offering it for sale.",
  "Search, category and status filters help locate products. Edit updates future bills only; invoices already saved retain their original price and item details.",
  "Delete removes the product from the catalogue only—it does not change historical bills."
]);

screenPage("Create a paid bill", "create-bill.png", "Use Create Bill for a sale that is fully paid now. Customer name and phone are optional for a walk-in customer.", [
  "Bill number and date are generated automatically. Enter customer details when you want them printed on the invoice.",
  "Search and select a product, then choose its package size. The saved price fills in automatically; adjust quantity with the minus/plus controls or number field.",
  "Select Add to Bill for each line item. The item table shows product, size, quantity, rate and amount; use the bin icon to remove a line.",
  "Discount cannot exceed the subtotal. Delivery charge is added to the subtotal after discount; the total updates immediately.",
  "Clear resets the draft. Save Bill stores the sale. Save & Print stores it and opens a printer-friendly invoice. Save PDF stores it and downloads a PDF copy."
]);

screenPage("Create a due bill", "due-bill.png", "Use Create Due Bill only when the customer will pay later. This creates an invoice whose entire amount is initially outstanding.", [
  "Customer name and phone number are required for a due bill, making follow-up simple.",
  "Add products, package sizes, quantities, discounts and delivery charge exactly as you do for a paid bill.",
  "The final amount is labelled Total due and will appear automatically in the Dues section after saving.",
  "Save Due Bill records the debt; Save & Print and Save PDF also create the same printable invoice output."
]);

screenPage("Bills and invoice records", "bills.png", "Bills is the permanent sales history. It includes both fully paid and outstanding invoices.", [
  "Use the search box to find an invoice by bill number or customer name. Date filters limit the view to a period.",
  "Each row shows bill number, date, customer, total amount and remaining due. Select the eye icon or row to open the invoice detail.",
  "From a bill detail screen, use Print for a clean A5 invoice print view or Save PDF for a downloaded invoice.",
  "Use the delete option only when required: it permanently removes that bill from the local history."
]);

screenPage("Dues and collections", "dues.png", "Dues lists every bill that still has an unpaid balance, so follow-up is managed in one place.", [
  "The top card reports the total outstanding amount and number of unpaid bills.",
  "Every due entry shows the bill number, customer contact, invoice value, amount already paid and amount still due.",
  "Enter the amount received in the Receive ₹ box and select Collect. You can collect a partial payment or the entire balance; the app caps a payment at the amount due.",
  "When a balance reaches zero, it disappears from Dues but remains safely in the Bills history."
]);

screenPage("Settings and data safety", "settings.png", "Settings controls the identity printed on invoices and protects your locally stored business data.", [
  "Business Name, Tagline, Address, Phone, Email, GST Number and Invoice Footer are printed on future invoices. Select Save Settings after changes.",
  "Export Excel downloads your product and bill data for records, sharing or analysis. Export regularly, especially before clearing browser data or moving computers.",
  "Import JSON Backup restores a previously exported compatible backup and replaces the current local data. Confirm carefully before importing.",
  "Clear All Data permanently removes products, bills and settings from this browser. Export first if there is any chance you will need the information later."
]);

nextPage("Daily workflow and helpful notes", "Best practices");
y = 43;
doc.setFont("helvetica", "bold"); doc.setFontSize(12); color([30, 41, 59]); doc.text("A simple everyday routine", M, y); y += 8;
y = bullets(["Add or update products and prices before you start billing. Keep product status Active only for items currently available.", "For every paid sale, create a bill, check the total, then choose Save Bill, Save & Print or Save PDF based on what the customer needs.", "For credit sales, always use Create Due Bill and record the customer’s name and phone number. Collect payments promptly from Dues.", "At the end of the day, review Dashboard and export your data regularly from Settings."], y) + 5;
doc.setFillColor(239, 246, 255); doc.roundedRect(M, y, 180, 40, 3, 3, "F");
doc.setFont("helvetica", "bold"); doc.setFontSize(11); color([30, 64, 175]); doc.text("Important data note", M + 6, y + 9);
wrap("This is a frontend-only application: products, bills and settings are held in the browser’s local storage, not on an online server. Do not clear browser site data without exporting first. Backups are especially important when changing browsers, computers or user profiles.", M + 6, y + 17, 168, 9.3, 4.5);
y += 51;
doc.setFont("helvetica", "bold"); doc.setFontSize(12); color([30, 41, 59]); doc.text("Invoice output", M, y); y += 8;
y = bullets(["Invoices are formatted for A5 portrait printing and print in black and white on a white page.", "Save & Print opens the browser print dialog. You may choose a physical printer or the browser’s Save as PDF destination.", "Save PDF creates a direct downloadable invoice file using the bill number as its name."], y);
footer();

fs.mkdirSync(path.dirname(output), { recursive: true });
doc.save(output);
console.log(output);
