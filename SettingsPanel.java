package src;

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
}
