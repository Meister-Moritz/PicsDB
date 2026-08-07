CREATE TABLE pics (
    id SERIAL PRIMARY KEY,
    suffix VARCHAR(10) NOT NULL,
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    inserted TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    hash bit(64) NOT NULL
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(64) NOT NULL,
    pass_hash TEXT UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE favs (
    fk_user int,
    fk_pic int,
    weight int DEFAULT 1000,
    CONSTRAINT fk_user
        FOREIGN KEY (fk_user)
        REFERENCES users(id),
    CONSTRAINT fk_pic
        FOREIGN KEY (fk_pic)
        REFERENCES pics(id)
);

CREATE TABLE tag_cats (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    mandatory_tags int
);

CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    fk_tag_cat int,
    CONSTRAINT fk_tag_cat
        FOREIGN KEY (fk_tag_cat)
        REFERENCES tag_cats(id)
);


CREATE TABLE map_pics_tags (
    fk_pic INT,
    fk_tag INT,
    CONSTRAINT fk_pic
        FOREIGN KEY (fk_pic)
        REFERENCES pics(id),
    CONSTRAINT fk_tag
        FOREIGN KEY (fk_tag)
        REFERENCES tags(id)
);


CREATE TABLE synonyms (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE map_tags_synonyms (
    fk_tag INT,
    fk_synonyms INT,
    CONSTRAINT fk_tag
        FOREIGN KEY (fk_tag)
        REFERENCES tags(id),
    CONSTRAINT fk_synonyms
        FOREIGN KEY (fk_synonyms)
        REFERENCES synonyms(id)
);






