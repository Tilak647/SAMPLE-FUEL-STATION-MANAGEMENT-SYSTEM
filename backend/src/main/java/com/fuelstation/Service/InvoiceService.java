package com.fuelstation.Service;

import com.fuelstation.Entity.Sale;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.time.format.DateTimeFormatter;

@Service
public class InvoiceService {

    @Value("${app.report.storage.path:reports/}")
    private String storagePath;

    public File generateInvoicePdf(Sale sale) throws IOException, DocumentException {
        File directory = new File(storagePath + "invoices/");
        if (!directory.exists()) {
            directory.mkdirs();
        }

        String filePath = directory.getAbsolutePath() + "/" + sale.getBillNo() + ".pdf";
        File file = new File(filePath);

        Document document = new Document(PageSize.A5);
        PdfWriter.getInstance(document, new FileOutputStream(file));

        document.open();

        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
        Font boldFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10);
        Font normalFont = FontFactory.getFont(FontFactory.HELVETICA, 10);

        Paragraph header = new Paragraph("SMART FUEL STATION", titleFont);
        header.setAlignment(Element.ALIGN_CENTER);
        document.add(header);

        Paragraph subHeader = new Paragraph("TAX INVOICE\n\n", boldFont);
        subHeader.setAlignment(Element.ALIGN_CENTER);
        document.add(subHeader);

        document.add(new Paragraph("Bill No: " + sale.getBillNo(), normalFont));
        document.add(new Paragraph("Date: " + sale.getSaleDate().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")), normalFont));
        if (sale.getCustomerName() != null && !sale.getCustomerName().isEmpty()) {
            document.add(new Paragraph("Customer: " + sale.getCustomerName(), normalFont));
        }
        document.add(new Paragraph("\n"));

        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(100);

        table.addCell(new PdfPCell(new Phrase("Fuel Type", boldFont)));
        table.addCell(new PdfPCell(new Phrase(sale.getFuelType(), normalFont)));

        table.addCell(new PdfPCell(new Phrase("Liters Sold", boldFont)));
        table.addCell(new PdfPCell(new Phrase(String.format("%.2f L", sale.getLiters()), normalFont)));

        table.addCell(new PdfPCell(new Phrase("Subtotal", boldFont)));
        table.addCell(new PdfPCell(new Phrase(String.format("Rs. %.2f", sale.getAmount() - sale.getTaxAmount()), normalFont)));

        table.addCell(new PdfPCell(new Phrase("GST", boldFont)));
        table.addCell(new PdfPCell(new Phrase(String.format("Rs. %.2f", sale.getTaxAmount()), normalFont)));

        table.addCell(new PdfPCell(new Phrase("Total Amount", boldFont)));
        table.addCell(new PdfPCell(new Phrase(String.format("Rs. %.2f", sale.getAmount()), boldFont)));

        document.add(table);

        document.add(new Paragraph("\nThank you for choosing Smart Fuel Station!", normalFont));
        document.add(new Paragraph("Generated automatically by FSJ28-INTERN-041", FontFactory.getFont(FontFactory.HELVETICA_OBLIQUE, 8)));

        document.close();
        return file;
    }
}
