package com.meeple.meeple_back.user.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Table(name = "tbl_user")
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;

    @Column(name = "user_name")
    private String userName;
    @Column(name = "user_email")
    private String userEmail;
    @Column(name = "user_password")
    private String userPassword;
    @Column(name="user_birthday")
    private LocalDateTime userBirthday;
    @Column(name = "user_nickname")
    private String userNickname;
    @Column(name = "user_profile_picture_url")
    private String userProfilePictureUrl;
    @Column(name = "user_tier")
    private String userTier;
    @Column(name = "user_level")
    private int userLevel;
    @Column(name = "user_created_at")
    private LocalDateTime userCreatedAt;
    @Column(name = "user_updated_at")
    private LocalDateTime userUpdatedAt;
    @Column(name = "user_deleted_at")
    private LocalDateTime userDeletedAt;
    @Column(name = "user_bio")
    private String userBio;
}