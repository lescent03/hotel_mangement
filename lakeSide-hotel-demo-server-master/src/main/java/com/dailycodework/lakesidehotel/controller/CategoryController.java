package com.dailycodework.lakesidehotel.controller;

import com.dailycodework.lakesidehotel.model.Category;
import com.dailycodework.lakesidehotel.response.CategoryResponse;
import com.dailycodework.lakesidehotel.service.ICategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/categories")
public class CategoryController {
    private final ICategoryService iCategoryService;

    @PutMapping("/category/update/{categoryId}")
    public ResponseEntity<CategoryResponse> UpdateCategory(@PathVariable Long categoryId, @RequestBody Category categoryUpdate){
        Category updateCategory = iCategoryService.UpdateCategory(categoryId, categoryUpdate);
        return ResponseEntity.ok(GetCategoryResponse(updateCategory));
    }

    @PostMapping("/category/new-category")
    public  ResponseEntity<CategoryResponse> CreateNewCategory(@RequestBody Category category){
        CategoryResponse categoryResponse = GetCategoryResponse(iCategoryService.CreateNewCategory(category));
        return ResponseEntity.status(HttpStatus.CREATED).body(categoryResponse);
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<CategoryResponse> GetCategoryById(@PathVariable Long categoryId){
        Category category = iCategoryService.findById(categoryId).orElse(new Category());
        CategoryResponse categoryResponse = GetCategoryResponse(category);
        return ResponseEntity.status(HttpStatus.OK).body(categoryResponse);
    }

    @GetMapping("/all-category")
    public ResponseEntity<List<CategoryResponse>> GetAllCategory(){
        List<Category> categories = iCategoryService.GetAllCategory();
        List<CategoryResponse> categoryResponses = new ArrayList<>();
        for(Category category : categories){
            categoryResponses.add(GetCategoryResponse(category));
        }
        return ResponseEntity.status(HttpStatus.OK).body(categoryResponses);
    }

    public CategoryResponse GetCategoryResponse(Category category){
        return new CategoryResponse(category.getId(), category.getType(),category.getDescription());
    }
}
