--
-- PostgreSQL database dump
--

\restrict qmLhvQmnIqxcnNy7fJqGUkcIpFIff2dkr0CZdbDVczZgR6VBY02mYgXt7P6dWVH

-- Dumped from database version 15.18
-- Dumped by pg_dump version 16.14 (Ubuntu 16.14-0ubuntu0.24.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: favs; Type: TABLE; Schema: public; Owner: picsdb_admin
--

CREATE TABLE public.favs (
    fk_user integer,
    fk_pic integer,
    weight integer DEFAULT 1000
);


ALTER TABLE public.favs OWNER TO picsdb_admin;

--
-- Name: map_pics_tags; Type: TABLE; Schema: public; Owner: picsdb_admin
--

CREATE TABLE public.map_pics_tags (
    fk_pic integer,
    fk_tag integer
);


ALTER TABLE public.map_pics_tags OWNER TO picsdb_admin;

--
-- Name: map_tags_synonyms; Type: TABLE; Schema: public; Owner: picsdb_admin
--

CREATE TABLE public.map_tags_synonyms (
    fk_tag integer,
    fk_synonyms integer
);


ALTER TABLE public.map_tags_synonyms OWNER TO picsdb_admin;

--
-- Name: pics; Type: TABLE; Schema: public; Owner: picsdb_admin
--

CREATE TABLE public.pics (
    id integer NOT NULL,
    suffix character varying(10) NOT NULL,
    created timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    inserted timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    hash bit(64) NOT NULL
);


ALTER TABLE public.pics OWNER TO picsdb_admin;

--
-- Name: pics_id_seq; Type: SEQUENCE; Schema: public; Owner: picsdb_admin
--

CREATE SEQUENCE public.pics_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pics_id_seq OWNER TO picsdb_admin;

--
-- Name: pics_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: picsdb_admin
--

ALTER SEQUENCE public.pics_id_seq OWNED BY public.pics.id;


--
-- Name: synonyms; Type: TABLE; Schema: public; Owner: picsdb_admin
--

CREATE TABLE public.synonyms (
    id integer NOT NULL,
    name character varying(100) NOT NULL
);


ALTER TABLE public.synonyms OWNER TO picsdb_admin;

--
-- Name: synonyms_id_seq; Type: SEQUENCE; Schema: public; Owner: picsdb_admin
--

CREATE SEQUENCE public.synonyms_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.synonyms_id_seq OWNER TO picsdb_admin;

--
-- Name: synonyms_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: picsdb_admin
--

ALTER SEQUENCE public.synonyms_id_seq OWNED BY public.synonyms.id;


--
-- Name: tagcats; Type: TABLE; Schema: public; Owner: picsdb_admin
--

CREATE TABLE public.tagcats (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    mandatory_tags integer
);


ALTER TABLE public.tagcats OWNER TO picsdb_admin;

--
-- Name: tag_cats_id_seq; Type: SEQUENCE; Schema: public; Owner: picsdb_admin
--

CREATE SEQUENCE public.tag_cats_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tag_cats_id_seq OWNER TO picsdb_admin;

--
-- Name: tag_cats_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: picsdb_admin
--

ALTER SEQUENCE public.tag_cats_id_seq OWNED BY public.tagcats.id;


--
-- Name: tags; Type: TABLE; Schema: public; Owner: picsdb_admin
--

CREATE TABLE public.tags (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    fk_tagcats integer
);


ALTER TABLE public.tags OWNER TO picsdb_admin;

--
-- Name: tags_id_seq; Type: SEQUENCE; Schema: public; Owner: picsdb_admin
--

CREATE SEQUENCE public.tags_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tags_id_seq OWNER TO picsdb_admin;

--
-- Name: tags_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: picsdb_admin
--

ALTER SEQUENCE public.tags_id_seq OWNED BY public.tags.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: picsdb_admin
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(64) NOT NULL,
    pass_hash text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO picsdb_admin;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: picsdb_admin
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO picsdb_admin;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: picsdb_admin
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: pics id; Type: DEFAULT; Schema: public; Owner: picsdb_admin
--

ALTER TABLE ONLY public.pics ALTER COLUMN id SET DEFAULT nextval('public.pics_id_seq'::regclass);


--
-- Name: synonyms id; Type: DEFAULT; Schema: public; Owner: picsdb_admin
--

ALTER TABLE ONLY public.synonyms ALTER COLUMN id SET DEFAULT nextval('public.synonyms_id_seq'::regclass);


--
-- Name: tagcats id; Type: DEFAULT; Schema: public; Owner: picsdb_admin
--

ALTER TABLE ONLY public.tagcats ALTER COLUMN id SET DEFAULT nextval('public.tag_cats_id_seq'::regclass);


--
-- Name: tags id; Type: DEFAULT; Schema: public; Owner: picsdb_admin
--

ALTER TABLE ONLY public.tags ALTER COLUMN id SET DEFAULT nextval('public.tags_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: picsdb_admin
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: pics pics_pkey; Type: CONSTRAINT; Schema: public; Owner: picsdb_admin
--

ALTER TABLE ONLY public.pics
    ADD CONSTRAINT pics_pkey PRIMARY KEY (id);


--
-- Name: synonyms synonyms_name_key; Type: CONSTRAINT; Schema: public; Owner: picsdb_admin
--

ALTER TABLE ONLY public.synonyms
    ADD CONSTRAINT synonyms_name_key UNIQUE (name);


--
-- Name: synonyms synonyms_pkey; Type: CONSTRAINT; Schema: public; Owner: picsdb_admin
--

ALTER TABLE ONLY public.synonyms
    ADD CONSTRAINT synonyms_pkey PRIMARY KEY (id);


--
-- Name: tagcats tag_cats_name_key; Type: CONSTRAINT; Schema: public; Owner: picsdb_admin
--

ALTER TABLE ONLY public.tagcats
    ADD CONSTRAINT tag_cats_name_key UNIQUE (name);


--
-- Name: tagcats tag_cats_pkey; Type: CONSTRAINT; Schema: public; Owner: picsdb_admin
--

ALTER TABLE ONLY public.tagcats
    ADD CONSTRAINT tag_cats_pkey PRIMARY KEY (id);


--
-- Name: tags tags_name_key; Type: CONSTRAINT; Schema: public; Owner: picsdb_admin
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_name_key UNIQUE (name);


--
-- Name: tags tags_pkey; Type: CONSTRAINT; Schema: public; Owner: picsdb_admin
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_pkey PRIMARY KEY (id);


--
-- Name: users users_pass_hash_key; Type: CONSTRAINT; Schema: public; Owner: picsdb_admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pass_hash_key UNIQUE (pass_hash);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: picsdb_admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: favs fk_pic; Type: FK CONSTRAINT; Schema: public; Owner: picsdb_admin
--

ALTER TABLE ONLY public.favs
    ADD CONSTRAINT fk_pic FOREIGN KEY (fk_pic) REFERENCES public.pics(id);


--
-- Name: map_pics_tags fk_pic; Type: FK CONSTRAINT; Schema: public; Owner: picsdb_admin
--

ALTER TABLE ONLY public.map_pics_tags
    ADD CONSTRAINT fk_pic FOREIGN KEY (fk_pic) REFERENCES public.pics(id);


--
-- Name: map_tags_synonyms fk_synonyms; Type: FK CONSTRAINT; Schema: public; Owner: picsdb_admin
--

ALTER TABLE ONLY public.map_tags_synonyms
    ADD CONSTRAINT fk_synonyms FOREIGN KEY (fk_synonyms) REFERENCES public.synonyms(id);


--
-- Name: map_pics_tags fk_tag; Type: FK CONSTRAINT; Schema: public; Owner: picsdb_admin
--

ALTER TABLE ONLY public.map_pics_tags
    ADD CONSTRAINT fk_tag FOREIGN KEY (fk_tag) REFERENCES public.tags(id);


--
-- Name: map_tags_synonyms fk_tag; Type: FK CONSTRAINT; Schema: public; Owner: picsdb_admin
--

ALTER TABLE ONLY public.map_tags_synonyms
    ADD CONSTRAINT fk_tag FOREIGN KEY (fk_tag) REFERENCES public.tags(id);


--
-- Name: tags fk_tag_cat; Type: FK CONSTRAINT; Schema: public; Owner: picsdb_admin
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT fk_tag_cat FOREIGN KEY (fk_tagcats) REFERENCES public.tagcats(id);


--
-- Name: favs fk_user; Type: FK CONSTRAINT; Schema: public; Owner: picsdb_admin
--

ALTER TABLE ONLY public.favs
    ADD CONSTRAINT fk_user FOREIGN KEY (fk_user) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

\unrestrict qmLhvQmnIqxcnNy7fJqGUkcIpFIff2dkr0CZdbDVczZgR6VBY02mYgXt7P6dWVH

