package com.smartcampus.repository;

import com.smartcampus.entity.Resource;
import com.smartcampus.enums.ResourceStatus;
import com.smartcampus.enums.ResourceType;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ResourceRepository extends MongoRepository<Resource, String> {

       List<Resource> findByStatus(ResourceStatus status);

       List<Resource> findByType(ResourceType type);
}