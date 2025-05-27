package ca.discode.entity;

import jakarta.persistence.*;
import java.util.List;

@Entity
public class CodingProblem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(length = 2000)
    private String description;

    @ElementCollection
    private List<String> constraints;

    @Column(length = 2000)
    private String initialCode;

    @Column(length = 2000)
    private String unitTest;

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public List<String> getConstraints() { return constraints; }
    public void setConstraints(List<String> constraints) { this.constraints = constraints; }

    public String getInitialCode() { return initialCode; }
    public void setInitialCode(String initialCode) { this.initialCode = initialCode; }

    public String getUnitTest() { return unitTest; }
    public void setUnitTest(String unitTest) { this.unitTest = unitTest; }

}