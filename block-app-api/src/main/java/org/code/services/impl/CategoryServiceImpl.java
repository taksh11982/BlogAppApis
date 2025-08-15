package org.code.services.impl;

import org.code.entities.Category;
import org.code.exceptions.ResouceNotFoundException;
import org.code.payload.CategoryDto;
import org.code.repo.CategoryRepo;
import org.code.services.CategoryService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryServiceImpl implements CategoryService {
    @Autowired
    private CategoryRepo categoryRepo;
    @Autowired
    private ModelMapper modelMapper;
    @Override
    public CategoryDto createCategory(CategoryDto categoryDto) {
        Category c = this.modelMapper.map(categoryDto, Category.class);
        Category saved=this.categoryRepo.save(c);
        return this.modelMapper.map(saved, CategoryDto.class);
    }

    @Override
    public CategoryDto updateCategory(CategoryDto categoryDto, Integer categoryId) {
        Category cat=this.categoryRepo.findById(categoryId).orElseThrow(()->new ResouceNotFoundException("category","categoryId",categoryId));
        cat.setCategoryTitle(categoryDto.getCategoryTitle());
        cat.setCategoryDescription(categoryDto.getCategoryDescription());
        Category saved=this.categoryRepo.save(cat);
        return this.modelMapper.map(saved, CategoryDto.class);
    }

    @Override
    public void deleteCategory(Integer categoryId) {
        Category cat=this.categoryRepo.findById(categoryId).orElseThrow(()->new ResouceNotFoundException("category","categoryId",categoryId));
        this.categoryRepo.delete(cat);
    }

    @Override
    public CategoryDto findCategoryById(Integer categoryId) {
        Category cat=this.categoryRepo.findById(categoryId).orElseThrow(()->new ResouceNotFoundException("category","categoryId",categoryId));
        return this.modelMapper.map(cat, CategoryDto.class);
    }

    @Override
    public List<CategoryDto> getCategories() {
        List<Category> all = this.categoryRepo.findAll();
        List<CategoryDto> collect = all.stream().map((cat) -> this.modelMapper.map(cat, CategoryDto.class)).collect(Collectors.toList());
        return collect;
    }
}
