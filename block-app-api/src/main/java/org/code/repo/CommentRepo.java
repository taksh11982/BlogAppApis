package org.code.repo;

import org.code.entities.Comments;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentRepo extends JpaRepository<Comments, Integer> {
}
