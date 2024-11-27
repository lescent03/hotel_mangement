package com.dailycodework.lakesidehotel.service;

import com.dailycodework.lakesidehotel.model.Category;

import java.util.List;
import java.util.Optional;

public interface ICategoryService {
    Optional<Category> findById(Long categoryId);

    List<Category> GetAllCategory();

    Category CreateNewCategory(Category category);

    Category UpdateCategory(Long categoryId, Category category);
}
