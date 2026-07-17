package com.fuelstation.Service;

import com.fuelstation.DTO.ReportDataDTO;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import org.jfree.chart.ChartFactory;
import org.jfree.chart.JFreeChart;
import org.jfree.chart.plot.PlotOrientation;
import org.jfree.data.category.DefaultCategoryDataset;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.Color;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class PdfGenerationService {

    public File generatePdfReport(ReportDataDTO data, String aiInsights, String filePath) throws IOException, DocumentException {
        File file = new File(filePath);
        file.getParentFile().mkdirs();

        Document document = new Document(PageSize.A4);
        PdfWriter.getInstance(document, new FileOutputStream(file));

        document.open();

        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 20, Color.BLUE);
        Font subtitleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14, Color.DARK_GRAY);
        Font normalFont = FontFactory.getFont(FontFactory.HELVETICA, 12, Color.BLACK);
        Font boldFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, Color.BLACK);

        // Header
        Paragraph header = new Paragraph("SMART FUEL STATION MANAGEMENT SYSTEM", titleFont);
        header.setAlignment(Element.ALIGN_CENTER);
        document.add(header);

        Paragraph projectId = new Paragraph("Project ID: FSJ28-INTERN-041", subtitleFont);
        projectId.setAlignment(Element.ALIGN_CENTER);
        document.add(projectId);

        document.add(new Paragraph(" "));

        Paragraph metaInfo = new Paragraph(
                "Date: " + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")) + "\n" +
                "Time: " + LocalDateTime.now().format(DateTimeFormatter.ofPattern("HH:mm:ss")) + "\n" +
                "Generated Automatically", normalFont
        );
        metaInfo.setAlignment(Element.ALIGN_RIGHT);
        document.add(metaInfo);

        document.add(new Paragraph(" "));
        document.add(new Paragraph("=====================================================", normalFont));

        // Executive Summary
        Paragraph execSummaryTitle = new Paragraph("Executive Summary (" + data.getReportType() + ")", subtitleFont);
        document.add(execSummaryTitle);
        document.add(new Paragraph("Period: " + data.getStartDate() + " to " + data.getEndDate(), normalFont));
        document.add(new Paragraph(" "));

        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(100);
        addTableRow(table, "Total Revenue", "Rs. " + String.format("%.2f", data.getTotalRevenue()), boldFont, normalFont);
        addTableRow(table, "Total Sales", String.valueOf(data.getTotalSales()), boldFont, normalFont);
        addTableRow(table, "Petrol Sold", String.format("%.2f Liters", data.getPetrolSold()), boldFont, normalFont);
        addTableRow(table, "Diesel Sold", String.format("%.2f Liters", data.getDieselSold()), boldFont, normalFont);
        addTableRow(table, "Remaining Petrol Stock", String.format("%.2f Liters", data.getRemainingPetrolStock()), boldFont, normalFont);
        addTableRow(table, "Remaining Diesel Stock", String.format("%.2f Liters", data.getRemainingDieselStock()), boldFont, normalFont);
        addTableRow(table, "Average Sale Value", "Rs. " + String.format("%.2f", data.getAverageSaleValue()), boldFont, normalFont);
        addTableRow(table, "Best Selling Fuel", data.getBestSellingFuel(), boldFont, normalFont);
        addTableRow(table, "Peak Sales Hour", data.getPeakSalesHour(), boldFont, normalFont);
        addTableRow(table, "Number of Bills Generated", String.valueOf(data.getNumberOfBills()), boldFont, normalFont);

        document.add(table);

        document.add(new Paragraph(" "));
        document.add(new Paragraph("=====================================================", normalFont));

        // Charts
        Paragraph chartTitle = new Paragraph("Business Analytics (Revenue Comparison)", subtitleFont);
        document.add(chartTitle);
        document.add(new Paragraph(" "));

        try {
            Image chartImage = createChartImage(data);
            chartImage.setAlignment(Element.ALIGN_CENTER);
            chartImage.scalePercent(70);
            document.add(chartImage);
        } catch (Exception e) {
            document.add(new Paragraph("Chart could not be generated.", normalFont));
        }

        document.add(new Paragraph(" "));
        document.add(new Paragraph("=====================================================", normalFont));

        // AI Insights
        Paragraph aiTitle = new Paragraph("AI Business Insights", subtitleFont);
        document.add(aiTitle);
        document.add(new Paragraph(aiInsights, normalFont));

        document.add(new Paragraph(" "));
        document.add(new Paragraph("=====================================================", normalFont));

        // Footer
        Paragraph footer = new Paragraph("Generated Automatically by Smart Fuel Station Management System", FontFactory.getFont(FontFactory.HELVETICA_OBLIQUE, 10, Color.GRAY));
        footer.setAlignment(Element.ALIGN_CENTER);
        document.add(footer);

        document.close();
        return file;
    }

    private void addTableRow(PdfPTable table, String key, String value, Font boldFont, Font normalFont) {
        PdfPCell cell1 = new PdfPCell(new Phrase(key, boldFont));
        cell1.setPadding(5);
        table.addCell(cell1);

        PdfPCell cell2 = new PdfPCell(new Phrase(value, normalFont));
        cell2.setPadding(5);
        table.addCell(cell2);
    }

    private Image createChartImage(ReportDataDTO data) throws IOException, BadElementException {
        DefaultCategoryDataset dataset = new DefaultCategoryDataset();
        if (data.getRevenueComparison() != null) {
            data.getRevenueComparison().forEach((fuel, rev) -> {
                dataset.addValue(rev, "Revenue", fuel);
            });
        }

        JFreeChart chart = ChartFactory.createBarChart(
                "Revenue by Fuel Type",
                "Fuel Type",
                "Revenue (Rs)",
                dataset,
                PlotOrientation.VERTICAL,
                false, true, false
        );

        BufferedImage bufferedImage = chart.createBufferedImage(500, 300);
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ImageIO.write(bufferedImage, "png", baos);
        return Image.getInstance(baos.toByteArray());
    }
}
