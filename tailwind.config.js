const plugin = require("tailwindcss/plugin");

module.exports = {
    theme: {
        extend: {
            // backgroundImage: {
            //     'sunway-icon-app': 'url("src/assets/img/brand/logo@2x.png")',
            //     'sunway-icon-eye-on': 'url("src/assets/img/icons/password_show_icon@2x.png")',
            //     'sunway-icon-eye-off': 'url("src/assets/img/icons/password_hide_icon@2x.png")',
            //     'sunway-icon-image-upload-close': 'url("src/assets/img/icons/image-upload-close.png")',
            //     'sunway-icon-search': 'url("src/assets/img/icons/search_icon@2x.png")',
            //     'sunway-icon-back-button': 'url("src/assets/img/icons/back_button@2x.png")',
            //     'sunway-icon-feature-default': 'url("src/assets/img/icons/feature_icon_default@2x.png")',
            //     'sunway-icon-feature-marked': 'url("src/assets/img/icons/feature_icon_marked@2x.png")',
            //     'sunway-icon-feature-disabled': 'url("src/assets/img/icons/feature_icon_disabled@2x.png")',
            //     'sunway-side-menu-transaction-history':
            //         'url("src/assets/img/side-menu-icons/transaction_history_default@2x.png")',
            //     'sunway-side-menu-transaction-history-active':
            //         'url("src/assets/img/side-menu-icons/transaction_history_active@2x.png")',
            //     'sunway-side-menu-content-management':
            //         'url("src/assets/img/side-menu-icons/content_management_default@2x.png")',
            //     'sunway-side-menu-content-management-active':
            //         'url("src/assets/img/side-menu-icons/content_management_active@2x.png")',
            //     'sunway-side-menu-notification-management':
            //         'url("src/assets/img/side-menu-icons/notification_management_default@2x.png")',
            //     'sunway-side-menu-notification-management-active':
            //         'url("src/assets/img/side-menu-icons/notification_management_active@2x.png")',
            //     'sunway-side-menu-audit-logs':
            //         'url("src/assets/img/side-menu-icons/audit_logs_default@2x.png")',
            //     'sunway-side-menu-audit-logs-active':
            //         'url("src/assets/img/side-menu-icons/audit_logs_active@2x.png")',
            //     'sunway-side-menu-user-management':
            //         'url("src/assets/img/side-menu-icons/user_management_default@2x.png")',
            //     'sunway-side-menu-user-management-active':
            //         'url("src/assets/img/side-menu-icons/user_management_active@2x.png")',
            //     'sunway-side-menu-configuration':
            //         'url("src/assets/img/side-menu-icons/configuration_default@2x.png")',
            //     'sunway-side-menu-configuration-active':
            //         'url("src/assets/img/side-menu-icons/configuration_active@2x.png")',
            //     'sunway-icon-chevron-down':
            //         'url("src/assets/img/icons/dropdown_button.svg")',
            //     'sunway-icon-time':
            //         'url("src/assets/img/icons/time_icon.svg")',
            //     'sunway-icon-add':
            //         'url("src/assets/img/icons/add_icon.svg")',
            // },
            colors: {
                // Core
                primary: "#2B9EB3",
                secondary: "#4A5568",
                accent: "#667EEA",

                // Status
                success: "#48BB78",
                warning: "#ECC94B",
                error: "#F56565",

                // Neutrals
                background: "#F7FAFC",
                surface: "#FFFFFF",
                border: "#E2E8F0",
                placeholder: "#A0AEC0",

                // Text
                headline: "#1A365D",
                body: "#2D3748",
                caption: "#718096",

                // Special
                hyperlink: "#4299E1",
                disabled: "#CBD5E0",
            },
        },
    },
    plugins: [
        plugin(function ({ matchComponents, theme }) {
            /* icon sizes */
            matchComponents(
                {
                    "sunway-icon": (value) => ({
                        height: value,
                        width: value,
                        backgroundSize: "contain",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                    }),
                },
                {
                    values: theme("iconSize"),
                }
            );
        }),
    ],
};
