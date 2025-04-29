package com.skillshare.platform.service;

import com.skillshare.platform.model.User;
import com.skillshare.platform.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oauth2User = super.loadUser(userRequest);
        
        // Extract user info from OAuth2User
        String email = oauth2User.getAttribute("email");
        String name = oauth2User.getAttribute("name");
        
        if (email != null) {
            // Check if user exists
            Optional<User> userOptional = userRepository.findByEmail(email);
            
            if (userOptional.isEmpty()) {
                // Create new user
                User newUser = new User();
                newUser.setEmail(email);
                newUser.setName(name != null ? name : email.split("@")[0]);
                // Set any other default values
                newUser.setBio(""); // Empty bio or some default text
                
                // Save the new user
                userRepository.save(newUser);
                System.out.println("Created new user: " + email);
            } else {
                System.out.println("Existing user logged in: " + email);
            }
        }
        
        return oauth2User;
    }
}