package kr.or.hotelpms.hotel.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "comments")
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, length = 500)
    private String content;
    @Column(nullable = false)
    private String username;
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "review_id")
    @JsonBackReference
    private Review review;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    @JsonBackReference
    private Comment parent;

    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Comment> children = new ArrayList<>();

    @PrePersist
    public void prePersist() { this.createdAt = LocalDateTime.now(); }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public Review getReview() { return review; }
    public void setReview(Review review) { this.review = review; }
    public Comment getParent() { return parent; }
    public void setParent(Comment parent) { this.parent = parent; }
    public List<Comment> getChildren() { return children; }
    public void setChildren(List<Comment> children) { this.children = children; }
}