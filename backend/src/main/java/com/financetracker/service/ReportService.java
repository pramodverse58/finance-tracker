package com.financetracker.service;

import com.financetracker.model.Transaction;
import com.financetracker.model.User;
import com.financetracker.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.springframework.stereotype.Service;


import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final TransactionRepository transactionRepository;

    
    public byte[] generateCsv(User user, String month) throws IOException {
        YearMonth ym = YearMonth.parse(month, DateTimeFormatter.ofPattern("yyyy-MM"));
        List<Transaction> transactions = transactionRepository.findByUserIdAndDateBetweenOrderByDateDesc(
                user.getId(), ym.atDay(1), ym.atEndOfMonth());

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        try (OutputStreamWriter writer = new OutputStreamWriter(out, StandardCharsets.UTF_8);
             CSVPrinter printer = new CSVPrinter(writer, CSVFormat.DEFAULT.builder()
                     .setHeader("Date", "Type", "Category", "Amount", "Note")
                     .build())) {

            for (Transaction t : transactions) {
                printer.printRecord(t.getDate(), t.getType(), t.getCategory(), t.getAmount(),
                        t.getNote() == null ? "" : t.getNote());
            }
            printer.flush();
        }
        return out.toByteArray();
    }

    
    public byte[] generatePdf(User user, String month) throws IOException {
        YearMonth ym = YearMonth.parse(month, DateTimeFormatter.ofPattern("yyyy-MM"));
        LocalDate start = ym.atDay(1);
        LocalDate end = ym.atEndOfMonth();

        List<Transaction> transactions = transactionRepository.findByUserIdAndDateBetweenOrderByDateDesc(
                user.getId(), start, end);

        BigDecimal totalIncome = transactions.stream()
                .filter(t -> t.getType().name().equals("INCOME"))
                .map(Transaction::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalExpense = transactions.stream()
                .filter(t -> t.getType().name().equals("EXPENSE"))
                .map(Transaction::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add);

        try (PDDocument document = new PDDocument()) {
            PDPage page = new PDPage(PDRectangle.A4);
            document.addPage(page);

            PDType1Font titleFont = new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD);
            PDType1Font headerFont = new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD);
            PDType1Font bodyFont = new PDType1Font(Standard14Fonts.FontName.HELVETICA);

            float margin = 50;
            float y = page.getMediaBox().getHeight() - margin;
            float rowHeight = 16;

            PDPageContentStream cs = new PDPageContentStream(document, page);

            // Title
            cs.beginText();
            cs.setFont(titleFont, 16);
            cs.newLineAtOffset(margin, y);
            cs.showText("Expense Report - " + month);
            cs.endText();
            y -= 24;

            cs.beginText();
            cs.setFont(bodyFont, 10);
            cs.newLineAtOffset(margin, y);
            cs.showText("Account: " + user.getFullName() + " (" + user.getEmail() + ")");
            cs.endText();
            y -= 14;

            cs.beginText();
            cs.setFont(bodyFont, 10);
            cs.newLineAtOffset(margin, y);
            cs.showText(String.format("Total Income: %.2f    Total Expense: %.2f    Net: %.2f",
                    totalIncome, totalExpense, totalIncome.subtract(totalExpense)));
            cs.endText();
            y -= 24;

            // Table header
            cs.setFont(headerFont, 10);
            cs.beginText();
            cs.newLineAtOffset(margin, y);
            cs.showText("Date");
            cs.endText();
            cs.beginText();
            cs.newLineAtOffset(margin + 80, y);
            cs.showText("Type");
            cs.endText();
            cs.beginText();
            cs.newLineAtOffset(margin + 150, y);
            cs.showText("Category");
            cs.endText();
            cs.beginText();
            cs.newLineAtOffset(margin + 300, y);
            cs.showText("Amount");
            cs.endText();
            cs.beginText();
            cs.newLineAtOffset(margin + 380, y);
            cs.showText("Note");
            cs.endText();
            y -= 6;
            cs.moveTo(margin, y);
            cs.lineTo(page.getMediaBox().getWidth() - margin, y);
            cs.stroke();
            y -= rowHeight;

            cs.setFont(bodyFont, 9);

            for (Transaction t : transactions) {
                if (y < margin + rowHeight) {
                    cs.close();
                    PDPage newPage = new PDPage(PDRectangle.A4);
                    document.addPage(newPage);
                    page = newPage;
                    y = page.getMediaBox().getHeight() - margin;
                    cs = new PDPageContentStream(document, page);
                    cs.setFont(bodyFont, 9);
                }

                String note = t.getNote() == null ? "" : t.getNote();
                if (note.length() > 28) {
                    note = note.substring(0, 25) + "...";
                }

                writeCell(cs, t.getDate().toString(), margin, y);
                writeCell(cs, t.getType().name(), margin + 80, y);
                writeCell(cs, truncate(t.getCategory(), 20), margin + 150, y);
                writeCell(cs, t.getAmount().toString(), margin + 300, y);
                writeCell(cs, note, margin + 380, y);

                y -= rowHeight;
            }

            cs.close();

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            document.save(out);
            return out.toByteArray();
        }
    }

    private void writeCell(PDPageContentStream cs, String text, float x, float y) throws IOException {
        cs.beginText();
        cs.newLineAtOffset(x, y);
        cs.showText(text == null ? "" : text);
        cs.endText();
    }

    private String truncate(String s, int max) {
        if (s == null) return "";
        return s.length() > max ? s.substring(0, max - 3) + "..." : s;
    }
}
