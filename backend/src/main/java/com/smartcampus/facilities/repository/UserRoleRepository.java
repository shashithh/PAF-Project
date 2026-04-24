package com.smartcampus.facilities.repository;

import com.smartcampus.facilities.entity.Role;
import com.smartcampus.facilities.entity.User;
import com.smartcampus.facilities.entity.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRoleRepository extends JpaRepository<UserRole, Long> {
    List<UserRole> findByUser(User user);
    Optional<UserRole> findByUserAndRole(User user, Role role);

}