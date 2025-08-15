package org.code.controllers;

import org.code.payload.ApiResponse;
import org.code.payload.CategoryDto;
import org.code.services.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {
    @Autowired
    private CategoryService categoryService;
    @PostMapping("/")
    public ResponseEntity<CategoryDto> createCategory(@RequestBody CategoryDto categoryDto) {
        CategoryDto category=this.categoryService.createCategory(categoryDto);
        return new ResponseEntity<CategoryDto>(category, HttpStatus.CREATED);
    }
    @PutMapping("/{catId}")
    public ResponseEntity<CategoryDto> updateCategory(@RequestBody CategoryDto categoryDto,@PathVariable Integer catId) {
        CategoryDto category=this.categoryService.updateCategory(categoryDto,catId);
        return new ResponseEntity<CategoryDto>(category, HttpStatus.OK);
    }
    @DeleteMapping("/{catId}")
    public ResponseEntity<ApiResponse> deleteCategory(@PathVariable Integer catId) {
        this.categoryService.deleteCategory(catId);
        return new ResponseEntity<ApiResponse>(new ApiResponse("category deleted successfully",true ),HttpStatus.OK);
    }
    @GetMapping("/{catId}")
    public ResponseEntity<CategoryDto> getCategoryById(@PathVariable Integer catId) {
        CategoryDto category=this.categoryService.findCategoryById(catId);
        return new ResponseEntity<CategoryDto>(category, HttpStatus.OK);
    }
    @GetMapping("/")
    public ResponseEntity<List<CategoryDto>> getCategory() {
        List<CategoryDto> category= this.categoryService.getCategories();
        return ResponseEntity.ok(category);
    }

}
