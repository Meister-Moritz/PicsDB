--
-- PostgreSQL database dump
--

\restrict 8CYY18IfogidCVDHRIiYKkkyeJRYwanit56WSf1vfL59zc5Dx0RbRLDgCxC7mZH

-- Dumped from database version 16.10 (Ubuntu 16.10-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.10 (Ubuntu 16.10-0ubuntu0.24.04.1)

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
-- Name: favs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.favs (
    fk_user integer NOT NULL,
    fk_pic integer NOT NULL,
    weight integer DEFAULT 1000
);


ALTER TABLE public.favs OWNER TO postgres;

--
-- Name: pics; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pics (
    id integer NOT NULL,
    suffix character varying(10) NOT NULL,
    created timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    inserted timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    hash bit(64) NOT NULL
);


ALTER TABLE public.pics OWNER TO postgres;

--
-- Name: pics_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pics_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pics_id_seq OWNER TO postgres;

--
-- Name: pics_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pics_id_seq OWNED BY public.pics.id;


--
-- Name: pics_tags; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pics_tags (
    fk_pic integer NOT NULL,
    fk_tag integer NOT NULL
);


ALTER TABLE public.pics_tags OWNER TO postgres;

--
-- Name: synonyms; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.synonyms (
    id integer NOT NULL,
    name character varying(100) NOT NULL
);


ALTER TABLE public.synonyms OWNER TO postgres;

--
-- Name: synonyms_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.synonyms_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.synonyms_id_seq OWNER TO postgres;

--
-- Name: synonyms_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.synonyms_id_seq OWNED BY public.synonyms.id;


--
-- Name: tags; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tags (
    id integer NOT NULL,
    name character varying(100) NOT NULL
);


ALTER TABLE public.tags OWNER TO postgres;

--
-- Name: tags_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tags_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tags_id_seq OWNER TO postgres;

--
-- Name: tags_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tags_id_seq OWNED BY public.tags.id;


--
-- Name: tags_synonyms; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tags_synonyms (
    fk_tag integer NOT NULL,
    fk_synonyms integer NOT NULL
);


ALTER TABLE public.tags_synonyms OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(64) NOT NULL,
    pass_hash text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: pics id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pics ALTER COLUMN id SET DEFAULT nextval('public.pics_id_seq'::regclass);


--
-- Name: synonyms id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.synonyms ALTER COLUMN id SET DEFAULT nextval('public.synonyms_id_seq'::regclass);


--
-- Name: tags id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tags ALTER COLUMN id SET DEFAULT nextval('public.tags_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: favs favs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favs
    ADD CONSTRAINT favs_pkey PRIMARY KEY (fk_user, fk_pic);


--
-- Name: pics pics_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pics
    ADD CONSTRAINT pics_pkey PRIMARY KEY (id);


--
-- Name: pics_tags pics_tags_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pics_tags
    ADD CONSTRAINT pics_tags_pkey PRIMARY KEY (fk_pic, fk_tag);


--
-- Name: synonyms synonyms_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.synonyms
    ADD CONSTRAINT synonyms_name_key UNIQUE (name);


--
-- Name: synonyms synonyms_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.synonyms
    ADD CONSTRAINT synonyms_pkey PRIMARY KEY (id);


--
-- Name: tags tags_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_name_key UNIQUE (name);


--
-- Name: tags tags_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_pkey PRIMARY KEY (id);


--
-- Name: tags_synonyms tags_synonyms_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tags_synonyms
    ADD CONSTRAINT tags_synonyms_pkey PRIMARY KEY (fk_tag, fk_synonyms);


--
-- Name: users users_pass_hash_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pass_hash_key UNIQUE (pass_hash);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: favs_fk_pic_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX favs_fk_pic_idx ON public.favs USING btree (fk_pic);


--
-- Name: pics_tags_fk_tag_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX pics_tags_fk_tag_idx ON public.pics_tags USING btree (fk_tag);


--
-- Name: tags_synonyms_fk_synonyms_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX tags_synonyms_fk_synonyms_idx ON public.tags_synonyms USING btree (fk_synonyms);


--
-- Name: pics_tags fk_pic; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pics_tags
    ADD CONSTRAINT fk_pic FOREIGN KEY (fk_pic) REFERENCES public.pics(id);


--
-- Name: favs fk_pic; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favs
    ADD CONSTRAINT fk_pic FOREIGN KEY (fk_pic) REFERENCES public.pics(id);


--
-- Name: tags_synonyms fk_synonyms; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tags_synonyms
    ADD CONSTRAINT fk_synonyms FOREIGN KEY (fk_synonyms) REFERENCES public.synonyms(id);


--
-- Name: pics_tags fk_tag; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pics_tags
    ADD CONSTRAINT fk_tag FOREIGN KEY (fk_tag) REFERENCES public.tags(id);


--
-- Name: tags_synonyms fk_tag; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tags_synonyms
    ADD CONSTRAINT fk_tag FOREIGN KEY (fk_tag) REFERENCES public.tags(id);


--
-- Name: favs fk_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favs
    ADD CONSTRAINT fk_user FOREIGN KEY (fk_user) REFERENCES public.users(id);


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT USAGE ON SCHEMA public TO ssd_db_standart;


--
-- Name: TABLE favs; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,UPDATE ON TABLE public.favs TO ssd_db_standart;


--
-- Name: TABLE pics; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,UPDATE ON TABLE public.pics TO ssd_db_standart;


--
-- Name: TABLE pics_tags; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,UPDATE ON TABLE public.pics_tags TO ssd_db_standart;


--
-- Name: TABLE synonyms; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,UPDATE ON TABLE public.synonyms TO ssd_db_standart;


--
-- Name: TABLE tags; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,UPDATE ON TABLE public.tags TO ssd_db_standart;


--
-- Name: TABLE tags_synonyms; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,UPDATE ON TABLE public.tags_synonyms TO ssd_db_standart;


--
-- Name: TABLE users; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,UPDATE ON TABLE public.users TO ssd_db_standart;


--
-- PostgreSQL database dump complete
--

\unrestrict 8CYY18IfogidCVDHRIiYKkkyeJRYwanit56WSf1vfL59zc5Dx0RbRLDgCxC7mZH

