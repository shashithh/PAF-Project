//package com.smartcampus.facilities.controller;
//
//import com.smartcampus.facilities.entity.Role;
//import com.smartcampus.facilities.entity.UserRole;
//import com.smartcampus.facilities.service.RoleService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.access.prepost.PreAuthorize;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//import java.util.Map;
//
//@RestController
//@RequestMapping("/api/roles")
//@RequiredArgsConstructor
//@PreAuthorize("hasRole('ADMIN')")
//public class RoleController {
//
//    private final RoleService roleService;
//
//    // GET all roles
//    @GetMapping
//    public ResponseEntity<List<Role>> getAllRoles() {
//        return ResponseEntity.ok(roleService.getAllRoles());
//    }
//
//    // GET role by id
//    @GetMapping("/{id}")
//    public ResponseEntity<Role> getRoleById(@PathVariable Long id) {
//        return ResponseEntity.ok(roleService.getRoleById(id));
//    }
//
//    // POST create new role
//    @PostMapping
//    public ResponseEntity<Role> createRole(@RequestBody Map<String, String> body) {
//        String name = body.get("name");
//        String description = body.get("description");
//        return ResponseEntity.status(201).body(roleService.createRole(name, description));
//    }
//
//    // PUT update role
//    @PutMapping("/{id}")
//    public ResponseEntity<Role> updateRole(
//            @PathVariable Long id,
//            @RequestBody Map<String, String> body) {
//        String name = body.get("name");
//        String description = body.get("description");
//        return ResponseEntity.ok(roleService.updateRole(id, name, description));
//    }
//
//    // DELETE role
//    @DeleteMapping("/{id}")
//    public ResponseEntity<Void> deleteRole(@PathVariable Long id) {
//        roleService.deleteRole(id);
//        return ResponseEntity.noContent().build();
//    }
//
//    // POST assign role to user
//    @PostMapping("/assign")
//    public ResponseEntity<UserRole> assignRole(@RequestBody Map<String, Long> body) {
//        Long userId = body.get("userId");
//        Long roleId = body.get("roleId");
//        return ResponseEntity.ok(roleService.assignRoleToUser(userId, roleId));
//    }
//
//    // DELETE remove role from user
//    @DeleteMapping("/remove")
//    public ResponseEntity<Void> removeRole(@RequestBody Map<String, Long> body) {
//        Long userId = body.get("userId");
//        Long roleId = body.get("roleId");
//        roleService.removeRoleFromUser(userId, roleId);
//        return ResponseEntity.noContent().build();
//    }
//
//    // GET all roles of a user
//    @GetMapping("/user/{userId}")
//    public ResponseEntity<List<UserRole>> getUserRoles(@PathVariable Long userId) {
//        return ResponseEntity.ok(roleService.getUserRoles(userId));
//    }
//}