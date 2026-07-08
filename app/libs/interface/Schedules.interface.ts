export interface SchedulesResponse {
    current_page:   number;
    data:           Datum[];
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

export interface Datum {
    id:             string;
    created_at:     Date;
    updated_at:     Date;
    deleted_at:     null;
    deejayId:       string;
    schedule_title: string;
    dia:            number;
    hora:           number;
    style:          string;
}

export interface Link {
    url:    null | string;
    label:  string;
    page:   number | null;
    active: boolean;
}
