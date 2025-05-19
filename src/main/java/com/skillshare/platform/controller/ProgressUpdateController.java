package com.skillshare.platform.controller;

import com.skillshare.platform.model.ProgressUpdate;
import com.skillshare.platform.service.ProgressUpdateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/progress-updates")
public class ProgressUpdateController {

    @Autowired
    private ProgressUpdateService progressUpdateService;

    @GetMapping
    public List<ProgressUpdate> getAllUpdates() {
        return progressUpdateService.findAll();
    }

    @PostMapping
    public ResponseEntity<ProgressUpdate> createUpdate(
            @RequestBody ProgressUpdate update,
            @AuthenticationPrincipal OAuth2User principal) {
        String email = principal.getAttribute("email");
        ProgressUpdate createdUpdate = progressUpdateService.createUpdate(email, update);
        return ResponseEntity.ok(createdUpdate);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUpdate(
            @PathVariable Long id,
            @AuthenticationPrincipal OAuth2User principal) {
        String email = principal.getAttribute("email");
        progressUpdateService.deleteUpdate(id, email);
        return ResponseEntity.ok().build();
    }
}