export interface UsersResponse {
    current_page:   number;
    data:           UsersData[];
    first_page_url: string;
    from:           number;
    last_page:      number;
    last_page_url:  string;
    links:          Link[];
    next_page_url:  null;
    path:           string;
    per_page:       number;
    prev_page_url:  null;
    to:             number;
    total:          number;
}

export interface UsersData {
    id:             string;
    created_at:     Date;
    updated_at:     Date;
    deleted_at:     null;
    username:       string;
    schedule_title: string;
    active:         number;
    privilege:      string;
    role:           string;
    figure_url:     null | string;
}

export interface Link {
    url:    null | string;
    label:  string;
    page:   number | null;
    active: boolean;
}
