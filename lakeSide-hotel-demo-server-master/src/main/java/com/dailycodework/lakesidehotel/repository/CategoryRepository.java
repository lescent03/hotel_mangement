package com.dailycodework.lakesidehotel.repository;

import com.dailycodework.lakesidehotel.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository  extends JpaRepository<Category, Long> {
}
