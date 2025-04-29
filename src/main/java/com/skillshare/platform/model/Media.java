package com.skillshare.platform.model;

import lombok.Data;
import jakarta.persistence.*;

@Data
@Entity
@Table(name = "media")
public class Media {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String url;
    private String type; // "image" or "video"

    @ManyToOne
    @JoinColumn(name = "post_id")
    private Post post;
}