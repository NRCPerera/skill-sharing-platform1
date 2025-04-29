package com.skillshare.platform.service;

import com.skillshare.platform.model.Media;
import com.skillshare.platform.model.Post;
import com.skillshare.platform.model.User;
import com.skillshare.platform.repository.PostRepository;
import com.skillshare.platform.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private S3Service s3Service;

    // @Autowired
    // private NotificationService notificationService;

    public List<Post> findAll() {
        return postRepository.findAll();
    }

    public Post createPost(String email, String content, MultipartFile[] mediaFiles) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Post post = new Post();
        post.setContent(content);
        post.setUser(user);
        post.setCreatedAt(LocalDateTime.now());
        post.setLikes(0);

        if (mediaFiles != null && mediaFiles.length <= 3) {
            for (MultipartFile file : mediaFiles) {
                String url = s3Service.uploadFile(file);
                Media media = new Media();
                media.setUrl(url);
                media.setType(file.getContentType().startsWith("image") ? "image" : "video");
                media.setPost(post);
                post.getMedia().add(media);
            }
        }

        Post savedPost = postRepository.save(post);
        //notificationService.createNotification(user, "You created a new post!");
        return savedPost;
    }

    public void likePost(Long postId, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        post.setLikes(post.getLikes() + 1);
        postRepository.save(post);
        //notificationService.createNotification(post.getUser(), user.getName() + " liked your post!");
    }

    public void deletePost(Long postId, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        if (!post.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }
        postRepository.delete(post);
    }
}