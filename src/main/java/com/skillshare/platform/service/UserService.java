package com.skillshare.platform.service;

//import com.skillshare.platform.model.Post;
import com.skillshare.platform.model.User;
import com.skillshare.platform.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

//import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User save(User user) {
        return userRepository.save(user);
    }

    public void followUser(Long userId, Long followId, String email) {
        User user = userRepository.findById(userId).orElse(null);
        User followUser = userRepository.findById(followId).orElse(null);
        if (user != null && followUser != null) {
            user.getFollowing().add(followUser); 
            followUser.getFollowers().add(user);
            userRepository.save(user);
            userRepository.save(followUser);
        }
    }

    public void unfollowUser(Long userId, Long followId, String email) {
        User user = userRepository.findById(userId).orElse(null);
        User followUser = userRepository.findById(followId).orElse(null);
        if (user != null && followUser != null) {
            user.getFollowing().remove(followUser); 
            followUser.getFollowers().remove(user);
            userRepository.save(user);
            userRepository.save(followUser);
        }
    }

    public boolean isFollowing(Long userId, Long followId, String email) {
        // Implementation for checking if user is following
        return false;
    }

    // public List<Post> getUserPosts(Long userId) {
    //     User user = userRepository.findById(userId).orElse(null);
    //     if (user != null) {
    //         return user.getPosts(); // Assuming User has a getPosts() method
    //     }
    //     return null;
    // }
}