package src;

import javax.swing.*;
import java.awt.*;

/**
 * Smart Attendance Management System
 * Login.java - Premium, responsive Swing login interface.
 * Implements standard features including hidden passwords, clean text boundaries,
 * exit hooks, and custom layouts.
 */
public class Login extends JFrame {
    private final JTextField usernameField;
    private final JPasswordField passwordField;
    private final JCheckBox showPasswordCheckbox;
    private final JButton loginButton;
    private final JButton exitButton;

    public Login() {
        setTitle("SAMS - Login");
        setSize(800, 500);
        setLocationRelativeTo(null);
        setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);

        // Create main split workspace panel
        JPanel mainPanel = new JPanel(new GridLayout(1, 2));

        // Add mouse dragging capability for undecorated frame
        final Point[] dragPoint = {null};
        mainPanel.addMouseListener(new java.awt.event.MouseAdapter() {
            @Override
            public void mousePressed(java.awt.event.MouseEvent e) {
                dragPoint[0] = e.getPoint();
            }
            @Override
            public void mouseReleased(java.awt.event.MouseEvent e) {
                dragPoint[0] = null;
            }
        });
        mainPanel.addMouseMotionListener(new java.awt.event.MouseMotionAdapter() {
            @Override
            public void mouseDragged(java.awt.event.MouseEvent e) {
                Point curr = e.getLocationOnScreen();
                if (dragPoint[0] != null) {
                    setLocation(curr.x - dragPoint[0].x, curr.y - dragPoint[0].y);
                }
            }
        });
        
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
            loginButton.setEnabled(false);
            SwingUtilities.invokeLater(() -> {
                try {
                    // Hide login frame immediately
                    Login.this.setVisible(false);
                    
                    Dashboard db = new Dashboard();
                    db.setVisible(true);
                    
                    // Trigger the Good Morning greeting box safely on the visible dashboard
                    try {
                        NotificationManager.showStartupReminder(db);
                    } catch (Exception nex) {
                        System.err.println("Startup reminder failed to display: " + nex.getMessage());
                    }
                    
                    // Clean up resources of the login frame
                    Login.this.dispose();
                } catch (Exception ex) {
                    // In case dashboard fails to open, show login again
                    loginButton.setEnabled(true);
                    Login.this.setVisible(true);
                    System.err.println("Error launching Dashboard: " + ex.getMessage());
                    JOptionPane.showMessageDialog(
                        null,
                        "Error launching Dashboard: " + ex.getMessage() + 
                        "\n\nPlease check if your student_profile.dat or attendance_history.txt files are corrupted.",
                        "Initialization Error",
                        JOptionPane.ERROR_MESSAGE
                    );
                }
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
}
