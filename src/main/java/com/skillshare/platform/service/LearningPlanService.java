package com.skillshare.platform.service;

import com.skillshare.platform.model.LearningPlan;
import com.skillshare.platform.model.User;
import com.skillshare.platform.repository.LearningPlanRepository;
import com.skillshare.platform.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class LearningPlanService {

    @Autowired
    private LearningPlanRepository learningPlanRepository;

    @Autowired
    private UserRepository userRepository;

    public List<LearningPlan> findAll() {
        return learningPlanRepository.findAll();
    }

    public LearningPlan createPlan(String email, LearningPlan plan) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        plan.setUser(user);
        plan.setCreatedAt(LocalDateTime.now());
        return learningPlanRepository.save(plan);
    }

    public LearningPlan updatePlan(Long planId, String email, LearningPlan plan) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        LearningPlan existingPlan = learningPlanRepository.findById(planId)
                .orElseThrow(() -> new RuntimeException("Plan not found"));
        if (!existingPlan.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }
        existingPlan.setTopic(plan.getTopic());
        existingPlan.setResources(plan.getResources());
        existingPlan.setTimeline(plan.getTimeline());
        return learningPlanRepository.save(existingPlan);
    }

    public void deletePlan(Long planId, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        LearningPlan plan = learningPlanRepository.findById(planId)
                .orElseThrow(() -> new RuntimeException("Plan not found"));
        if (!plan.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }
        learningPlanRepository.delete(plan);
    }
}