package org.code.services;

import org.code.entities.Category;
import org.code.entities.Post;
import org.code.entities.User;
import org.code.payload.PostDto;
import org.code.payload.PostResponse;

import java.util.List;

public interface PostService {
    PostDto createPost(PostDto postDto,Integer categoryId,Integer userId);
    PostDto updatePost(PostDto postDto,Integer id);
    PostDto findPostById(int id);
    PostResponse getAllPosts(Integer pageNumber, Integer pageSize,String sortBy);
    void deletePostById(int id);
    PostResponse findAllPostsByCategory(Integer categoryId,Integer pageNumber, Integer pageSize);
    List<PostDto> findAllPostsByUser(Integer userId);
    List<PostDto> searchPosts(String keyword);
}
