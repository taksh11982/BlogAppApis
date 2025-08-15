package org.code.controllers;

import org.code.payload.ApiResponse;
import org.code.payload.CommentDto;
import org.code.services.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class CommentController {
    @Autowired
    private CommentService commentService;
    @PostMapping("/posts/{postId}/comments")
    public ResponseEntity<CommentDto> createComment(@RequestBody CommentDto commentDto, @PathVariable("postId")Integer postId) {
        CommentDto comment = this.commentService.createComment(commentDto, postId);
        return new  ResponseEntity<CommentDto>(comment, HttpStatus.CREATED);
    }
    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<ApiResponse> deleteComment(@PathVariable("commentId")Integer commentId) {
        this.commentService.deleteComment(commentId);
        return new  ResponseEntity<ApiResponse>(new ApiResponse("comment deleated succesfully",true), HttpStatus.OK);
    }
}
