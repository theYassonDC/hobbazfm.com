import { type RouteConfig, index, layout, prefix, route } from "@react-router/dev/routes";

export default [
    
    layout("./layouts/layout.tsx", [
        index("routes/home.tsx"),
        route("news", "routes/news.tsx"),
        route("news/:id", "routes/news.$id.tsx"),
        route("team", "routes/team.tsx"),
        route("schedules", "routes/schedules.tsx"),
        route("*", "routes/not-found.tsx")
    ]),
    ...prefix("panel", [
        route("login", "routes/panel/login.tsx"),
        layout("./layouts/panel.layout.tsx", [
            route("home", "routes/panel/dashboard.tsx"),
            route("schedules", "routes/panel/schedules.tsx"),
            route("*", "routes/panel/not-found.tsx"),
            route("logout", "routes/panel/logout.tsx"),
            route("users", "routes/panel/users.tsx"),
        ])
    ]),
] satisfies RouteConfig;
