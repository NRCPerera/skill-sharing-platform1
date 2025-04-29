package com.skillshare.platform.repository;

import com.skillshare.platform.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostRepository extends JpaRepository<Post, Long> {
}