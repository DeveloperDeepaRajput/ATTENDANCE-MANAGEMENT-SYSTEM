package src;

import java.io.Serializable;

/**
 * Smart Attendance Management System
 * Student.java - Represents the Student Model.
 * This class implements Serializable to allow saving the student state to local files.
 * Uses Encapsulation with private variables and public getters/setters.
 */
public class Student implements Serializable {
    private static final long serialVersionUID = 1L;

    // Student Information Fields (Encapsulation)
    private String name;
    private String rollNumber;
    private String course;
    private String semester;
    private String section;

    // Attendance Metrics
    private int attendedClasses;
    private int totalClasses;

    // Default Constructor for training demo
    public Student() {
        this.name = "John Doe";
        this.rollNumber = "CS2026104";
        this.course = "B.Tech Computer Science";
        this.semester = "4th Semester";
        this.section = "Section-A";
        this.attendedClasses = 15;
        this.totalClasses = 18; // Default ~83.3% attendance
    }

    // Parameterized Constructor
    public Student(String name, String rollNumber, String course, String semester, String section) {
        this.name = name;
        this.rollNumber = rollNumber;
        this.course = course;
        this.semester = semester;
        this.section = section;
        this.attendedClasses = 0;
        this.totalClasses = 0;
    }

    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getRollNumber() { return rollNumber; }
    public void setRollNumber(String rollNumber) { this.rollNumber = rollNumber; }

    public String getCourse() { return course; }
    public void setCourse(String course) { this.course = course; }

    public String getSemester() { return semester; }
    public void setSemester(String semester) { this.semester = semester; }

    public String getSection() { return section; }
    public void setSection(String section) { this.section = section; }

    public int getAttendedClasses() { return attendedClasses; }
    public void setAttendedClasses(int attendedClasses) { this.attendedClasses = attendedClasses; }

    public int getTotalClasses() { return totalClasses; }
    public void setTotalClasses(int totalClasses) { this.totalClasses = totalClasses; }

    // Business Logic: Calculate current attendance percentage
    public double getAttendancePercentage() {
        if (totalClasses == 0) {
            return 0.0;
        }
        return ((double) attendedClasses / totalClasses) * 100.0;
    }

    // Business Logic: Record a new attendance entry
    public void markAttendance(boolean isPresent) {
        totalClasses++;
        if (isPresent) {
            attendedClasses++;
        }
    }

    // Return the course as the branch name for compatibility
    public String getBranch() {
        return getCourse();
    }

    // Return the number of missed classes for compatibility
    public int getMissedClasses() {
        return totalClasses - attendedClasses;
    }
}
