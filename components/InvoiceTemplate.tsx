// import type { Ref } from "react";
// import { Bill, BusinessSettings } from "@/lib/types";
// import { formatCurrency, formatDateSlash } from "@/lib/format";

// interface InvoiceTemplateProps {
//   bill: Bill;
//   settings: BusinessSettings;
//   innerRef?: Ref<HTMLDivElement>;
// }

// export default function InvoiceTemplate({ bill, settings, innerRef }: InvoiceTemplateProps) {
//   const hasGst = Boolean(settings.gstNumber && settings.gstNumber.trim().length > 0);

//   return (
//     <div
//       ref={innerRef}
//       className="invoice-a5 mx-auto flex flex-col p-6 text-[13px] leading-snug text-black"
//       style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
//     >
//       {/* Header */}
//       <div className="text-center">
//         <h1 className="text-xl font-bold uppercase tracking-wide">
//           {settings.businessName || "SKANDHAS MASALA"}
//         </h1>
//         <p className="mt-0.5 text-[11px]">{settings.tagline}</p>
//         <p className="mt-1.5 whitespace-pre-line text-[11px]">{settings.address}</p>
//         <p className="text-[11px]">
//           {settings.phone}
//           {settings.email ? ` \u00B7 ${settings.email}` : ""}
//         </p>
//         {hasGst && <p className="text-[11px]">GSTIN: {settings.gstNumber}</p>}
//       </div>

//       <div className="my-3 border-t-2 border-black" />

//       {/* Bill meta */}
//       <div className="flex items-start justify-between text-[12px]">
//         <div>
//           <p>
//             <span className="font-semibold">Bill No:</span> {bill.billNumber}
//           </p>
//           <p>
//             <span className="font-semibold">Date:</span> {formatDateSlash(bill.date)}
//             {bill.time ? `  ${bill.time}` : ""}
//           </p>
//         </div>
//         {(bill.customerName || bill.customerPhone) && (
//           <div className="text-right">
//             <p className="font-semibold">Customer</p>
//             {bill.customerName && <p>{bill.customerName}</p>}
//             {bill.customerPhone && <p>{bill.customerPhone}</p>}
//           </div>
//         )}
//       </div>

//       <div className="my-3 border-t border-dashed border-black" />

//       {/* Items table */}
//       <table className="w-full border-collapse text-[12px]">
//         <thead>
//           <tr className="border-b-2 border-black text-left">
//             <th className="py-1 font-semibold">Item</th>
//             <th className="py-1 font-semibold">Size</th>
//             <th className="py-1 text-right font-semibold">Qty</th>
//             <th className="py-1 text-right font-semibold">Rate</th>
//             <th className="py-1 text-right font-semibold">Amount</th>
//           </tr>
//         </thead>
//         <tbody>
//           {bill.items.map((item, idx) => (
//             <tr key={`${item.variantId}-${idx}`} className="border-b border-dotted border-black/40">
//               <td className="py-1 pr-1">{item.productName}</td>
//               <td className="py-1 pr-1">{item.variantSize}</td>
//               <td className="py-1 text-right">{item.quantity}</td>
//               <td className="py-1 text-right">{formatCurrency(item.price)}</td>
//               <td className="py-1 text-right">{formatCurrency(item.amount)}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       <div className="my-2 border-t border-black" />

//       {/* Totals */}
//       <div className="ml-auto w-full max-w-[60%] space-y-1 text-[12px]">
//         <div className="flex justify-between">
//           <span>Subtotal</span>
//           <span>{formatCurrency(bill.subtotal)}</span>
//         </div>
//         {bill.discount > 0 && (
//           <div className="flex justify-between">
//             <span>Discount</span>
//             <span>- {formatCurrency(bill.discount)}</span>
//           </div>
//         )}
//         <div className="flex justify-between border-t-2 border-black pt-1 text-[14px] font-bold">
//           <span>TOTAL</span>
//           <span>{formatCurrency(bill.grandTotal)}</span>
//         </div>
//       </div>

//       <div className="mt-auto pt-6 text-center">
//         <div className="mb-2 border-t border-dashed border-black" />
//         <p className="text-[12px] font-medium">{settings.invoiceFooter}</p>
//         <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide">
//           {settings.businessName || "SKANDHAS MASALA"}
//         </p>
//       </div>
//     </div>
//   );
// }

import type { Ref } from "react";
import { Bill, BusinessSettings } from "@/lib/types";
import { formatCurrency, formatDateSlash } from "@/lib/format";

interface InvoiceTemplateProps {
  bill: Bill;
  settings: BusinessSettings;
  innerRef?: Ref<HTMLDivElement>;
}

