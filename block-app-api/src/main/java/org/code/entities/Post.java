package org.code.entities;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.xml.stream.events.Comment;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "post")
@Getter
@Setter
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer postId;
    private String title;
    @Column(length = 1000)
    private String content;
    private String imageName;
    private Date createdDate;
    @ManyToOne
    private Category category;
    @ManyToOne
    private User user;
    @OneToMany(mappedBy = "post",cascade = CascadeType.ALL)
    private Set<Comments> comments=new HashSet<>();
}
