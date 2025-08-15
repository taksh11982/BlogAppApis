package org.code.controllers;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.code.config.AppConstants;
import org.code.payload.ApiResponse;
import org.code.payload.ImageResponse;
import org.code.payload.PostDto;
import org.code.payload.PostResponse;
import org.code.services.FileService;
import org.code.services.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;

@RestController
@RequestMapping("/api/")
public class PostController {
    @Autowired
    private PostService postService;
    @Autowired
    private FileService fileService;
    @Value("${project.image}")
    private String path;
    @PostMapping(
            value = "/user/{userId}/category/{categoryId}/posts",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<PostDto> createPost(
            @Valid @RequestBody PostDto postDto,
            @PathVariable Integer categoryId,
            @PathVariable Integer userId
    ) {
        PostDto createdPost = postService.createPost(postDto, categoryId, userId);
        return new  ResponseEntity<PostDto>(createdPost,HttpStatus.CREATED);
    }
    @GetMapping("/user/{userId}/posts")
    public ResponseEntity<List<PostDto>> getPostsByUser(@PathVariable Integer userId) {
        List<PostDto> allPostsByUser = this.postService.findAllPostsByUser(userId);
        return new ResponseEntity<>(allPostsByUser,HttpStatus.OK);
    }
    @GetMapping("/category/{categoryId}/posts")
    public ResponseEntity<PostResponse> getPostsByCategory(@PathVariable Integer categoryId,@RequestParam(value = "pageNumber",defaultValue = "0",required = false)Integer pageNumber,@RequestParam(value = "pageSize",defaultValue = "3",required = false)Integer pageSize) {
        PostResponse postResponse = this.postService.findAllPostsByCategory(categoryId,pageNumber,pageSize);
        return new ResponseEntity<PostResponse>(postResponse,HttpStatus.OK);
    }
    //get all posts
    @GetMapping("/posts")
    public ResponseEntity<PostResponse> findAllPosts(@RequestParam(value =AppConstants.PAGE_NO,defaultValue = "0",required = false)Integer pageNumber
            , @RequestParam(value = "pageSize",defaultValue = AppConstants.PAGE_SIZE,required = false)Integer pageSize
    ,@RequestParam(value = "sortBy",defaultValue = AppConstants.SORT_BY,required = false)String sortBy) {
        PostResponse postResponse = this.postService.getAllPosts(pageNumber,pageSize,sortBy);
        return new ResponseEntity<PostResponse>(postResponse,HttpStatus.OK);
    }
    //get post by postId
    @GetMapping("/post/{id}/posts")
    public ResponseEntity<PostDto>getPostById(@PathVariable Integer id) {
        PostDto postDto = this.postService.findPostById(id);
        return new ResponseEntity<PostDto>(postDto,HttpStatus.OK);
    }
    //
    @PutMapping("/post/{id}")
    public ResponseEntity<PostDto> updatePost(@RequestBody PostDto postDto,@PathVariable Integer id) {
        PostDto postDto1 = this.postService.updatePost(postDto, id);
        return new ResponseEntity<PostDto>(postDto1,HttpStatus.OK);
    }
    //delete
    @DeleteMapping("/post/{id}")
    public ApiResponse deletePost(@PathVariable Integer id) {
        this.postService.deletePostById(id);
        return  new ApiResponse("post deleted succesfully",true);
    }
    //search
    @GetMapping("/post/search/{keyword}")
    public ResponseEntity<List<PostDto>> searchPost(@PathVariable String keyword) {
        List<PostDto> postDtos = this.postService.searchPosts(keyword);
        return new ResponseEntity<>(postDtos,HttpStatus.OK);
    }
    //postphoto
    @PostMapping("/post/image/upload/{postId}")
    public ResponseEntity<PostDto>uploadPostImage(@RequestParam("image")MultipartFile image
    ,@PathVariable Integer postId) throws IOException {
        String fileName = this.fileService.uploadImage(path, image);
        PostDto postDto = this.postService.findPostById(postId);
        postDto.setImageName(fileName);
        PostDto updatedPost = this.postService.updatePost(postDto, postId);
        return new ResponseEntity<>(updatedPost,HttpStatus.OK);
    }
    @GetMapping(value = "/images/{imageName}", produces = MediaType.IMAGE_JPEG_VALUE)
    public void downloadImage(@PathVariable("imageName") String imageName, HttpServletResponse response) throws IOException {
        System.out.println("Download request for: " + imageName);
        String fullPath = path + File.separator + imageName;
        System.out.println("Looking for file at: " + fullPath);

        // Check if file exists
        File file = new File(fullPath);
        if (!file.exists()) {
            System.out.println("File does NOT exist at: " + fullPath);
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            response.getWriter().write("Image not found at: " + fullPath);
            return;
        } else {
            System.out.println("File exists, size: " + file.length());
        }

        InputStream resource = this.fileService.getSource(path, imageName);
        response.setContentType(MediaType.IMAGE_JPEG_VALUE);
        StreamUtils.copy(resource, response.getOutputStream());
    }


}
