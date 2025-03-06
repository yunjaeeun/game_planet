CREATE SCHEMA IF NOT EXISTS GAME_PROJECT;

-- 스키마 설정
SET SCHEMA GAME_PROJECT;

create table tbl_game
(
    game_id   int auto_increment
        primary key,
    game_name varchar(255) null
);

create table tbl_game_info
(
    game_info_id      int auto_increment
        primary key,
    game_info_content varchar(255) null,
    game_rule         varchar(255) null,
    game_id           int          null,
    constraint UK23wg5selqj4eh6dw2j41thxor
        unique (game_id),
    constraint FK1q9i9qcbepeskfem58r0artk0
        foreign key (game_id) references tbl_game (game_id)
);

create table tbl_quiz_category
(
    quiz_category_id int auto_increment
        primary key,
    quiz_category    varchar(255) null
);

create table tbl_quiz
(
    quiz_id          int auto_increment
        primary key,
    quiz             varchar(255) null,
    quiz_category_id int          null,
    constraint FKosapl0u63oguleh0ofjxus337
        foreign key (quiz_category_id) references tbl_quiz_category (quiz_category_id)
);

create table tbl_room
(
    room_id     int auto_increment
        primary key,
    create_time datetime(6)  null,
    room_name   varchar(255) null,
    game_id     int          null,
    constraint FKhbea7hxm2ag6um75oiary0cof
        foreign key (game_id) references tbl_game (game_id)
);

create table tbl_user
(
    user_id                  bigint auto_increment
        primary key,
    user_name                varchar(255)                        null,
    user_email               varchar(255)                        null,
    user_password            varchar(255)                        null,
    user_birthday            datetime(6)                         null,
    user_nickname            varchar(255)                        null,
    user_profile_picture_url varchar(255)                        null,
    user_tier                varchar(255)                        null,
    user_level               int                                 null,
    user_created_at          timestamp default CURRENT_TIMESTAMP null,
    user_updated_at          timestamp                           null,
    user_deleted_at          timestamp                           null
);

create table tbl_chat
(
    chat_id      int auto_increment
        primary key,
    chat_content varchar(255) null,
    chat_time    datetime(6)  null,
    room_id      int          null,
    send_user_id bigint       null,
    constraint FKcln3nrmdiqpra24r90swk8b5g
        foreign key (room_id) references tbl_room (room_id),
    constraint FKnajy9m9ow4qyj510nh0da711o
        foreign key (send_user_id) references tbl_user (user_id)
);

create table tbl_friend
(
    friend_id      int auto_increment
        primary key,
    friend_status  enum ('ACCEPTED', 'BLOCKED', 'PENDING') not null,
    friend_user_id bigint                                  not null,
    user_id        bigint                                  not null,
    constraint FK5cxnxmaykl2fex51gea4kkkvi
        foreign key (user_id) references tbl_user (user_id),
    constraint FKqn2qgo74wlk4tqe7oifnas80o
        foreign key (friend_user_id) references tbl_user (user_id)
);

create table tbl_friend_message
(
    friend_message_id      int auto_increment
        primary key,
    friend_message_content varchar(255) null,
    sender_id              bigint       null,
    user_id                bigint       null,
    constraint FKb9sn6qwkfao2jw3reu2l6i73j
        foreign key (sender_id) references tbl_user (user_id),
    constraint FKcnm1gmwl407wqgdg5ar1n0q5v
        foreign key (user_id) references tbl_user (user_id)
);

create table tbl_game_community
(
    game_community_id      int auto_increment
        primary key,
    created_at             date         null,
    deleted_at             date         null,
    game_community_content varchar(255) null,
    user_id                bigint       null,
    game_info_id           int          null,
    constraint FK728q183cr2m43jkgh8n8fob2s
        foreign key (user_id) references tbl_user (user_id),
    constraint FKn699ksdduoi8a50g97ftv1gpu
        foreign key (game_info_id) references tbl_game_info (game_info_id)
);

create table tbl_game_community_comment
(
    game_community_comment_id      int auto_increment
        primary key,
    created_at                     date         null,
    deleted_at                     date         null,
    game_community_comment_content varchar(255) null,
    user_id                        bigint       null,
    game_community_id              int          null,
    constraint FKgkq8tfl8qayne0dt8cj98derx
        foreign key (game_community_id) references tbl_game_community (game_community_id),
    constraint FKkkbrqyy18kkmr9ocjh805o4s6
        foreign key (user_id) references tbl_user (user_id)
);

create table tbl_game_result
(
    game_result_id int auto_increment
        primary key,
    is_winner      char   null,
    game_id        int    null,
    user_id        bigint null,
    constraint FK4ge9h1i7t8y7acjuptniw5vrk
        foreign key (user_id) references tbl_user (user_id),
    constraint FK4qd97mryysenev276gerq4cb0
        foreign key (game_id) references tbl_game (game_id)
);

create table tbl_game_review
(
    game_review_id      int auto_increment
        primary key,
    game_review_content varchar(255) null,
    game_review_star    int          null,
    game_info_id        int          null,
    user_id             bigint       null,
    constraint FK8gcpa4jd9m2g8u122dp0umqbi
        foreign key (user_id) references tbl_user (user_id),
    constraint FKl5cwhmvqq7g7uilbtlp0ufedm
        foreign key (game_info_id) references tbl_game_info (game_info_id)
);

create table tbl_winner
(
    winner_id int auto_increment
        primary key,
    game_id   int    null,
    user_id   bigint null,
    constraint FKa37uvjkkw52ie4fowjbookuni
        foreign key (game_id) references tbl_game (game_id),
    constraint FKp1sm15pe1oy46787xxyihxo0a
        foreign key (user_id) references tbl_user (user_id)
);

