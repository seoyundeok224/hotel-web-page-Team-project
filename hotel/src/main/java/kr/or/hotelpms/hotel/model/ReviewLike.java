package kr.or.hotelpms.hotel.model;

import jakarta.persistence.*;

@Entity
@Table(name = "review_likes")
public class ReviewLike {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "review_id", nullable = false)
    private Review review;

    @Column(nullable = false)
    private String username;

    public ReviewLike() {
    }

    public ReviewLike(Review review, String username) {
        this.review = review;
        this.username = username;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Review getReview() { return review; }
    public void setReview(Review review) { this.review = review; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
}