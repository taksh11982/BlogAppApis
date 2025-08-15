package org.code.services;

import org.code.payload.CategoryDto;

import java.util.List;

public interface CategoryService {
    CategoryDto createCategory(CategoryDto categoryDto);
    CategoryDto updateCategory(CategoryDto categoryDto,Integer categoryId);
    void deleteCategory(Integer categoryId);
     CategoryDto findCategoryById(Integer categoryId);
    List<CategoryDto> getCategories();
}
