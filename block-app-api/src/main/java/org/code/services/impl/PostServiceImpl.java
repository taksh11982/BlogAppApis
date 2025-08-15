package org.code.services.impl;

import org.code.entities.Category;
import org.code.entities.Post;
import org.code.entities.User;
import org.code.exceptions.ResouceNotFoundException;
import org.code.payload.PostDto;
import org.code.payload.PostResponse;
import org.code.repo.CategoryRepo;
import org.code.repo.PostRepo;
import org.code.repo.UserRepo;
import org.code.services.PostService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PostServiceImpl implements PostService {
    @Autowired
    private PostRepo postRepo;
    @Autowired
    private ModelMapper modelMapper;
    @Autowired
    private UserRepo userRepo;
    @Autowired
    private CategoryRepo categoryRepo;
    @Override
    public PostDto createPost(PostDto postDto,Integer categoryId,Integer userId) {
        User user = this.userRepo.findById(userId).orElseThrow(()->new ResouceNotFoundException("User","id",userId));
        Category category =this.categoryRepo.findById(categoryId).orElseThrow(()->new ResouceNotFoundException("Category","id",categoryId));
        Post map = this.modelMapper.map(postDto, Post.class);
        map.setImageName("default.png");
        map.setCreatedDate(new Date());
//        map.setTitle("hello");
//        map.setContent("hello");
        map.setUser(user);
        map.setCategory(category);
        Post save = this.postRepo.save(map);
        return this.modelMapper.map(save, PostDto.class);
    }

    @Override
    public PostDto updatePost(PostDto postDto,Integer id) {
        Post byId = this.postRepo.getById(id);
        byId.setCreatedDate(new Date());
        byId.setContent(postDto.getContent());
        byId.setImageName(postDto.getImageName());
        byId.setTitle(postDto.getTitle());
        Post save = this.postRepo.save(byId);
        return modelMapper.map(save, PostDto.class);
    }

    @Override
    public PostDto findPostById(int id) {
        Post post = this.postRepo.findById(id).orElseThrow(() -> new ResouceNotFoundException("Post", "id", id));
        return modelMapper.map(post, PostDto.class) ;
    }

    @Override
    public PostResponse getAllPosts(Integer pageNumber, Integer pageSize,String sortBy) {
        PageRequest pageRequest = PageRequest.of(pageNumber-1,pageSize, Sort.by(sortBy));
        Page<Post> all1 = this.postRepo.findAll(pageRequest);
        List<Post> all = all1.getContent();
        List<PostDto> collect=all.stream().map(post -> this.modelMapper.map(post, PostDto.class)).collect(Collectors.toList());
        PostResponse postResponse = new PostResponse();
        postResponse.setContent(collect);
        postResponse.setPageNumber(all1.getNumber());
        postResponse.setPageSize(all1.getSize());
        postResponse.setTotalElements((int)all1.getTotalElements());
        postResponse.setTotalPages(all1.getTotalPages());
        postResponse.setLastPage(all1.isLast());
        return postResponse;
    }

    @Override
    public void deletePostById(int id) {
        Post post = this.postRepo.findById(id).orElseThrow(() -> new ResouceNotFoundException("Post", "id", id));
        this.postRepo.delete(post);
    }

    @Override
    public PostResponse findAllPostsByCategory(Integer categoryId,Integer pageNumber, Integer pageSize) {
        PageRequest pageRequest = PageRequest.of(pageNumber, pageSize);
        Category cat= this.categoryRepo.findById(categoryId).orElseThrow(()->new ResouceNotFoundException("Category","id",categoryId));
        Page<Post> postPage = this.postRepo.findByCategory(cat, pageRequest);
        List<Post> byCategory = postPage.getContent();
        List<PostDto> collect = byCategory.stream().map((post) -> this.modelMapper.map(post, PostDto.class)).collect(Collectors.toList());
        PostResponse postResponse = new PostResponse();
        postResponse.setContent(collect);
        postResponse.setPageNumber(postPage.getNumber());
        postResponse.setPageSize(postPage.getSize());
        postResponse.setTotalPages(postPage.getTotalPages());
        postResponse.setLastPage(postPage.isLast());
        postResponse.setTotalElements((int)postPage.getTotalElements());
        return postResponse;
    }

    @Override
    public List<PostDto> findAllPostsByUser(Integer userId) {
        User user = this.userRepo.findById(userId).orElseThrow(()->new ResouceNotFoundException("User","id",userId));
        List<Post> byUser = this.postRepo.findByUser(user);
        List<PostDto> collect=byUser.stream().map((post) -> this.modelMapper.map(post, PostDto.class)).collect(Collectors.toList());
        return collect;
    }

    @Override
    public List<PostDto> searchPosts(String keyword) {
        List<Post> posts = this.postRepo.findByTitleContaining(keyword);
        List<PostDto> collect = posts.stream().map((post) -> this.modelMapper.map(post, PostDto.class)).collect(Collectors.toList());
        return collect;
    }


}
