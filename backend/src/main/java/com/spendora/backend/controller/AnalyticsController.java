package com.spendora.backend.controller;

import com.spendora.backend.dto.response.AnalyticsResponse;
import com.spendora.backend.service.AnalyticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/v1/analytics")
@Tag(name = "Analytics", description = "Endpoints for spending analytics and insights")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping
    @Operation(summary = "Get spending analytics summary for a date range")
    public ResponseEntity<AnalyticsResponse> getAnalytics(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        AnalyticsResponse response = analyticsService.getAnalytics(startDate, endDate);
        return ResponseEntity.ok(response);
    }
}
