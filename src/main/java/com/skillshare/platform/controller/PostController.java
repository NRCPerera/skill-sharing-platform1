package com.skillshare.platform.controller;

import com.skillshare.platform.model.Post;
import com.skillshare.platform.service.PostService;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostService postService;

    @GetMapping
    public ResponseEntity<?> getAllPosts(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        List<Post> posts = postService.findAll();
        return ResponseEntity.ok(posts);
    }
    

    @PostMapping
    public ResponseEntity<Post> createPost(
            @RequestParam("content") String content,
            @RequestParam(value = "media", required = false) MultipartFile[] media,
            @AuthenticationPrincipal OAuth2User principal) {
        String email = principal.getAttribute("email");
        Post post = postService.createPost(email, content, media);
        return ResponseEntity.ok(post);
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<Void> likePost(@PathVariable Long id, @AuthenticationPrincipal OAuth2User principal) {
        String email = principal.getAttribute("email");
        postService.likePost(id, email);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id, @AuthenticationPrincipal OAuth2User principal) {
        String email = principal.getAttribute("email");
        postService.deletePost(id, email);
        return ResponseEntity.ok().build();
    }
}