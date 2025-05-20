package com.skillshare.platform.dto;

import lombok.Data;

@Data
public class AuthResponse {
    private Long id;
    private String email;
    private String name;
    private String token; 
    
    public AuthResponse(com.skillshare.platform.model.User user) {
        this.id = user.getId();
        this.email = user.getEmail();
        this.name = user.getName();
    }
    
}