import { DashboardIcon } from './../components/icons/RootIcons';

export const ROUTES = {
    DASHBOARD: "/",
} as const;

export const SIDEBAR_ROUTES = [
    {
        id: "dashboard",
        title: "Vehicle Management",
        path: ROUTES.DASHBOARD,
        icon: DashboardIcon,
        iconSize: "20" as const,
    },
];