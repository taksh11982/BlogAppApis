package org.code.services.impl;

import org.code.entities.Comments;
import org.code.entities.Post;
import org.code.entities.User;
import org.code.exceptions.ResouceNotFoundException;
import org.code.payload.CommentDto;
import org.code.repo.CommentRepo;
import org.code.repo.PostRepo;
import org.code.repo.UserRepo;
import org.code.services.CommentService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CommentServiceImpl implements CommentService {
    @Autowired
    private PostRepo postRepo;
    @Autowired
    private CommentRepo commentRepo;
    @Autowired
    private UserRepo userRepo;
    @Autowired
    ModelMapper modelMapper;
    @Override
    public CommentDto createComment(CommentDto commentDto, Integer postId, Integer userId) {
        Post post = this.postRepo.findById(postId).orElseThrow(() -> new ResouceNotFoundException("Post", "id", postId));
        User user = this.userRepo.findById(userId).orElseThrow(() -> new ResouceNotFoundException("User", "id", userId));
        Comments comment = modelMapper.map(commentDto, Comments.class);
        comment.setPost(post);
        comment.setUser(user);
        Comments savedComment = this.commentRepo.save(comment);
        return this.modelMapper.map(savedComment, CommentDto.class);
    }

    @Override
    public void deleteComment(Integer commentId) {
        Comments comments = this.commentRepo.findById(commentId).orElseThrow(() -> new ResouceNotFoundException("Comment", "id", commentId));
        this.commentRepo.delete(comments);
    }
}
