package org.code.repo;

import org.code.entities.Category;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepo  extends JpaRepository<Category, Integer> {

}
