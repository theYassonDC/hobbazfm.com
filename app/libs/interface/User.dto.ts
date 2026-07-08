interface UserDto {
    username: string
    schedule_title: string
    password: string
    figure_url?: string
}

interface UserRegisterDto extends UserDto {
    code: number
}