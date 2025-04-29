package com.skillshare.platform.controller;

import com.skillshare.platform.model.LearningPlan;
import com.skillshare.platform.service.LearningPlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/learning-plans")
public class LearningPlanController {

    @Autowired
    private LearningPlanService learningPlanService;

    @GetMapping
    public List<LearningPlan> getAllPlans() {
        return learningPlanService.findAll();
    }

    @PostMapping
    public ResponseEntity<LearningPlan> createPlan(
            @RequestBody LearningPlan plan,
            @AuthenticationPrincipal OAuth2User principal) {
        String email = principal.getAttribute("email");
        LearningPlan createdPlan = learningPlanService.createPlan(email, plan);
        return ResponseEntity.ok(createdPlan);
    }

    @PutMapping("/{id}")
    public ResponseEntity<LearningPlan> updatePlan(
            @PathVariable Long id,
            @RequestBody LearningPlan plan,
            @AuthenticationPrincipal OAuth2User principal) {
        String email = principal.getAttribute("email");
        LearningPlan updatedPlan = learningPlanService.updatePlan(id, email, plan);
        return ResponseEntity.ok(updatedPlan);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlan(
            @PathVariable Long id,
            @AuthenticationPrincipal OAuth2User principal) {
        String email = principal.getAttribute("email");
        learningPlanService.deletePlan(id, email);
        return ResponseEntity.ok().build();
    }
}