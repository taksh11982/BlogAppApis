package org.code.payload;

import jakarta.persistence.Column;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.code.entities.Category;
import org.code.entities.Comments;
import org.code.entities.User;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
public class PostDto {
    private String title;
    private String content;
    private String imageName;
    private Date createdDate;
    private CategoryDto category;
    private UserDto user;
    private Set<CommentDto> comments=new HashSet<>();
}
