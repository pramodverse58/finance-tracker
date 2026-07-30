package com.financetracker.controller;

import com.financetracker.model.User;
import com.financetracker.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.time.YearMonth;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/csv")
    public ResponseEntity<byte[]> downloadCsv(@AuthenticationPrincipal User user,
                                               @RequestParam(required = false) String month) throws IOException {
        String targetMonth = resolveMonth(month);
        byte[] csv = reportService.generateCsv(user, targetMonth);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("text/csv"))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        ContentDisposition.attachment().filename("transactions-" + targetMonth + ".csv").build().toString())
                .body(csv);
    }

    @GetMapping("/pdf")
    public ResponseEntity<byte[]> downloadPdf(@AuthenticationPrincipal User user,
                                               @RequestParam(required = false) String month) throws IOException {
        String targetMonth = resolveMonth(month);
        byte[] pdf = reportService.generatePdf(user, targetMonth);

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        ContentDisposition.attachment().filename("expense-report-" + targetMonth + ".pdf").build().toString())
                .body(pdf);
    }

    private String resolveMonth(String month) {
        return (month == null || month.isBlank()) ? YearMonth.now().toString() : month;
    }
}
