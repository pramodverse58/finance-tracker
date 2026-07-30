package com.financetracker.controller;

import com.financetracker.dto.DashboardSummaryResponse;
import com.financetracker.model.User;
import com.financetracker.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.YearMonth;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/summary")
    public ResponseEntity<DashboardSummaryResponse> getSummary(
            @AuthenticationPrincipal User user,
            @RequestParam(required = false) String month) {
        String targetMonth = (month == null || month.isBlank())
                ? YearMonth.now().toString()
                : month;
        return ResponseEntity.ok(dashboardService.getSummary(user, targetMonth));
    }
}
