class SiteNames:
    FAV_MODE = "favMode"
    IMAGE_DETAIL = "imageDetail"
    IMAGE_VIEWER = "imageViewer"
    INDEX = "index"
    SERVE_IMAGE = "serveImage"
    SQL = "sql"
    UPLOAD = "upload"
    SETTINGS = "settings"
    MASS_TAGGING = "massTagging"
    SUGGEST_TAGS = 'suggestTags'

class SessionNames:
    INIT = "init"
    QUERY = "query"
    SETTINGS = "settings"
    PICS_PER_PAGE = "picsPerPage"
    FAV_IDS = "favIDs"
    CHOSEN_ONE = "chosenOne"
    LAST_SITE = "lastSite"


class pics:
    TABLE_NAME = "pics"
    ID = "id"
    EXTENTION = "extention"
    CREATED_AT = "created_at"

class users:
    TABLE_NAME = "users"
    ID = "id"
    EXTENTION = "uname"
    CREATED_AT = "created_at"

class favs:
    TABLE_NAME = "favs"
    FK_USER = "fk_user"
    fk_pic = "fk_pic"
    CREATED_AT = "created_at"

class chosen_one:
    TABLE_NAME = "chosen_one"
    FK_USER = "fk_user"
    FK_PIC = "fk_pic"
    CREATED_AT = "created_at"

class tags:
    TABLE_NAME = "tags"
    ID = "id"
    NAME = "name"

class pics_tags:
    TABLE_NAME = "pics_tags"
    FK_PIC = "fk_pic"
    fk_tag = "fk_tag"

class minor_tags:
    TABLE_NAME = "minor_tags"
    ID = "id"
    NAME = "name"


class tags_mtags:
    TABLE_NAME = "tags_mtags"
    FK_TAG = "fk_tag"
    FK_MTAG = "fk_mtag"

class Database:
    pics = pics
    users = users
    favs = favs
    chosen_one = chosen_one
    tags = tags
    pics_tags = pics_tags
    minor_tags = minor_tags
    tags_mtags = tags_mtags


class ConstantVariables:
    SUFFIX = ".webp"
    OG_PICS_PATH = "./content/original"
    PREW_PICS_PATH = "./content/preview"

class appConfig:
    DB_NAME = "DB_name"
    DB_USER = "DB_user"
    DB_PASSWORD = "DB_password"
    OG_PICS_PATH = "og_pics_path"
    PREW_PICS_PATH = "prew_pics_path"
    APP_KEY = "app_key"
    PICS_PER_SITE = "pics_per_site"
    