export default function InvoiceTemplate({
  bill,
  settings,
  innerRef,
}: InvoiceTemplateProps) {
  const hasGst = Boolean(
    settings.gstNumber && settings.gstNumber.trim().length > 0
  );

  return (
    <div
      ref={innerRef}
      className="invoice-a5 mx-auto box-border flex min-h-full w-full flex-col bg-white px-[12mm] py-[10mm] text-black"
      style={{
        fontFamily: "Arial, Helvetica, sans-serif",
        fontSize: "12px",
        lineHeight: "1.35",
      }}
    >
      {/* =====================================================
          HEADER
      ====================================================== */}
      <header className="w-full text-center">
        <h1 className="m-0 text-[24px] font-extrabold uppercase leading-tight tracking-[0.04em]">
          {settings.businessName || "SKANDHAS MASALA"}
        </h1>

        {settings.tagline && (
          <p className="mt-1 text-[11px] font-medium">
            {settings.tagline}
          </p>
        )}

        {settings.address && (
          <p className="mx-auto mt-2 max-w-[120mm] whitespace-pre-line text-[10.5px] leading-snug">
            {settings.address}
          </p>
        )}

        <div className="mt-1 flex justify-center gap-2 text-[10.5px]">
          {settings.phone && <span>{settings.phone}</span>}

          {settings.email && (
            <>
              <span>•</span>
              <span>{settings.email}</span>
            </>
          )}
        </div>

        {hasGst && (
          <p className="mt-1 text-[10.5px] font-semibold">
            GSTIN: {settings.gstNumber}
          </p>
        )}
      </header>

      {/* Header divider */}
      <div className="my-4 border-t-[1.5px] border-black" />

      {/* =====================================================
          BILL INFORMATION
      ====================================================== */}
      <section className="grid grid-cols-2 gap-4 text-[11px]">
        <div>
          <div className="flex">
            <span className="w-[22mm] font-bold">Bill No:</span>
            <span>{bill.billNumber}</span>
          </div>

          <div className="mt-1 flex">
            <span className="w-[22mm] font-bold">Date:</span>
            <span>
              {formatDateSlash(bill.date)}
              {bill.time ? `  ${bill.time}` : ""}
            </span>
          </div>
        </div>

        {(bill.customerName || bill.customerPhone) && (
          <div className="text-right">
            <p className="font-bold">CUSTOMER</p>

            {bill.customerName && (
              <p className="mt-0.5">{bill.customerName}</p>
            )}

            {bill.customerPhone && (
              <p className="mt-0.5">{bill.customerPhone}</p>
            )}
          </div>
        )}
      </section>

      {/* Divider */}
      <div className="my-3 border-t border-dashed border-black" />

      {/* =====================================================
          ITEMS TABLE
      ====================================================== */}
      <section className="w-full">
        <table className="w-full border-collapse text-[10.5px]">
          <thead>
            <tr className="border-b-[1.5px] border-black">
              <th className="w-[36%] py-1.5 text-left font-bold">
                ITEM
              </th>

              <th className="w-[16%] py-1.5 text-left font-bold">
                SIZE
              </th>

              <th className="w-[10%] py-1.5 text-right font-bold">
                QTY
              </th>

              <th className="w-[18%] py-1.5 text-right font-bold">
                RATE
              </th>

              <th className="w-[20%] py-1.5 text-right font-bold">
                AMOUNT
              </th>
            </tr>
          </thead>

          <tbody>
            {bill.items.map((item, idx) => (
              <tr
                key={`${item.variantId}-${idx}`}
                className="border-b border-dotted border-black/40"
              >
                <td className="py-1.5 pr-2 font-medium">
                  {item.productName}
                </td>

                <td className="py-1.5 pr-1">
                  {item.variantSize}
                </td>

                <td className="py-1.5 text-right">
                  {item.quantity}
                </td>

                <td className="py-1.5 text-right">
                  {formatCurrency(item.price)}
                </td>

                <td className="py-1.5 text-right font-medium">
                  {formatCurrency(item.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* =====================================================
          TOTALS
      ====================================================== */}
      <section className="mt-3 border-t border-black pt-2">
        <div className="ml-auto w-[62%] text-[11px]">
          <div className="flex justify-between py-0.5">
            <span>Subtotal</span>
            <span>{formatCurrency(bill.subtotal)}</span>
          </div>

          {bill.discount > 0 && (
            <div className="flex justify-between py-0.5">
              <span>Discount</span>
              <span>- {formatCurrency(bill.discount)}</span>
            </div>
          )}

          {bill.deliveryCharge > 0 && (
            <div className="flex justify-between py-0.5">
              <span>Delivery charge</span>
              <span>{formatCurrency(bill.deliveryCharge)}</span>
            </div>
          )}

          <div className="mt-1 flex items-center justify-between border-t-[1.5px] border-black pt-2 text-[15px] font-extrabold">
            <span>TOTAL</span>
            <span>{formatCurrency(bill.grandTotal)}</span>
          </div>
          {(bill.dueAmount ?? 0) > 0 && (
            <div className="mt-1 flex justify-between border-t border-black pt-1 font-bold">
              <span>DUE</span>
              <span>{formatCurrency(bill.dueAmount ?? 0)}</span>
            </div>
          )}
        </div>
      </section>

      {/* =====================================================
          FOOTER
      ====================================================== */}
      <footer className="mt-auto pt-8 text-center">
        <div className="mb-3 border-t border-dashed border-black" />

        {settings.invoiceFooter && (
          <p className="text-[10.5px] font-medium">
            {settings.invoiceFooter}
          </p>
        )}

        <p className="mt-1.5 text-[10px] font-bold uppercase tracking-[0.08em]">
          {settings.businessName || "SKANDHAS MASALA"}
        </p>
      </footer>
    </div>
  );
}
