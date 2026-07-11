export interface JavaFile {
  name: string;
  path: string;
  description: string;
  code: string;
}

export const javaFiles: JavaFile[] = [
  {
    name: "Student.java",
    path: "src/Student.java",
    description: "An encapsulated Object-Oriented class representing a Student, including personal details and attendance metrics. Implements Serializable for easy local file storage.",
    code: `package src;

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
}`
  },
  {
    name: "FileManager.java",
    path: "src/FileManager.java",
    description: "Handles data persistence using local files. Saves and loads the Student object using Java Serialization (`.dat`) and logs history into a readable CSV/TXT file.",
    code: `package src;

import java.io.*;
import java.util.ArrayList;

/**
 * Smart Attendance Management System
 * FileManager.java - Handles file operations without any SQL databases.
 * Uses Object Serialization for student data and CSV/Text logging for history.
 */
public class FileManager {
    private static final String STUDENT_FILE = "student_profile.dat";
    private static final String HISTORY_FILE = "attendance_history.txt";

    /**
     * Saves student data locally using Serialization.
     */
    public static void saveStudentData(Student student) {
        try (ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream(STUDENT_FILE))) {
            oos.writeObject(student);
            System.out.println("Student data saved successfully to " + STUDENT_FILE);
        } catch (IOException e) {
            System.err.println("Error saving student data: " + e.getMessage());
        }
    }

    /**
     * Loads student data. If no file exists, returns a default student.
     */
    public static Student loadStudentData() {
        File file = new File(STUDENT_FILE);
        if (!file.exists()) {
            System.out.println("No saved student found. Creating default student profile...");
            Student defaultStudent = new Student();
            saveStudentData(defaultStudent);
            return defaultStudent;
        }

        try (ObjectInputStream ois = new ObjectInputStream(new FileInputStream(STUDENT_FILE))) {
            return (Student) ois.readObject();
        } catch (IOException | ClassNotFoundException e) {
            System.err.println("Error loading student data, resetting: " + e.getMessage());
            Student resetStudent = new Student();
            saveStudentData(resetStudent);
            return resetStudent;
        }
    }

    /**
     * Appends an attendance log to the local history file.
     * Log format: Date,Status(Present/Absent),Attended,Total,Percentage
     */
    public static void logAttendance(String date, boolean isPresent, int attended, int total, double percentage) {
        try (FileWriter fw = new FileWriter(HISTORY_FILE, true);
             BufferedWriter bw = new BufferedWriter(fw);
             PrintWriter out = new PrintWriter(bw)) {
            
            String status = isPresent ? "Present" : "Absent";
            out.printf("%s,%s,%d,%d,%.1f%%\n", date, status, attended, total, percentage);
            System.out.println("Logged attendance to " + HISTORY_FILE);
        } catch (IOException e) {
            System.err.println("Error logging attendance: " + e.getMessage());
        }
    }

    /**
     * Reads all logged attendance entries from local file.
     */
    public static ArrayList<String[]> loadAttendanceHistory() {
        ArrayList<String[]> history = new ArrayList<>();
        File file = new File(HISTORY_FILE);
        
        if (!file.exists()) {
            return history; // Return empty history list
        }

        try (BufferedReader br = new BufferedReader(new FileReader(HISTORY_FILE))) {
            String line;
            while ((line = br.readLine()) != null) {
                if (!line.trim().isEmpty()) {
                    String[] tokens = line.split(",");
                    if (tokens.length >= 5) {
                        history.add(tokens);
                    }
                }
            }
        } catch (IOException e) {
            System.err.println("Error reading attendance history: " + e.getMessage());
        }
        return history;
    }

    /**
     * Resets both files for testing and clean demos.
     */
    public static void resetAllData() {
        File f1 = new File(STUDENT_FILE);
        File f2 = new File(HISTORY_FILE);
        if (f1.exists()) f1.delete();
        if (f2.exists()) f2.delete();
        System.out.println("All local files cleared.");
    }
}`
  },
  {
    name: "AttendanceManager.java",
    path: "src/AttendanceManager.java",
    description: "Houses core business logic including calculations, motivational content, status notifications, and bracket mapping.",
    code: `package src;

import java.awt.Color;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Smart Attendance Management System
 * AttendanceManager.java - Coordinates the app core, handles attendance evaluation,
 * and maps percentages to color themes, icons, and alerts.
 */
public class AttendanceManager {
    private Student currentStudent;

    public AttendanceManager() {
        this.currentStudent = FileManager.loadStudentData();
    }

    public Student getCurrentStudent() {
        return currentStudent;
    }

    /**
     * Marks student attendance and logs it locally.
     * @param isPresent true if present, false if absent
     */
    public void recordAttendance(boolean isPresent) {
        currentStudent.markAttendance(isPresent);
        FileManager.saveStudentData(currentStudent);

        // Capture current date
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        String todayDate = sdf.format(new Date());

        // Log to local text file
        FileManager.logAttendance(
            todayDate, 
            isPresent, 
            currentStudent.getAttendedClasses(), 
            currentStudent.getTotalClasses(), 
            currentStudent.getAttendancePercentage()
        );
    }

    /**
     * Overloaded recordAttendance method for compatibility.
     */
    public void recordAttendance(String subject, boolean isPresent) {
        recordAttendance(isPresent);
    }

    /**
     * Returns color corresponding to the current attendance bracket.
     */
    public Color getStatusColor() {
        double pct = currentStudent.getAttendancePercentage();
        if (pct >= 95) return new Color(34, 197, 94);   // Vibrant Emerald Green
        if (pct >= 75) return new Color(59, 130, 246);  // Sky Royal Blue
        if (pct >= 60) return new Color(234, 179, 8);   // Warning Yellow
        if (pct >= 50) return new Color(249, 115, 22);  // Alert Orange
        return new Color(239, 68, 68);                  // Critical Red
    }

    /**
     * Returns a smart motivational/warning message based on the percentage.
     */
    public String[] getMotivationalMessage() {
        double pct = currentStudent.getAttendancePercentage();
        
        if (currentStudent.getTotalClasses() == 0) {
            return new String[]{
                "Welcome to a New Semester!",
                "No classes have been registered yet.",
                "Mark yourself Present or Absent to begin tracking!"
            };
        }

        if (pct >= 95.0) {
            return new String[]{
                "Outstanding!",
                "You have an excellent attendance of " + String.format("%.1f", pct) + "%",
                "Keep inspiring everyone with your incredible dedication!"
            };
        } else if (pct >= 75.0) {
            return new String[]{
                "Wow!",
                "You have great attendance: " + String.format("%.1f", pct) + "%",
                "Such a punctual and responsible student. Keep it up!"
            };
        } else if (pct >= 60.0) {
            return new String[]{
                "Good.",
                "Your attendance (" + String.format("%.1f", pct) + "%) is acceptable,",
                "but try not to miss more classes to stay safe."
            };
        } else if (pct >= 50.0) {
            return new String[]{
                "Warning!",
                "Your attendance has dropped to " + String.format("%.1f", pct) + "%",
                "Attend classes regularly, otherwise you may fall below required limits."
            };
        } else {
            return new String[]{
                "ALERT!",
                "Your attendance (" + String.format("%.1f", pct) + "%) is critically low!",
                "You are at risk of being detained from exams. Attend every class immediately!"
            };
        }
    }

    /**
     * Simple utility to fetch a dynamic quote to inspire students.
     */
    public String getRandomQuote() {
        String[] quotes = {
            "Consistency is the key to mastering your education.",
            "Eighty percent of success is showing up. - Woody Allen",
            "Punctuality is not about being on time, it's about respecting commitments.",
            "Your future is created by what you do today, not tomorrow.",
            "Every single lecture is a stepping stone to your career goals.",
            "Education is the passport to the future, and attendance is the stamp!"
        };
        int idx = (int) (Math.random() * quotes.length);
        return quotes[idx];
    }
}`
  },
  {
    name: "NotificationManager.java",
    path: "src/NotificationManager.java",
    description: "Custom modal components and visual dialogues mapping to standard Swing windows for notifications and startup messages.",
    code: `package src;

import javax.swing.*;
import java.awt.*;

/**
 * Smart Attendance Management System
 * NotificationManager.java - Custom Swing dialogue popups and panels.
 * Renders beautiful, colored message boxes instead of standard dull gray option panes.
 */
public class NotificationManager {

    /**
     * Displays a custom dialog for the daily startup reminder.
     */
    public static void showStartupReminder(JFrame parent) {
        JDialog dialog = new JDialog(parent, "Daily Alert", true);
        dialog.setSize(420, 270);
        dialog.setLocationRelativeTo(parent);

        // Custom panel inside the dialogue
        JPanel panel = new JPanel() {
            @Override
            protected void paintComponent(Graphics g) {
                Graphics2D g2d = (Graphics2D) g;
                g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
                // Create gradient background
                GradientPaint gp = new GradientPaint(0, 0, new Color(30, 41, 59), 0, getHeight(), new Color(15, 23, 42));
                g2d.setPaint(gp);
                g2d.fillRect(0, 0, getWidth(), getHeight());

                // Elegant blue border
                g2d.setColor(new Color(59, 130, 246));
                g2d.setStroke(new BasicStroke(3));
                g2d.drawRect(1, 1, getWidth() - 3, getHeight() - 3);
            }
        };
        panel.setLayout(new BorderLayout());
        panel.setBorder(BorderFactory.createEmptyBorder(20, 20, 20, 20));

        // Icon/Header label
        JLabel iconLabel = new JLabel("DAILY SYSTEM ALERTER", SwingConstants.CENTER);
        iconLabel.setFont(new Font("Segoe UI", Font.BOLD, 18));
        iconLabel.setForeground(new Color(56, 189, 248)); // Vibrant light blue
        panel.add(iconLabel, BorderLayout.NORTH);

        // Content Label (using HTML to prevent white background box rendering issues in custom Swing Look & Feels)
        String msg = "Don't forget to mark your attendance today.<br><br>" +
                     "Every single class matters for your grades and future!<br>" +
                     "Have a highly productive day ahead.";
        JLabel txt = new JLabel("<html><body style='width: 320px; text-align: center;'>" + msg + "</body></html>", SwingConstants.CENTER);
        txt.setFont(new Font("Segoe UI", Font.PLAIN, 14));
        txt.setForeground(Color.WHITE);

        panel.add(txt, BorderLayout.CENTER);

        // Modern "Let's Go!" Button
        JButton btn = new JButton("Get Started");
        btn.setFont(new Font("Segoe UI", Font.BOLD, 13));
        btn.setForeground(Color.WHITE);
        btn.setBackground(new Color(59, 130, 246));
        btn.setFocusPainted(false);
        btn.setBorder(BorderFactory.createEmptyBorder(10, 25, 10, 25));
        btn.setCursor(new Cursor(Cursor.HAND_CURSOR));
        btn.addActionListener(e -> dialog.dispose());

        JPanel btnPanel = new JPanel();
        btnPanel.setOpaque(false);
        btnPanel.add(btn);
        panel.add(btnPanel, BorderLayout.SOUTH);

        dialog.add(panel);
        dialog.setVisible(true);
    }

    /**
     * Standard notification toast with a custom color based on category.
     */
    public static void showNotification(JFrame parent, String title, String msg, Color color) {
        JDialog dialog = new JDialog(parent, title, true);
        dialog.setSize(420, 200);
        dialog.setLocationRelativeTo(parent);

        JPanel panel = new JPanel() {
            @Override
            protected void paintComponent(Graphics g) {
                Graphics2D g2d = (Graphics2D) g;
                g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
                g2d.setColor(new Color(30, 41, 59));
                g2d.fillRect(0, 0, getWidth(), getHeight());
                
                // Bottom colored status ribbon
                g2d.setColor(color);
                g2d.fillRect(0, getHeight() - 10, getWidth(), 10);
                g2d.drawRect(1, 1, getWidth() - 3, getHeight() - 3);
            }
        };
        panel.setLayout(new BorderLayout());
        panel.setBorder(BorderFactory.createEmptyBorder(15, 20, 15, 20));

        JLabel titleLbl = new JLabel(title);
        titleLbl.setFont(new Font("Segoe UI", Font.BOLD, 18));
        titleLbl.setForeground(color);
        panel.add(titleLbl, BorderLayout.NORTH);

        JLabel msgLbl = new JLabel("<html><body style='width: 300px;'>" + msg.replace("\n", "<br>") + "</body></html>");
        msgLbl.setFont(new Font("Segoe UI", Font.PLAIN, 13));
        msgLbl.setForeground(Color.WHITE);
        panel.add(msgLbl, BorderLayout.CENTER);

        JButton okBtn = new JButton("Dismiss");
        okBtn.setBackground(new Color(71, 85, 105));
        okBtn.setForeground(Color.WHITE);
        okBtn.setFont(new Font("Segoe UI", Font.BOLD, 12));
        okBtn.setFocusPainted(false);
        okBtn.setCursor(new Cursor(Cursor.HAND_CURSOR));
        okBtn.addActionListener(e -> dialog.dispose());

        JPanel sPanel = new JPanel(new FlowLayout(FlowLayout.RIGHT));
        sPanel.setOpaque(false);
        sPanel.add(okBtn);
        panel.add(sPanel, BorderLayout.SOUTH);

        dialog.add(panel);
        dialog.setVisible(true);
    }

    /**
     * Alias for showNotification to support compatibility.
     */
    public static void showCustomInfoMessage(JFrame parent, String title, String msg, Color color) {
        showNotification(parent, title, msg, color);
    }
}`
  },
  {
    name: "Login.java",
    path: "src/Login.java",
    description: "The premium student gatekeeper JFrame containing input wrappers, a show-password checkbox, and modern layout managers.",
    code: `package src;

import javax.swing.*;
import java.awt.*;
import java.awt.geom.RoundRectangle2D;

/**
 * Smart Attendance Management System
 * Login.java - Premium, responsive Swing login interface.
 * Implements standard features including hidden passwords, clean text boundaries,
 * exit hooks, and custom layouts.
 */
public class Login extends JFrame {
    private JTextField usernameField;
    private JPasswordField passwordField;
    private JCheckBox showPasswordCheckbox;
    private JButton loginButton;
    private JButton exitButton;

    public Login() {
        setTitle("SAMS - Login");
        setUndecorated(true); // Minimalist titlebar-free frame
        setSize(800, 500);
        setLocationRelativeTo(null);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);

        // Make window corners rounded
        setShape(new RoundRectangle2D.Double(0, 0, getWidth(), getHeight(), 24, 24));

        // Create main split workspace panel
        JPanel mainPanel = new JPanel(new GridLayout(1, 2));
        
        // 1. LEFT SIDE: Premium Logo and welcome banner panel with a gradient background
        JPanel leftPanel = new JPanel() {
            @Override
            protected void paintComponent(Graphics g) {
                Graphics2D g2d = (Graphics2D) g;
                g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
                // Dark Slate to Royal Blue Gradient
                GradientPaint gp = new GradientPaint(0, 0, new Color(30, 64, 175), getWidth(), getHeight(), new Color(15, 23, 42));
                g2d.setPaint(gp);
                g2d.fillRect(0, 0, getWidth(), getHeight());
            }
        };
        leftPanel.setLayout(new GridBagLayout());
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(10, 10, 10, 10);
        gbc.gridx = 0;

        // Visual Placeholder representing the College Logo
        JLabel logoLabel = new JLabel() {
            @Override
            protected void paintComponent(Graphics g) {
                Graphics2D g2d = (Graphics2D) g;
                g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
                g2d.setColor(new Color(255, 255, 255, 30));
                g2d.fillOval(0, 0, getWidth(), getHeight());
                
                g2d.setColor(Color.WHITE);
                g2d.setStroke(new BasicStroke(2));
                g2d.drawOval(5, 5, getWidth() - 10, getHeight() - 10);
                
                // Draw elegant vector graduation cap logo
                g2d.setColor(Color.WHITE);
                // Cap diamond top
                int[] xTop = {40, 62, 40, 18};
                int[] yTop = {22, 32, 42, 32};
                g2d.fillPolygon(xTop, yTop, 4);
                // Cap band
                g2d.fillRect(31, 32, 18, 9);
                // Cap tassel
                g2d.setColor(new Color(253, 224, 71)); // gold yellow tassel
                g2d.setStroke(new BasicStroke(2f));
                g2d.drawLine(40, 32, 23, 40);
                g2d.fillOval(20, 38, 5, 5);
            }
        };
        logoLabel.setPreferredSize(new Dimension(80, 80));
        gbc.gridy = 0;
        leftPanel.add(logoLabel, gbc);

        JLabel titleLabel = new JLabel("Smart Attendance", SwingConstants.CENTER);
        titleLabel.setFont(new Font("Segoe UI", Font.BOLD, 26));
        titleLabel.setForeground(Color.WHITE);
        gbc.gridy = 1;
        leftPanel.add(titleLabel, gbc);

        JLabel subLabel = new JLabel("MANAGEMENT SYSTEM", SwingConstants.CENTER);
        subLabel.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        subLabel.setForeground(new Color(147, 197, 253));
        gbc.gridy = 2;
        leftPanel.add(subLabel, gbc);

        JLabel descLabel = new JLabel("<html><center>An automated tool to track classes, analyze percentages, and secure compliance metrics instantly.</center></html>", SwingConstants.CENTER);
        descLabel.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        descLabel.setForeground(new Color(203, 213, 225));
        descLabel.setPreferredSize(new Dimension(280, 60));
        gbc.gridy = 3;
        leftPanel.add(descLabel, gbc);

        // 2. RIGHT SIDE: Clean user authentication input form panel
        JPanel rightPanel = new JPanel();
        rightPanel.setBackground(new Color(255, 255, 255));
        rightPanel.setLayout(new GridBagLayout());
        GridBagConstraints gbcForm = new GridBagConstraints();
        gbcForm.insets = new Insets(12, 20, 12, 20);
        gbcForm.fill = GridBagConstraints.HORIZONTAL;
        gbcForm.gridx = 0;

        // Heading
        JLabel welcomeLabel = new JLabel("Student Login");
        welcomeLabel.setFont(new Font("Segoe UI", Font.BOLD, 22));
        welcomeLabel.setForeground(new Color(30, 41, 59));
        welcomeLabel.setHorizontalAlignment(SwingConstants.CENTER);
        gbcForm.gridy = 0;
        rightPanel.add(welcomeLabel, gbcForm);

        // Username Field
        JPanel userWrapper = new JPanel(new BorderLayout(5, 5));
        userWrapper.setOpaque(false);
        JLabel userIcon = new JLabel("Username:");
        userIcon.setFont(new Font("Segoe UI", Font.BOLD, 12));
        userIcon.setForeground(new Color(100, 116, 139));
        usernameField = new JTextField("student123");
        usernameField.setPreferredSize(new Dimension(220, 36));
        usernameField.setFont(new Font("Segoe UI", Font.PLAIN, 13));
        usernameField.setBorder(BorderFactory.createCompoundBorder(
            BorderFactory.createLineBorder(new Color(203, 213, 225), 1, true),
            BorderFactory.createEmptyBorder(5, 10, 5, 10)
        ));
        userWrapper.add(userIcon, BorderLayout.NORTH);
        userWrapper.add(usernameField, BorderLayout.CENTER);
        gbcForm.gridy = 1;
        rightPanel.add(userWrapper, gbcForm);

        // Password Field
        JPanel passWrapper = new JPanel(new BorderLayout(5, 5));
        passWrapper.setOpaque(false);
        JLabel passIcon = new JLabel("Password:");
        passIcon.setFont(new Font("Segoe UI", Font.BOLD, 12));
        passIcon.setForeground(new Color(100, 116, 139));
        passwordField = new JPasswordField("password");
        passwordField.setPreferredSize(new Dimension(220, 36));
        passwordField.setFont(new Font("Segoe UI", Font.PLAIN, 13));
        passwordField.setBorder(BorderFactory.createCompoundBorder(
            BorderFactory.createLineBorder(new Color(203, 213, 225), 1, true),
            BorderFactory.createEmptyBorder(5, 10, 5, 10)
        ));
        passWrapper.add(passIcon, BorderLayout.NORTH);
        passWrapper.add(passwordField, BorderLayout.CENTER);
        gbcForm.gridy = 2;
        rightPanel.add(passWrapper, gbcForm);

        // Show Password Option Checkbox
        showPasswordCheckbox = new JCheckBox("Show Password");
        showPasswordCheckbox.setFont(new Font("Segoe UI", Font.PLAIN, 11));
        showPasswordCheckbox.setBackground(Color.WHITE);
        showPasswordCheckbox.setFocusPainted(false);
        showPasswordCheckbox.addActionListener(e -> {
            if (showPasswordCheckbox.isSelected()) {
                passwordField.setEchoChar((char) 0);
            } else {
                passwordField.setEchoChar('•');
            }
        });
        gbcForm.gridy = 3;
        rightPanel.add(showPasswordCheckbox, gbcForm);

        // Interactive Login & Exit buttons nested in a grid
        JPanel actionPanel = new JPanel(new GridLayout(1, 2, 10, 0));
        actionPanel.setOpaque(false);

        loginButton = new JButton("Login");
        loginButton.setFont(new Font("Segoe UI", Font.BOLD, 13));
        loginButton.setForeground(Color.WHITE);
        loginButton.setBackground(new Color(30, 64, 175)); // Royal Blue
        loginButton.setFocusPainted(false);
        loginButton.setCursor(new Cursor(Cursor.HAND_CURSOR));
        loginButton.setBorder(BorderFactory.createEmptyBorder(10, 10, 10, 10));

        exitButton = new JButton("Exit");
        exitButton.setFont(new Font("Segoe UI", Font.BOLD, 13));
        exitButton.setForeground(new Color(100, 116, 139));
        exitButton.setBackground(new Color(241, 245, 249));
        exitButton.setFocusPainted(false);
        exitButton.setCursor(new Cursor(Cursor.HAND_CURSOR));
        exitButton.setBorder(BorderFactory.createEmptyBorder(10, 10, 10, 10));

        actionPanel.add(loginButton);
        actionPanel.add(exitButton);
        gbcForm.gridy = 4;
        rightPanel.add(actionPanel, gbcForm);

        // Hook Interactive event handling
        loginButton.addActionListener(e -> authenticateAndProceed());
        exitButton.addActionListener(e -> System.exit(0));

        // Assemble Panels
        mainPanel.add(leftPanel);
        mainPanel.add(rightPanel);
        add(mainPanel);
    }

    /**
     * Conducts validation and boots up Dashboard Frame.
     */
    private void authenticateAndProceed() {
        String u = usernameField.getText().trim();
        String p = new String(passwordField.getPassword());

        if (u.equals("student123") && p.equals("password")) {
            this.dispose();
            SwingUtilities.invokeLater(() -> {
                Dashboard db = new Dashboard();
                db.setVisible(true);
                // Trigger the Good Morning greeting box!
                NotificationManager.showStartupReminder(db);
            });
        } else {
            JOptionPane.showMessageDialog(
                this, 
                "Error! Invalid Username or Password.\nHint: Use student123 & password", 
                "Authentication Failed", 
                JOptionPane.ERROR_MESSAGE
            );
        }
    }
}`
  },
  {
    name: "Dashboard.java",
    path: "src/Dashboard.java",
    description: "The layout master coordinates the user environment, updates active states in the header, implements the sidebar control deck, and handles panel swapping.",
    code: `package src;

import javax.swing.*;
import java.awt.*;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Smart Attendance Management System
 * Dashboard.java - The Central Control Console Frame of SAMS.
 * Implements a modern multi-view interface with side menu navigation,
 * dynamic status cards, high-contrast layouts, and a Live thread-based Clock.
 */
public class Dashboard extends JFrame {
    private final AttendanceManager manager;
    private Color currentThemeColor = new Color(30, 64, 175); // Primary Theme Color

    // Panels mapped for swapping
    private final JPanel mainContainer;
    private final CardLayout cardLayout;

    // References to dashboard UI components to refresh them dynamically
    private JLabel timeLabel;
    private JLabel dateLabel;
    private JLabel pctLabel;
    private JLabel attendedLabel;
    private JLabel missedLabel;
    private JLabel quoteLabel;
    private JProgressBar attendanceBar;
    private JPanel notificationPanel;
    private JLabel notificationTitle;
    private JLabel notificationDesc;

    public Dashboard() {
        manager = new AttendanceManager();
        
        setTitle("SAMS - Student Dashboard");
        setSize(1100, 700);
        setLocationRelativeTo(null);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);

        // Core Layout structure: LEFT (Sidebar), CENTER (Main Swappable Panels)
        JPanel windowPanel = new JPanel(new BorderLayout());
        
        // 1. SIDEBAR MENU
        JPanel sidebar = createSidebar();
        windowPanel.add(sidebar, BorderLayout.WEST);

        // 2. MAIN CENTER SWAP CONTAINER
        cardLayout = new CardLayout();
        mainContainer = new JPanel(cardLayout);

        // Create individual panels and register inside layout deck
        mainContainer.add(createDashboardMainPanel(), "DashboardView");
        mainContainer.add(createAttendanceEntryPanel(), "AttendanceView");
        mainContainer.add(new HistoryPanel(manager), "HistoryView");
        mainContainer.add(createProfilePanel(), "ProfileView");
        mainContainer.add(new SettingsPanel(this), "SettingsView");
        mainContainer.add(createAboutPanel(), "AboutView");

        windowPanel.add(mainContainer, BorderLayout.CENTER);
        add(windowPanel);

        // Boot Thread-safe Live Clock immediately
        startClockTimer();
    }

    /**
     * Builds Sidebar with navigational links.
     */
    private JPanel createSidebar() {
        JPanel sidebar = new JPanel() {
            @Override
            protected void paintComponent(Graphics g) {
                Graphics2D g2d = (Graphics2D) g;
                g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
                GradientPaint gp = new GradientPaint(0, 0, new Color(15, 23, 42), getWidth(), getHeight(), new Color(30, 41, 59));
                g2d.setPaint(gp);
                g2d.fillRect(0, 0, getWidth(), getHeight());
            }
        };
        sidebar.setPreferredSize(new Dimension(240, 700));
        sidebar.setLayout(new GridBagLayout());
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(8, 15, 8, 15);
        gbc.fill = GridBagConstraints.HORIZONTAL;
        gbc.gridx = 0;

        // Top Portal Title Icon
        JLabel headerIcon = new JLabel("SAMS Portal");
        headerIcon.setFont(new Font("Segoe UI", Font.BOLD, 18));
        headerIcon.setForeground(Color.WHITE);
        headerIcon.setHorizontalAlignment(SwingConstants.CENTER);
        gbc.gridy = 0;
        sidebar.add(headerIcon, gbc);

        // Separator line
        JSeparator sep = new JSeparator();
        sep.setForeground(new Color(51, 65, 85));
        gbc.gridy = 1;
        sidebar.add(sep, gbc);

        // Create navigational items
        String[] menus = {"Dashboard", "Attendance", "Attendance History", "Profile", "Settings", "About"};
        String[] icons = {"» ", "» ", "» ", "» ", "» ", "» "};
        String[] targets = {"DashboardView", "AttendanceView", "HistoryView", "ProfileView", "SettingsView", "AboutView"};

        for (int i = 0; i < menus.length; i++) {
            final String target = targets[i];
            JButton btn = new JButton(icons[i] + menus[i]);
            btn.setFont(new Font("Segoe UI", Font.BOLD, 13));
            btn.setForeground(new Color(203, 213, 225));
            btn.setBackground(new Color(255, 255, 255, 10));
            btn.setFocusPainted(false);
            btn.setBorder(BorderFactory.createEmptyBorder(12, 15, 12, 15));
            btn.setHorizontalAlignment(SwingConstants.LEFT);
            btn.setCursor(new Cursor(Cursor.HAND_CURSOR));

            // Hover and Activation styling
            btn.addMouseListener(new java.awt.event.MouseAdapter() {
                @Override
                public void mouseEntered(java.awt.event.MouseEvent evt) {
                    btn.setBackground(new Color(255, 255, 255, 20));
                    btn.setForeground(Color.WHITE);
                }
                @Override
                public void mouseExited(java.awt.event.MouseEvent evt) {
                    btn.setBackground(new Color(255, 255, 255, 10));
                    btn.setForeground(new Color(203, 213, 225));
                }
            });

            btn.addActionListener(e -> {
                cardLayout.show(mainContainer, target);
                refreshDashboardData(); // Refresh values if we swap back to main
            });

            gbc.gridy = i + 2;
            sidebar.add(btn, gbc);
        }

        // Push Logout Button to extreme bottom
        gbc.weighty = 1.0;
        gbc.gridy = 10;
        sidebar.add(Box.createVerticalGlue(), gbc);

        JButton logoutBtn = new JButton("Logout");
        logoutBtn.setFont(new Font("Segoe UI", Font.BOLD, 13));
        logoutBtn.setForeground(new Color(239, 68, 68)); // High-alert red
        logoutBtn.setBackground(new Color(239, 68, 68, 20));
        logoutBtn.setBorder(BorderFactory.createEmptyBorder(12, 15, 12, 15));
        logoutBtn.setHorizontalAlignment(SwingConstants.LEFT);
        logoutBtn.setCursor(new Cursor(Cursor.HAND_CURSOR));
        logoutBtn.addActionListener(e -> confirmLogout());

        gbc.weighty = 0.0;
        gbc.gridy = 11;
        sidebar.add(logoutBtn, gbc);

        return sidebar;
    }

    /**
     * Renders primary Dashboard panel.
     */
    private JPanel createDashboardMainPanel() {
        JPanel dPanel = new JPanel(new BorderLayout());
        dPanel.setBackground(new Color(248, 250, 252)); // Sleek off-white

        // 1. TOP DOCK: Welcome greeting, Live Clock
        JPanel topDock = new JPanel(new BorderLayout(10, 10));
        topDock.setBackground(Color.WHITE);
        topDock.setBorder(BorderFactory.createEmptyBorder(15, 25, 15, 25));

        JPanel welcomeWrapper = new JPanel(new GridLayout(2, 1));
        welcomeWrapper.setOpaque(false);
        JLabel welcomeLbl = new JLabel("Welcome Student, " + manager.getCurrentStudent().getName() + "!");
        welcomeLbl.setFont(new Font("Segoe UI", Font.BOLD, 22));
        welcomeLbl.setForeground(new Color(15, 23, 42));
        
        // Random Quote
        quoteLabel = new JLabel("\"" + manager.getRandomQuote() + "\"");
        quoteLabel.setFont(new Font("Segoe UI", Font.ITALIC, 12));
        quoteLabel.setForeground(new Color(100, 116, 139));
        welcomeWrapper.add(welcomeLbl);
        welcomeWrapper.add(quoteLabel);

        JPanel clockWrapper = new JPanel(new GridLayout(2, 1, 0, 2));
        clockWrapper.setOpaque(false);
        timeLabel = new JLabel("00:00:00 PM", SwingConstants.RIGHT);
        timeLabel.setFont(new Font("Consolas", Font.BOLD, 18));
        timeLabel.setForeground(currentThemeColor);
        
        dateLabel = new JLabel("Thursday, July 2, 2026", SwingConstants.RIGHT);
        dateLabel.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        dateLabel.setForeground(new Color(100, 116, 139));
        clockWrapper.add(timeLabel);
        clockWrapper.add(dateLabel);

        topDock.add(welcomeWrapper, BorderLayout.WEST);
        topDock.add(clockWrapper, BorderLayout.EAST);
        dPanel.add(topDock, BorderLayout.NORTH);

        // 2. MAIN SCROLL BODY (Bento Card Grids)
        JPanel scrollBody = new JPanel();
        scrollBody.setLayout(new GridBagLayout());
        scrollBody.setBackground(new Color(248, 250, 252));
        scrollBody.setBorder(BorderFactory.createEmptyBorder(20, 25, 20, 25));
        GridBagConstraints bGbc = new GridBagConstraints();
        bGbc.insets = new Insets(10, 10, 10, 10);
        bGbc.fill = GridBagConstraints.BOTH;

        // Metric Card A: Attendance Percentage Ring
        JPanel cardPct = createModernMetricCard("ATTENDANCE STATE", "0.0%", "Percent Meter", new Color(30, 64, 175), 1);
        bGbc.gridx = 0; bGbc.gridy = 0; bGbc.weightx = 1.0; bGbc.weighty = 0.4;
        scrollBody.add(cardPct, bGbc);

        // Metric Card B: Attended classes
        JPanel cardAttended = createModernMetricCard("CLASSES ATTENDED", "0 Classes", "Total recorded presence", new Color(34, 197, 94), 2);
        bGbc.gridx = 1; bGbc.gridy = 0; bGbc.weightx = 1.0;
        scrollBody.add(cardAttended, bGbc);

        // Metric Card C: Missed Classes
        JPanel cardMissed = createModernMetricCard("CLASSES MISSED", "0 Classes", "Absence footprint", new Color(239, 68, 68), 3);
        bGbc.gridx = 2; bGbc.gridy = 0; bGbc.weightx = 1.0;
        scrollBody.add(cardMissed, bGbc);

        // ROW 1: Smart dynamic Notification panel & Pie Chart
        notificationPanel = new JPanel() {
            @Override
            protected void paintComponent(Graphics g) {
                Graphics2D g2d = (Graphics2D) g;
                g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
                g2d.setColor(Color.WHITE);
                g2d.fillRoundRect(0, 0, getWidth(), getHeight(), 16, 16);
                g2d.setColor(new Color(241, 245, 249));
                g2d.drawRoundRect(0, 0, getWidth() - 1, getHeight() - 1, 16, 16);
            }
        };
        notificationPanel.setLayout(new BorderLayout());
        notificationPanel.setBorder(BorderFactory.createEmptyBorder(20, 20, 20, 20));

        JLabel notifyHeader = new JLabel("SYSTEM NOTIFICATION");
        notifyHeader.setFont(new Font("Segoe UI", Font.BOLD, 12));
        notifyHeader.setForeground(new Color(100, 116, 139));
        notificationPanel.add(notifyHeader, BorderLayout.NORTH);

        JPanel textWrapper = new JPanel(new GridLayout(2, 1, 5, 5));
        textWrapper.setOpaque(false);
        notificationTitle = new JLabel("Initial status Loading...");
        notificationTitle.setFont(new Font("Segoe UI", Font.BOLD, 18));
        notificationDesc = new JLabel("Computing classes and records logs.");
        notificationDesc.setFont(new Font("Segoe UI", Font.PLAIN, 13));
        notificationDesc.setForeground(new Color(100, 116, 139));
        textWrapper.add(notificationTitle);
        textWrapper.add(notificationDesc);
        notificationPanel.add(textWrapper, BorderLayout.CENTER);

        // Custom Attendance Progress Bar
        attendanceBar = new JProgressBar(0, 100);
        attendanceBar.setPreferredSize(new Dimension(300, 18));
        attendanceBar.setStringPainted(true);
        attendanceBar.setFont(new Font("Segoe UI", Font.BOLD, 11));
        notificationPanel.add(attendanceBar, BorderLayout.SOUTH);

        bGbc.gridx = 0; bGbc.gridy = 1; bGbc.gridwidth = 2; bGbc.weightx = 2.0; bGbc.weighty = 0.6;
        scrollBody.add(notificationPanel, bGbc);

        // custom Pie Chart Canvas Panel
        JPanel chartCard = new JPanel(new BorderLayout()) {
            @Override
            protected void paintComponent(Graphics g) {
                Graphics2D g2d = (Graphics2D) g;
                g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
                g2d.setColor(Color.WHITE);
                g2d.fillRoundRect(0, 0, getWidth(), getHeight(), 16, 16);
                g2d.setColor(new Color(241, 245, 249));
                g2d.drawRoundRect(0, 0, getWidth() - 1, getHeight() - 1, 16, 16);

                // Render customized Pie Chart inside canvas
                int cx = getWidth() / 2 - 60;
                int cy = getHeight() / 2 - 40;
                int diameter = 110;

                double attendanceRate = manager.getCurrentStudent().getAttendancePercentage();
                int presentAngle = (int) Math.round((attendanceRate / 100.0) * 360);
                int absentAngle = 360 - presentAngle;

                // Present sector (Green)
                g2d.setColor(new Color(34, 197, 94));
                g2d.fillArc(cx, cy, diameter, diameter, 0, presentAngle);

                // Absent sector (Red)
                if (absentAngle > 0 && manager.getCurrentStudent().getTotalClasses() > 0) {
                    g2d.setColor(new Color(239, 68, 68));
                    g2d.fillArc(cx, cy, diameter, diameter, presentAngle, absentAngle);
                }

                // Legend layout details
                g2d.setFont(new Font("Segoe UI", Font.BOLD, 11));
                g2d.setColor(new Color(34, 197, 94));
                g2d.fillRect(20, getHeight() - 35, 12, 12);
                g2d.drawString("Present (" + String.format("%.1f", attendanceRate) + "%)", 40, getHeight() - 25);

                g2d.setColor(new Color(239, 68, 68));
                g2d.fillRect(getWidth() - 140, getHeight() - 35, 12, 12);
                g2d.drawString("Absent (" + String.format("%.1f", 100 - attendanceRate) + "%)", getWidth() - 120, getHeight() - 25);
            }
        };
        chartCard.setBorder(BorderFactory.createEmptyBorder(15, 20, 15, 20));
        JLabel chartTitle = new JLabel("ATTENDANCE SPLIT");
        chartTitle.setFont(new Font("Segoe UI", Font.BOLD, 12));
        chartTitle.setForeground(new Color(100, 116, 139));
        chartCard.add(chartTitle, BorderLayout.NORTH);

        bGbc.gridx = 2; bGbc.gridy = 1; bGbc.gridwidth = 1; bGbc.weightx = 1.0;
        scrollBody.add(chartCard, bGbc);

        dPanel.add(scrollBody, BorderLayout.CENTER);
        
        // Populate current system data
        refreshDashboardData();
        return dPanel;
    }

    /**
     * Attendance entry panel featuring big buttons to increment metrics.
     */
    private JPanel createAttendanceEntryPanel() {
        JPanel aPanel = new JPanel(new GridBagLayout());
        aPanel.setBackground(Color.WHITE);
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(15, 15, 15, 15);
        gbc.fill = GridBagConstraints.BOTH;

        JLabel title = new JLabel("Mark Today's Attendance", SwingConstants.CENTER);
        title.setFont(new Font("Segoe UI", Font.BOLD, 24));
        title.setForeground(new Color(15, 23, 42));
        gbc.gridx = 0; gbc.gridy = 0; gbc.gridwidth = 2; gbc.weighty = 0.1;
        aPanel.add(title, gbc);

        JLabel sub = new JLabel("<html><center>Keep your records accurate and consistent. Attendance decisions cannot be undone after submission!</center></html>", SwingConstants.CENTER);
        sub.setFont(new Font("Segoe UI", Font.PLAIN, 13));
        sub.setForeground(new Color(100, 116, 139));
        gbc.gridy = 1; gbc.weighty = 0.1;
        aPanel.add(sub, gbc);

        // Huge Action Cards
        JButton presentBtn = new JButton("<html><center><font size='6'>✔</font><br><br><b>MARK PRESENT</b><br><font size='3'>Attended Class</font></center></html>");
        presentBtn.setFont(new Font("Segoe UI", Font.PLAIN, 14));
        presentBtn.setForeground(Color.WHITE);
        presentBtn.setBackground(new Color(34, 197, 94)); // Emerald Green
        presentBtn.setFocusPainted(false);
        presentBtn.setCursor(new Cursor(Cursor.HAND_CURSOR));
        presentBtn.setBorder(BorderFactory.createEmptyBorder(30, 20, 30, 20));
        presentBtn.addActionListener(e -> {
            manager.recordAttendance(true);
            refreshDashboardData();
            NotificationManager.showNotification(this, "Attendance Logged", "You marked yourself Present. Keep up the punctuality!", new Color(34, 197, 94));
        });

        JButton absentBtn = new JButton("<html><center><font size='6'>✘</font><br><br><b>MARK ABSENT</b><br><font size='3'>Missed Class</font></center></html>");
        absentBtn.setFont(new Font("Segoe UI", Font.PLAIN, 14));
        absentBtn.setForeground(Color.WHITE);
        absentBtn.setBackground(new Color(239, 68, 68)); // Crimson Red
        absentBtn.setFocusPainted(false);
        absentBtn.setCursor(new Cursor(Cursor.HAND_CURSOR));
        absentBtn.setBorder(BorderFactory.createEmptyBorder(30, 20, 30, 20));
        absentBtn.addActionListener(e -> {
            manager.recordAttendance(false);
            refreshDashboardData();
            NotificationManager.showNotification(this, "Absence Recorded", "You marked yourself Absent. Review warning triggers if metrics drop!", new Color(239, 68, 68));
        });

        gbc.gridy = 2; gbc.gridwidth = 1; gbc.weightx = 1.0; gbc.weighty = 0.6;
        gbc.gridx = 0;
        aPanel.add(presentBtn, gbc);

        gbc.gridx = 1;
        aPanel.add(absentBtn, gbc);

        // Prompt user details
        JPanel summaryBox = new JPanel(new FlowLayout(FlowLayout.CENTER, 30, 10));
        summaryBox.setOpaque(false);
        JLabel tipLabel = new StringBuilder("Formula: (Attended / Total) × 100") != null ? new JLabel("Formula: (Attended / Total) × 100") : null;
        tipLabel.setFont(new Font("Segoe UI", Font.ITALIC, 12));
        tipLabel.setForeground(new Color(100, 116, 139));
        summaryBox.add(tipLabel);
        gbc.gridy = 3; gbc.gridwidth = 2; gbc.weighty = 0.1; gbc.gridx = 0;
        aPanel.add(summaryBox, gbc);

        return aPanel;
    }

    /**
     * Student Profile Card panel.
     */
    private JPanel createProfilePanel() {
        JPanel pPanel = new JPanel(new BorderLayout());
        pPanel.setBackground(new Color(241, 245, 249));

        JPanel card = new JPanel() {
            @Override
            protected void paintComponent(Graphics g) {
                Graphics2D g2d = (Graphics2D) g;
                g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
                g2d.setColor(Color.WHITE);
                g2d.fillRoundRect(0, 0, getWidth(), getHeight(), 20, 20);
                g2d.setColor(new Color(226, 232, 240));
                g2d.drawRoundRect(0, 0, getWidth() - 1, getHeight() - 1, 20, 20);
            }
        };
        card.setLayout(new GridBagLayout());
        card.setBorder(BorderFactory.createEmptyBorder(30, 30, 30, 30));
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(10, 15, 10, 15);
        gbc.anchor = GridBagConstraints.WEST;

        // Photo Placeholder Circle
        JLabel photo = new JLabel() {
            @Override
            protected void paintComponent(Graphics g) {
                Graphics2D g2d = (Graphics2D) g;
                g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
                g2d.setColor(new Color(241, 245, 249));
                g2d.fillOval(0, 0, getWidth(), getHeight());
                g2d.setColor(currentThemeColor);
                g2d.setStroke(new BasicStroke(2));
                g2d.drawOval(2, 2, getWidth() - 5, getHeight() - 5);
                
                // Draw elegant vector student avatar profile picture
                g2d.setColor(new Color(203, 213, 225)); // Silver/grey for head/shoulders
                // Head
                g2d.fillOval(35, 26, 30, 30);
                // Body/Shoulders
                g2d.fillArc(20, 56, 60, 50, 0, 180);
                
                // Draw a beautiful small graduation cap on the head
                g2d.setColor(currentThemeColor);
                // Cap diamond top
                int[] xPoints = {50, 68, 50, 32};
                int[] yPoints = {18, 25, 32, 25};
                g2d.fillPolygon(xPoints, yPoints, 4);
                // Cap band
                g2d.fillRect(43, 25, 14, 5);
                // Cap tassel
                g2d.setColor(new Color(245, 158, 11)); // gold tassel
                g2d.setStroke(new BasicStroke(1.5f));
                g2d.drawLine(50, 25, 36, 30);
                g2d.fillOval(34, 29, 4, 4);
            }
        };
        photo.setPreferredSize(new Dimension(100, 100));
        gbc.gridx = 0; gbc.gridy = 0; gbc.gridheight = 2;
        card.add(photo, gbc);

        // Student Basic Meta
        Student s = manager.getCurrentStudent();
        JLabel nameLbl = new JLabel(s.getName());
        nameLbl.setFont(new Font("Segoe UI", Font.BOLD, 24));
        nameLbl.setForeground(new Color(15, 23, 42));
        gbc.gridx = 1; gbc.gridy = 0; gbc.gridheight = 1;
        card.add(nameLbl, gbc);

        JLabel rollLbl = new JLabel("ID: " + s.getRollNumber() + " | " + s.getSection());
        rollLbl.setFont(new Font("Segoe UI", Font.PLAIN, 13));
        rollLbl.setForeground(new Color(100, 116, 139));
        gbc.gridy = 1;
        card.add(rollLbl, gbc);

        JSeparator sep = new JSeparator();
        sep.setForeground(new Color(226, 232, 240));
        gbc.gridx = 0; gbc.gridy = 2; gbc.gridwidth = 2; gbc.fill = GridBagConstraints.HORIZONTAL;
        card.add(sep, gbc);

        // Details grid list mapping attributes
        String[][] data = {
            {"Course Program:", s.getCourse()},
            {"Semester:", s.getSemester()},
            {"Enrolled Section:", s.getSection()},
            {"Status Rank:", "Active Student"}
        };

        gbc.gridwidth = 1;
        gbc.fill = GridBagConstraints.NONE;
        for (int i = 0; i < data.length; i++) {
            JLabel propLabel = new JLabel(data[i][0]);
            propLabel.setFont(new Font("Segoe UI", Font.BOLD, 13));
            propLabel.setForeground(new Color(71, 85, 105));
            gbc.gridx = 0; gbc.gridy = 3 + i;
            card.add(propLabel, gbc);

            JLabel valLabel = new JLabel(data[i][1]);
            valLabel.setFont(new Font("Segoe UI", Font.PLAIN, 14));
            valLabel.setForeground(new Color(15, 23, 42));
            gbc.gridx = 1;
            card.add(valLabel, gbc);
        }

        JPanel centerWrapper = new JPanel(new GridBagLayout());
        centerWrapper.setOpaque(false);
        centerWrapper.add(card);
        pPanel.add(centerWrapper, BorderLayout.CENTER);

        return pPanel;
    }

    /**
     * System About view panel.
     */
    private JPanel createAboutPanel() {
        JPanel abPanel = new JPanel(new GridBagLayout());
        abPanel.setBackground(Color.WHITE);
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(10, 10, 10, 10);
        gbc.fill = GridBagConstraints.HORIZONTAL;
        gbc.gridx = 0;

        JLabel title = new JLabel("Smart Attendance System");
        title.setFont(new Font("Segoe UI", Font.BOLD, 22));
        title.setForeground(currentThemeColor);
        title.setHorizontalAlignment(SwingConstants.CENTER);
        gbc.gridy = 0;
        abPanel.add(title, gbc);

        JLabel version = new JLabel("Version 1.0 (Minor Training Project Demo)");
        version.setFont(new Font("Segoe UI", Font.PLAIN, 11));
        version.setForeground(new Color(148, 163, 184));
        version.setHorizontalAlignment(SwingConstants.CENTER);
        gbc.gridy = 1;
        abPanel.add(version, gbc);

        JSeparator s = new JSeparator();
        s.setForeground(new Color(241, 245, 249));
        gbc.gridy = 2;
        abPanel.add(s, gbc);

        JTextArea info = new JTextArea(
            "This application is designed specifically as a 1-month college student training minor project.\n\n" +
            "Key Architectural Highlights:\n" +
            "• Pure Object-Oriented Design in Java Swing (Encapsulation, File I/O, Serialization, Exception handling).\n" +
            "• Zero Database Configuration: Powered by serialized local files (student_profile.dat and attendance_history.txt) making it runnable instantly on any platform.\n" +
            "• Dynamic color brackets corresponding to standard compliance thresholds.\n" +
            "• Customizable visual theme managers and vector based pie chart diagrams."
        );
        info.setFont(new Font("Segoe UI", Font.PLAIN, 13));
        info.setForeground(new Color(71, 85, 105));
        info.setEditable(false);
        info.setOpaque(false);
        info.setWrapStyleWord(true);
        info.setLineWrap(true);
        gbc.gridy = 3;
        abPanel.add(info, gbc);

        return abPanel;
    }

    /**
     * Prompt dialog before closing context.
     */
    public void confirmLogout() {
        int choice = JOptionPane.showConfirmDialog(
            this,
            "Are you sure you want to logout from the Smart Attendance Portal?",
            "Confirm Logout",
            JOptionPane.YES_NO_OPTION,
            JOptionPane.QUESTION_MESSAGE
        );

        if (choice == JOptionPane.YES_OPTION) {
            this.dispose();
            SwingUtilities.invokeLater(() -> {
                new Login().setVisible(true);
            });
        }
    }

    /**
     * Refreshes the metrics variables and widgets inside dashboard main views.
     */
    public void refreshDashboardData() {
        if (manager == null) return;
        Student s = manager.getCurrentStudent();
        if (s == null) return;
        double pct = s.getAttendancePercentage();
        Color statusColor = manager.getStatusColor();

        // Refresh text boxes safely
        if (pctLabel != null) pctLabel.setText(String.format("%.1f%%", pct));
        if (attendedLabel != null) attendedLabel.setText(s.getAttendedClasses() + " / " + s.getTotalClasses() + " Lectures");
        if (missedLabel != null) missedLabel.setText((s.getTotalClasses() - s.getAttendedClasses()) + " Lectures");
        if (quoteLabel != null) quoteLabel.setText("\"" + manager.getRandomQuote() + "\"");

        // Dynamic Progress bar update
        if (attendanceBar != null) {
            attendanceBar.setValue((int) pct);
            attendanceBar.setForeground(statusColor);
        }

        // Dynamic System notifications text based on calculations
        String[] logs = manager.getMotivationalMessage();
        if (logs != null && logs.length >= 3) {
            if (notificationTitle != null) {
                notificationTitle.setText(logs[0]);
                notificationTitle.setForeground(statusColor);
            }
            if (notificationDesc != null) {
                notificationDesc.setText("<html><body>" + logs[1] + "<br>" + logs[2] + "</body></html>");
            }
        }

        // Repaint dashboard to redraw canvas pie chart with new values
        this.repaint();
    }

    /**
     * Helper to create styled metric boxes.
     * cardType mapping: 1 = pctLabel, 2 = attendedLabel, 3 = missedLabel
     */
    private JPanel createModernMetricCard(String title, String mainText, String footnote, Color headerColor, int cardType) {
        JPanel card = new JPanel() {
            @Override
            protected void paintComponent(Graphics g) {
                Graphics2D g2d = (Graphics2D) g;
                g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
                g2d.setColor(Color.WHITE);
                g2d.fillRoundRect(0, 0, getWidth(), getHeight(), 16, 16);
                g2d.setColor(new Color(241, 245, 249));
                g2d.drawRoundRect(0, 0, getWidth() - 1, getHeight() - 1, 16, 16);
            }
        };
        card.setLayout(new BorderLayout(5, 5));
        card.setBorder(BorderFactory.createEmptyBorder(15, 18, 15, 18));

        JLabel tLbl = new JLabel(title);
        tLbl.setFont(new Font("Segoe UI", Font.BOLD, 11));
        tLbl.setForeground(new Color(148, 163, 184));
        card.add(tLbl, BorderLayout.NORTH);

        JLabel mText = new JLabel(mainText);
        mText.setFont(new Font("Segoe UI", Font.BOLD, 22));
        mText.setForeground(headerColor);
        
        // Explicit non-fragile mapping independent of title string language/casing
        switch (cardType) {
            case 1:
                pctLabel = mText;
                break;
            case 2:
                attendedLabel = mText;
                break;
            case 3:
                missedLabel = mText;
                break;
            default:
                break;
        }

        card.add(mText, BorderLayout.CENTER);

        JLabel fText = new JLabel(footnote);
        fText.setFont(new Font("Segoe UI", Font.PLAIN, 11));
        fText.setForeground(new Color(100, 116, 139));
        card.add(fText, BorderLayout.SOUTH);

        return card;
    }

    /**
     * Swing Theme configuration mutator trigger.
     */
    public void updateApplicationTheme(Color newTheme, String themeName) {
        this.currentThemeColor = newTheme;
        timeLabel.setForeground(newTheme);
        refreshDashboardData();
        JOptionPane.showMessageDialog(this, "Application Theme successfully switched to: " + themeName, "Theme Updated", JOptionPane.INFORMATION_MESSAGE);
    }

    /**
     * Swing-safe, thread-safe Clock timer using javax.swing.Timer.
     */
    private void startClockTimer() {
        SimpleDateFormat tf = new SimpleDateFormat("hh:mm:ss a");
        SimpleDateFormat df = new SimpleDateFormat("EEEE, MMMM d, yyyy");
        Timer timer = new Timer(1000, e -> {
            timeLabel.setText(tf.format(new Date()));
            dateLabel.setText(df.format(new Date()));
        });
        timer.start();
    }
}`
  },
  {
    name: "HistoryPanel.java",
    path: "src/HistoryPanel.java",
    description: "The historical database log sheet custom JPanel that reads CSV entries and populates a high-contrast Swing JTable.",
    code: `package src;

import javax.swing.*;
import javax.swing.table.DefaultTableCellRenderer;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.util.ArrayList;

/**
 * Smart Attendance Management System
 * HistoryPanel.java - Visualizes local history logs in a high-contrast JTable.
 * Implements customized cell renderers to highlight attendance records.
 */
public class HistoryPanel extends JPanel {
    private AttendanceManager manager;
    private JTable historyTable;
    private DefaultTableModel tableModel;

    public HistoryPanel(AttendanceManager manager) {
        this.manager = manager;
        setLayout(new BorderLayout());
        setBackground(Color.WHITE);
        setBorder(BorderFactory.createEmptyBorder(20, 25, 20, 25));

        // 1. Panel Header
        JPanel header = new JPanel(new BorderLayout());
        header.setOpaque(false);
        JLabel title = new JLabel("Attendance Log Ledger");
        title.setFont(new Font("Segoe UI", Font.BOLD, 20));
        title.setForeground(new Color(15, 23, 42));
        header.add(title, BorderLayout.WEST);

        // Interactive Reset Log Button
        JButton resetBtn = new JButton("Reset History logs");
        resetBtn.setFont(new Font("Segoe UI", Font.BOLD, 12));
        resetBtn.setForeground(Color.WHITE);
        resetBtn.setBackground(new Color(239, 68, 68)); // Dangerous Red
        resetBtn.setFocusPainted(false);
        resetBtn.setCursor(new Cursor(Cursor.HAND_CURSOR));
        resetBtn.addActionListener(e -> triggerHistoryWipe());
        header.add(resetBtn, BorderLayout.EAST);

        add(header, BorderLayout.NORTH);

        // 2. Table Column Headings setup
        String[] columns = {"Log Date", "Marked Status", "Attended classes", "Total classes", "Compliance rate"};
        tableModel = new DefaultTableModel(columns, 0) {
            @Override
            public boolean isCellEditable(int row, int col) {
                return false; // Immutable cells
            }
        };

        historyTable = new JTable(tableModel);
        historyTable.setFont(new Font("Segoe UI", Font.PLAIN, 13));
        historyTable.setRowHeight(32);
        historyTable.setGridColor(new Color(241, 245, 249));
        historyTable.getTableHeader().setFont(new Font("Segoe UI", Font.BOLD, 13));
        historyTable.getTableHeader().setBackground(new Color(241, 245, 249));
        historyTable.getTableHeader().setForeground(new Color(71, 85, 105));

        // Apply Custom Colored Row Cell Renderer for High Compliance visual contrast
        historyTable.setDefaultRenderer(Object.class, new AttendanceRowRenderer());

        JScrollPane pane = new JScrollPane(historyTable);
        pane.setBorder(BorderFactory.createLineBorder(new Color(226, 232, 240), 1, true));
        add(pane, BorderLayout.CENTER);

        // Load CSV elements
        refreshHistoryLogs();
    }

    /**
     * Wipes text logs and refreshes frame fields.
     */
    private void triggerHistoryWipe() {
        int choice = JOptionPane.showConfirmDialog(
            this,
            "Are you sure you want to permanently delete all local attendance logs?\nThis reset cannot be undone.",
            "Wipe Local Files",
            JOptionPane.YES_NO_OPTION,
            JOptionPane.WARNING_MESSAGE
        );

        if (choice == JOptionPane.YES_OPTION) {
            FileManager.resetAllData();
            // Create clean user model
            Student defaultStudent = new Student();
            defaultStudent.setAttendedClasses(0);
            defaultStudent.setTotalClasses(0);
            FileManager.saveStudentData(defaultStudent);
            
            // Sync values
            refreshHistoryLogs();
            
            // Refresh parent reference frame
            Window window = SwingUtilities.getWindowAncestor(this);
            if (window instanceof Dashboard) {
                Dashboard db = (Dashboard) window;
                db.getCurrentStudent().setAttendedClasses(0);
                db.getCurrentStudent().setTotalClasses(0);
                db.refreshDashboardData();
            }

            JOptionPane.showMessageDialog(this, "All local files have been reset successfully.", "Logs Wiped", JOptionPane.INFORMATION_MESSAGE);
        }
    }

    /**
     * Pulls lines from local file and inserts row models.
     */
    public void refreshHistoryLogs() {
        tableModel.setRowCount(0); // clear
        ArrayList<String[]> logs = FileManager.loadAttendanceHistory();
        for (String[] log : logs) {
            tableModel.addRow(log);
        }
    }

    /**
     * Custom row cell renderer class to eliminate inline nesting issues.
     */
    private static class AttendanceRowRenderer extends DefaultTableCellRenderer {
        @Override
        public Component getTableCellRendererComponent(JTable t, Object v, boolean isSel, boolean hasF, int r, int c) {
            Component comp = super.getTableCellRendererComponent(t, v, isSel, hasF, r, c);
            comp.setForeground(new Color(15, 23, 42));
            
            // Color stripes alternative rows
            if (r % 2 == 0) {
                comp.setBackground(new Color(250, 250, 250));
            } else {
                comp.setBackground(Color.WHITE);
            }

            // Highlight status cell specifically
            if (c == 1 && v != null) {
                String cellVal = String.valueOf(v);
                if ("Present".equals(cellVal)) {
                    comp.setForeground(new Color(22, 163, 74)); // Emerald Dark Green
                    comp.setFont(new Font("Segoe UI", Font.BOLD, 13));
                } else if ("Absent".equals(cellVal)) {
                    comp.setForeground(new Color(220, 38, 38)); // High Alert Red
                    comp.setFont(new Font("Segoe UI", Font.BOLD, 13));
                }
            }
            
            // Highlight compliance rate cell specifically
            if (c == 4) {
                comp.setFont(new Font("Consolas", Font.BOLD, 13));
            }

            return comp;
        }
    }
}`
  },
  {
    name: "SettingsPanel.java",
    path: "src/SettingsPanel.java",
    description: "The custom dashboard theme configuration controls module featuring rounded custom color selectors and action listeners.",
    code: `package src;

import javax.swing.*;
import java.awt.*;

/**
 * Smart Attendance Management System
 * SettingsPanel.java - Controls visual system themes using standard OOP.
 * Change backgrounds, triggers callbacks, and switches color schemes dynamically.
 */
public class SettingsPanel extends JPanel {
    private Dashboard parentDashboard;

    public SettingsPanel(Dashboard dashboard) {
        this.parentDashboard = dashboard;
        setLayout(new BorderLayout());
        setBackground(Color.WHITE);
        setBorder(BorderFactory.createEmptyBorder(25, 30, 25, 30));

        // 1. Panel Header
        JPanel topWrapper = new JPanel(new BorderLayout());
        topWrapper.setOpaque(false);
        JLabel title = new JLabel("Settings & Configuration");
        title.setFont(new Font("Segoe UI", Font.BOLD, 22));
        title.setForeground(new Color(15, 23, 42));
        topWrapper.add(title, BorderLayout.WEST);

        JLabel desc = new JLabel("Customize visual aspects of the SAMS dashboard frame.");
        desc.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        desc.setForeground(new Color(100, 116, 139));
        topWrapper.add(desc, BorderLayout.SOUTH);
        add(topWrapper, BorderLayout.NORTH);

        // 2. Main theme options selector grid panel
        JPanel gridWrapper = new JPanel(new GridLayout(2, 3, 20, 20));
        gridWrapper.setOpaque(false);
        gridWrapper.setBorder(BorderFactory.createEmptyBorder(30, 10, 30, 10));

        // Theme details metadata
        String[] names = {"Light Mode", "Dark Mode", "Blue Theme", "Purple Theme", "Green Theme"};
        Color[] colors = {
            new Color(100, 116, 139), // Slate grey
            new Color(15, 23, 42),     // Dark Navy Midnight
            new Color(30, 64, 175),    // Royal Blue
            new Color(109, 40, 217),   // Rich Violet Purple
            new Color(13, 148, 136)    // Teal/Green
        };

        for (int i = 0; i < names.length; i++) {
            final String themeName = names[i];
            final Color themeColor = colors[i];

            // Render highly customized styled button cards representing themes
            JButton themeCard = new JButton("<html><center><b>" + themeName + "</b></center></html>");
            themeCard.setFont(new Font("Segoe UI", Font.PLAIN, 13));
            themeCard.setBackground(Color.WHITE);
            themeCard.setForeground(themeColor);
            themeCard.setFocusPainted(false);
            themeCard.setCursor(new Cursor(Cursor.HAND_CURSOR));
            themeCard.setBorder(BorderFactory.createCompoundBorder(
                BorderFactory.createLineBorder(themeColor, 2, true),
                BorderFactory.createEmptyBorder(20, 10, 20, 10)
            ));

            // Theme click triggers parent callback
            themeCard.addActionListener(e -> {
                parentDashboard.updateApplicationTheme(themeColor, themeName);
            });

            gridWrapper.add(themeCard);
        }

        // Add visual filler cards
        JPanel fillerCard = new JPanel() {
            @Override
            protected void paintComponent(Graphics g) {
                Graphics2D g2d = (Graphics2D) g;
                g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
                g2d.setColor(new Color(248, 250, 252));
                g2d.fillRoundRect(0, 0, getWidth(), getHeight(), 16, 16);
            }
        };
        gridWrapper.add(fillerCard);

        add(gridWrapper, BorderLayout.CENTER);
    }
}`
  },
  {
    name: "Main.java",
    path: "src/Main.java",
    description: "The primary bootstrap loader containing execution arguments, starting up windows thread-safely in JNLP/Swing EDT threads.",
    code: `package src;

import javax.swing.SwingUtilities;
import javax.swing.UIManager;
import javax.swing.UnsupportedLookAndFeelException;

/**
 * Smart Attendance Management System
 * Main.java - Primary Entry point.
 * Configures the OS System look & feel and launches the Login JFrame thread-safely.
 * This satisfies all guidelines for a College Minor Training Project.
 */
public class Main {
    public static void main(String[] args) {
        // Set Nimbus Look and Feel to provide a modern aesthetic
        try {
            for (UIManager.LookAndFeelInfo info : UIManager.getInstalledLookAndFeels()) {
                if ("Nimbus".equals(info.getName())) {
                    UIManager.setLookAndFeel(info.getClassName());
                    break;
                }
            }
        } catch (ClassNotFoundException | InstantiationException | IllegalAccessException | UnsupportedLookAndFeelException e) {
            // Fallback to cross-platform System look and feel if Nimbus is missing
            try {
                UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName());
            } catch (Exception ex) {
                System.err.println("Failed to initialize Look and Feel: " + ex.getMessage());
            }
        }

        // Launch Java Swing GUI thread-safely inside Event Dispatch Thread (EDT)
        SwingUtilities.invokeLater(() -> {
            System.out.println("Starting SAMS Portal Engine...");
            Login loginFrame = new Login();
            loginFrame.setVisible(true);
        });
    }
}`
  }
];
