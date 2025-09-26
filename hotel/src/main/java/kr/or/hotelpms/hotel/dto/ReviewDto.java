package kr.or.hotelpms.hotel.dto;

import kr.or.hotelpms.hotel.model.Review;
import java.time.LocalDateTime;

public class ReviewDto {
    private Long id;
    private String username;
    private String content;
    private int rating;
    private int likeCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private int commentCount;
    private boolean likedByCurrentUser;

    // JSON 변환을 위한 기본 생성자
    public ReviewDto() {}

    // Review 엔티티로부터 DTO를 생성하는 생성자
    public ReviewDto(Review review, boolean likedByCurrentUser) {
        this.id = review.getId();
        this.username = review.getUsername();
        this.content = review.getContent();
        this.rating = review.getRating();
        this.likeCount = review.getLikeCount();
        this.createdAt = review.getCreatedAt();
        this.updatedAt = review.getUpdatedAt();
        this.commentCount = review.getComments() != null ? review.getComments().size() : 0;
        this.likedByCurrentUser = likedByCurrentUser;
    }

    // Getters and Setters (JSON 변환에 필수)
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public int getRating() { return rating; }
    public void setRating(int rating) { this.rating = rating; }
    public int getLikeCount() { return likeCount; }
    public void setLikeCount(int likeCount) { this.likeCount = likeCount; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    public int getCommentCount() { return commentCount; }
    public void setCommentCount(int commentCount) { this.commentCount = commentCount; }
    public boolean isLikedByCurrentUser() { return likedByCurrentUser; }
    public void setLikedByCurrentUser(boolean likedByCurrentUser) { this.likedByCurrentUser = likedByCurrentUser; }
}