package org.code.services;

import org.code.payload.CommentDto;

public interface CommentService {
    CommentDto createComment(CommentDto commentDto,Integer postId) ;
    void deleteComment(Integer commentId);
}
