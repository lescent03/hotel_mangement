package com.dailycodework.lakesidehotel.service;

import com.dailycodework.lakesidehotel.model.Category;
import com.dailycodework.lakesidehotel.model.Room;
import com.dailycodework.lakesidehotel.repository.CategoryRepository;
import com.dailycodework.lakesidehotel.response.RoomResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CategoryService implements ICategoryService {
    private final CategoryRepository categoryRepository;

    @Override
    public Category UpdateCategory(Long categoryId, Category category){
        Category updateCategory = categoryRepository.findById(categoryId).orElse(new Category());
        if(updateCategory.getId() != null){
            updateCategory.setType(category.getType());
            updateCategory.setDescription(category.getDescription());
            return categoryRepository.save(updateCategory);
        }
        return updateCategory;
    }

    @Override
    public  Category CreateNewCategory(Category category){
        return categoryRepository.save(category);
    }

    @Override
    public List<Category> GetAllCategory(){
        return categoryRepository.findAll();
    }

    @Override
    public Optional<Category> findById(Long categoryId) {
        return categoryRepository.findById(categoryId);
    }

    public Room SetCategory(Room currentRoom, RoomResponse newRoom){
        Category category = findById(newRoom.getCategory().getId()).orElse(new Category());
        currentRoom.setCategory(category);
        return currentRoom;
    }
}
