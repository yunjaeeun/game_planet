package com.meeple.meeple_back.game.cockroach.repository;

import com.meeple.meeple_back.game.cockroach.model.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChatMessageRespository extends JpaRepository<ChatMessage, Integer> {

}
