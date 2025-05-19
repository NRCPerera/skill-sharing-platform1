package com.skillshare.platform.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.skillshare.platform.model.ProgressUpdate;
import com.skillshare.platform.model.User;
import com.skillshare.platform.repository.ProgressUpdateRepository;
import com.skillshare.platform.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ProgressUpdateService {
    
        @Autowired
    private ProgressUpdateRepository progressUpdateRepository;

    @Autowired
    private UserRepository userRepository;

    public List<ProgressUpdate> findAll() {
        return progressUpdateRepository.findAll();
    }

    public ProgressUpdate createUpdate(String email, ProgressUpdate update) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        update.setUser(user);
        update.setCreatedAt(LocalDateTime.now());
        return progressUpdateRepository.save(update);
    }

    public void deleteUpdate(Long updateId, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        ProgressUpdate update = progressUpdateRepository.findById(updateId)
                .orElseThrow(() -> new RuntimeException("Update not found"));
        if (!update.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }
        progressUpdateRepository.delete(update);
    }
}
