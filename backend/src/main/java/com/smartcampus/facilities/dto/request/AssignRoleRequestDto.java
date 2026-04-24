package com.smartcampus.facilities.dto.request;

import lombok.Data;
import java.util.List;

@Data
public class AssignRoleRequestDto {
    private Long roleId;
    private List<Long> roleIds;
}