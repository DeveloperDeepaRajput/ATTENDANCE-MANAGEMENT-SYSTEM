package src;

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
}
