package org.code.repo;

import org.code.entities.Category;
import org.code.entities.Post;
import org.code.entities.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostRepo extends JpaRepository<Post,Integer> {
    Page<Post> findByCategory(Category category, PageRequest pageRequest);
    List<Post> findByUser(User user);
    List<Post> findByTitleContaining(String title);
}
