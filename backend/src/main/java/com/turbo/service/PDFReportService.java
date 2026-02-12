package com.turbo.service;

import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import com.turbo.dto.WindDataResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
@Slf4j
public class PDFReportService {

        private static final DeviceRgb BRAND_COLOR = new DeviceRgb(0, 150, 136); // Teal
        private static final DeviceRgb HEADER_BG = new DeviceRgb(245, 245, 245);

        /**
         * Generate comprehensive PDF feasibility report
         */
        public byte[] generateFeasibilityReport(WindDataResponse windData) {
                log.info("Generating PDF report for location: {}", windData.getLocationName());

                try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
                        PdfWriter writer = new PdfWriter(baos);
                        PdfDocument pdf = new PdfDocument(writer);
                        Document document = new Document(pdf);

                        // Add title
                        addTitle(document, windData.getLocationName());

                        // Add executive summary
                        addExecutiveSummary(document, windData);

                        // Add location details
                        addLocationDetails(document, windData);

                        // Add wind analysis
                        addWindAnalysis(document, windData);

                        // Add profitability assessment
                        addProfitabilityAssessment(document, windData);

                        // Add energy yield projections
                        addEnergyYieldProjections(document, windData);

                        // Add investment recommendation
                        addInvestmentRecommendation(document, windData);

                        // Add footer
                        addFooter(document);

                        document.close();
                        return baos.toByteArray();

                } catch (Exception e) {
                        log.error("Error generating PDF report: {}", e.getMessage(), e);
                        throw new RuntimeException("Failed to generate PDF report: " + e.getMessage());
                }
        }

        private void addTitle(Document document, String locationName) {
                Paragraph title = new Paragraph("Turbo Wind Energy Feasibility Report")
                                .setFontSize(24)
                                .setBold()
                                .setFontColor(BRAND_COLOR)
                                .setTextAlignment(TextAlignment.CENTER)
                                .setMarginBottom(10);
                document.add(title);

                Paragraph subtitle = new Paragraph("Site Assessment: " + locationName)
                                .setFontSize(16)
                                .setTextAlignment(TextAlignment.CENTER)
                                .setMarginBottom(20);
                document.add(subtitle);

                Paragraph date = new Paragraph("Report Generated: " +
                                LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd MMM yyyy, HH:mm")))
                                .setFontSize(10)
                                .setTextAlignment(TextAlignment.CENTER)
                                .setMarginBottom(30);
                document.add(date);
        }

        private void addExecutiveSummary(Document document, WindDataResponse windData) {
                Paragraph header = new Paragraph("Executive Summary")
                                .setFontSize(18)
                                .setBold()
                                .setFontColor(BRAND_COLOR)
                                .setMarginBottom(10);
                document.add(header);

                Table table = new Table(UnitValue.createPercentArray(new float[] { 1, 2 }))
                                .useAllAvailableWidth()
                                .setMarginBottom(20);

                addTableRow(table, "Profitability Grade", windData.getGrade(), true);
                addTableRow(table, "Overall Score", String.format("%.1f/100", windData.getScore()), false);
                addTableRow(table, "Financial Viability", windData.getFinancialViability(), true);
                addTableRow(table, "Average Wind Speed", String.format("%.2f m/s", windData.getWindSpeed()), false);

                document.add(table);
        }

        private void addLocationDetails(Document document, WindDataResponse windData) {
                Paragraph header = new Paragraph("Location Details")
                                .setFontSize(18)
                                .setBold()
                                .setFontColor(BRAND_COLOR)
                                .setMarginBottom(10);
                document.add(header);

                Table table = new Table(UnitValue.createPercentArray(new float[] { 1, 2 }))
                                .useAllAvailableWidth()
                                .setMarginBottom(20);

                addTableRow(table, "Location Name", windData.getLocationName(), true);
                addTableRow(table, "GPS Coordinates",
                                String.format("%.4f°N, %.4f°E", windData.getLatitude(), windData.getLongitude()),
                                false);
                addTableRow(table, "Assessment Date", windData.getTimestamp(), true);

                document.add(table);
        }

        private void addWindAnalysis(Document document, WindDataResponse windData) {
                Paragraph header = new Paragraph("Wind Resource Analysis")
                                .setFontSize(18)
                                .setBold()
                                .setFontColor(BRAND_COLOR)
                                .setMarginBottom(10);
                document.add(header);

                Table table = new Table(UnitValue.createPercentArray(new float[] { 1, 2 }))
                                .useAllAvailableWidth()
                                .setMarginBottom(20);

                addTableRow(table, "Wind Speed", String.format("%.2f m/s", windData.getWindSpeed()), true);
                addTableRow(table, "Wind Direction", String.format("%.0f°", windData.getWindDirection()), false);
                addTableRow(table, "Temperature", String.format("%.1f°C", windData.getTemperature()), true);
                addTableRow(table, "Atmospheric Pressure", String.format("%.0f hPa", windData.getPressure()), false);
                addTableRow(table, "Humidity", String.format("%.0f%%", windData.getHumidity()), true);

                document.add(table);
        }

        private void addProfitabilityAssessment(Document document, WindDataResponse windData) {
                Paragraph header = new Paragraph("Profitability Assessment")
                                .setFontSize(18)
                                .setBold()
                                .setFontColor(BRAND_COLOR)
                                .setMarginBottom(10);
                document.add(header);

                Table table = new Table(UnitValue.createPercentArray(new float[] { 1, 2 }))
                                .useAllAvailableWidth()
                                .setMarginBottom(20);

                addTableRow(table, "Profitability Grade", windData.getGrade(), true);
                addTableRow(table, "Profitability Score", String.format("%.2f/100", windData.getScore()), false);
                addTableRow(table, "Capacity Factor", String.format("%.2f%%", windData.getCapacityFactor()), true);
                addTableRow(table, "Financial Viability", windData.getFinancialViability(), false);

                document.add(table);
        }

        private void addEnergyYieldProjections(Document document, WindDataResponse windData) {
                Paragraph header = new Paragraph("Energy Yield Projections")
                                .setFontSize(18)
                                .setBold()
                                .setFontColor(BRAND_COLOR)
                                .setMarginBottom(10);
                document.add(header);

                Table table = new Table(UnitValue.createPercentArray(new float[] { 1, 2 }))
                                .useAllAvailableWidth()
                                .setMarginBottom(20);

                double annualYield = windData.getEstimatedEnergyYield();
                addTableRow(table, "Annual Energy Yield",
                                String.format("%.0f kWh/year", annualYield), true);
                addTableRow(table, "Daily Average",
                                String.format("%.0f kWh/day", annualYield / 365), false);
                addTableRow(table, "Monthly Average",
                                String.format("%.0f kWh/month", annualYield / 12), true);
                addTableRow(table, "Turbine Configuration", "2 MW Rated Power", false);

                document.add(table);
        }

        private void addInvestmentRecommendation(Document document, WindDataResponse windData) {
                Paragraph header = new Paragraph("Investment Recommendation")
                                .setFontSize(18)
                                .setBold()
                                .setFontColor(BRAND_COLOR)
                                .setMarginBottom(10);
                document.add(header);

                Paragraph recommendation = new Paragraph(windData.getRecommendation())
                                .setFontSize(12)
                                .setTextAlignment(TextAlignment.JUSTIFIED)
                                .setMarginBottom(20);
                document.add(recommendation);
        }

        private void addFooter(Document document) {
                Paragraph footer = new Paragraph("This report is generated by Turbo Wind Intelligence Portal. " +
                                "Data is sourced from OpenWeatherMap API and analyzed using proprietary algorithms. " +
                                "For detailed site assessment, please consult with wind energy experts.")
                                .setFontSize(8)
                                .setTextAlignment(TextAlignment.CENTER)
                                .setFontColor(ColorConstants.GRAY)
                                .setMarginTop(30);
                document.add(footer);
        }

        private void addTableRow(Table table, String label, String value, boolean shaded) {
                Cell labelCell = new Cell()
                                .add(new Paragraph(label).setBold())
                                .setBackgroundColor(shaded ? HEADER_BG : ColorConstants.WHITE)
                                .setPadding(8);

                Cell valueCell = new Cell()
                                .add(new Paragraph(value))
                                .setBackgroundColor(shaded ? HEADER_BG : ColorConstants.WHITE)
                                .setPadding(8);

                table.addCell(labelCell);
                table.addCell(valueCell);
        }
}
