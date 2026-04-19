package com.smartcampus.resource;

import jakarta.validation.constraints.NotBlank;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "resources")
public class Resource {

    @Id
    private String id;

    @NotBlank
    private String name;

    private int capacity;

    private String type; // lab | room | equipment

    public String getId()       { return id; }
    public String getName()     { return name; }
    public int    getCapacity() { return capacity; }
    public String getType()     { return type; }

    public void setId(String id)           { this.id = id; }
    public void setName(String name)       { this.name = name; }
    public void setCapacity(int capacity)  { this.capacity = capacity; }
    public void setType(String type)       { this.type = type; }
}
