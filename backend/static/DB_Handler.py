import psycopg2
from psycopg2 import pool
from psycopg2.extras import execute_values
from werkzeug.datastructures.file_storage import FileStorage
from psycopg2.extensions import connection, cursor
from static.CustomTypes import appConfig as appC
import time

db_pool = None

def initDBPool(app):
    global db_pool
    db_pool = pool.ThreadedConnectionPool(
        minconn=1,
        maxconn=10,
        host='localhost',
        port='5432',
        database='ssd_db',
        user=app.config[appC.DB_USER],
        password=app.config[appC.DB_PASSWORD]
    )

def getConn(timeout=10):
    """Try to get a connection, waiting up to `timeout` seconds."""
    start_time = time.time()
    while True:
        try:
            return db_pool.getconn()
        except pool.PoolError:
            if time.time() - start_time > timeout:
                raise TimeoutError("Database pool exhausted, waited too long.")
            time.sleep(0.1)  # wait 100ms before retrying


def insertTag(tagName) -> int:
    """
    inserts tag into DB
    returns id if succecfull
    returns -1 if not
    """

    myConection = getConn()
    cur = myConection.cursor()
    cur.execute("""
            insert into tags (name)
            values (%s)
            returning id
            """, (tagName,))
    results = [row[0] for row in cur.fetchall()]
    
    myConection.commit() 
    db_pool.putconn(myConection)

    if len(results) > 0:
        return results[0]
    return -1

def insertSynonym(synonymName):
    """
    inserts synonym into DB
    returns id if succecfull
    """
    myConection = getConn()
    cur = myConection.cursor()

    cur.execute("""
            insert into synonyms (name)
            values (%s)
            returning id
            """, (synonymName,))
    results = [row[0] for row in cur.fetchall()]

    myConection.commit() 
    db_pool.putconn(myConection)

    if len(results) > 0:
        return results[0]
    return -1


def getTagID(tagName: str) -> int:
    """
    returns tagID if tag exists\n
    returns -1 if tag doesn't exist
    """

    myConection = getConn()
    cur = myConection.cursor()


    cur.execute("""
                select distinct tags.id
                from tags
                where tags.name = %s
                """, (tagName,))
    
    results = [row[0] for row in cur.fetchall()]

    myConection.commit() 
    db_pool.putconn(myConection)

    if len(results) > 0:
        return results[0]

    return -1

def getSynonymID(synonymName: str) -> int:
    """
    returns tagID if tag exists\n
    returns -1 if tag doesn't exist
    """

    myConection = getConn()
    cur = myConection.cursor()


    cur.execute("""
                select distinct synonyms.id
                from synonyms
                where synonyms.name = %s
                """, (synonymName,))
    
    results = [row[0] for row in cur.fetchall()]

    myConection.commit() 
    db_pool.putconn(myConection)

    if len(results) > 0:
        return results[0]

    return -1

def connectTagToSynonym(tagID:int, synonymID:int):
    """
    connects tag and Synonym in mapping table
    """
    myConection = getConn()
    cur = myConection.cursor()

    cur.execute("""
            insert into tags_synonyms (fk_tag, fk_synonyms)
            values (%s, %s)
            """, (tagID,synonymID))

    myConection.commit() 
    db_pool.putconn(myConection)




def searchTagNames(tagName: str) -> list[str]:


    myConection = getConn()
    cur = myConection.cursor()


    cur.execute("""
                select distinct tags.name as tag_name
                from tags
                where tags.name ilike %s
                """, (f'%{tagName}%',))
    
    results = [row[0] for row in cur.fetchall()]

    myConection.commit() 
    db_pool.putconn(myConection)
    return results


def searchHash(hash_bin):
    myConection = getConn()
    cur = myConection.cursor()
    cur.execute(
        """
        SELECT id
        FROM pics
        WHERE bit_count(hash # B%s) < 5;
        """,
        (hash_bin,)
    )
    output = cur.fetchone()

    myConection.commit() 
    db_pool.putconn(myConection)
    return output

def addImage(suffix, hash):
    myConection = getConn()
    cur = myConection.cursor()
    cur.execute(
        """
        INSERT INTO pics (suffix, hash)
        VALUES (%s, B%s)
        RETURNING id;
        """,
        (suffix, hash)
    )
    id = cur.fetchone()[0]

    myConection.commit() 
    db_pool.putconn(myConection)
    return id


def addTags(id:int, tags:list[str]) -> list[tuple[int, str]]:
    """
    Adds all Tags to given ID\n
    returns list of touple containing failed tags [(id, failed_tag)]\n
    returns [] if everything is good\n
    """

    myConection = getConn()
    cur = myConection.cursor()
    status = []

    for tag in tags:
        tagID = getTagID(tag)
        if tagID < 0:
            status.append({'id': id, 'status': f"Tag: >{tag}< doesn't exist"})
            continue
        try:
            cur.execute(
                """
                INSERT INTO pics_tags (fk_pic, fk_tag)
                VALUES (%s, %s);
                """,
                (id, tagID)
            )
            status.append({'id': id, 'status': f"Sucecfully connected tag: >{tag}<"})
        except:
            status.append({'id': id, 'status': f"Something went wrong with tag: >{tag}<"})

    myConection.commit() 
    db_pool.putconn(myConection)
    return status


def getIDsAndSuffix(query:dict[str, list[str]]) -> list[tuple[int, str]]:
    """ 
    Takes Query and returns all matching IDs\n
    returns [(id1, suffix1), (id2, suffix2),...]\n
    returns [] if no ids found
    """
    
    myConection = getConn()
    cur = myConection.cursor()
    cur.execute(query['query'], query['params'])

    queryResults = cur.fetchall()

    myConection.commit() 
    db_pool.putconn(myConection)
    return queryResults

def getSuffix(id:int) -> str:
    myConection = getConn()
    cur = myConection.cursor()

    cur.execute(
        """
        SELECT suffix
        FROM pics
        WHERE id = %s;
        """,
        (id,)
    )
    output = cur.fetchone()

    myConection.commit() 
    db_pool.putconn(myConection)
    return output[0]

def getTagsForImg(imgID) -> list[tuple[int, str]]:
    output: list[tuple[int, str]]

    myConection = getConn()
    cur = myConection.cursor()

    cur.execute(
        """
select tags.id, tags.name
from pics_tags as pt
    join tags on pt.fk_tag = tags.id
where pt.fk_pic = %s;
        """,
        (imgID,)
    )
    output = cur.fetchone()

    myConection.commit() 
    db_pool.putconn(myConection)
    return output

def isImgFavOfUser(imgID, userID) -> bool:
    output: bool

    myConection = getConn()
    cur = myConection.cursor()

    cur.execute(
        """
select distinct *
from favs
where fk_pic = %s
and fk_user = %s;
        """,
        (imgID, userID)
    )
    output = cur.fetchone()
    myConection.commit() 
    db_pool.putconn(myConection)

    return output != None


def updateFavs(userID:int, newFavsState:list[tuple[int, bool]]):
    status: str = ''

    insertQuery = (
"""
insert into favs (fk_user, fk_pic)
values %s
on conflict (fk_user, fk_pic) do nothing;
""")
    insertValues = [] #[(UserID1, imgID1), ...]
    
    deleteQuery = (
"""
delete from favs
where fk_user = %s
and fk_pic = ANY(%s);
""")
    deleteValues = [] #[imgID1, imgID2, ...]
    
    for newFavState in newFavsState:

        
        imgID = int(newFavState[0])
        isFav = newFavState[1]

        if isFav:
            insertValues.append((userID, imgID))
        else:
            deleteValues.append(imgID)

    


    myConection = getConn()
    cur = myConection.cursor()

    if len(insertValues) > 0:
        execute_values(cur, insertQuery, insertValues)
    if len(deleteValues) > 0:
        cur.execute(deleteQuery, [userID, deleteValues])

    myConection.commit() 
    db_pool.putconn(myConection)

    return status




# def preparePaths(queryResults:list[tuple[int, str]], pathToFullRes:bool) -> list[str]:

#     pathList:list[str] = []
#     picsDir = current_app.config[appC.PREW_PICS_PATH]
#     if pathToFullRes:
#         picsDir = current_app.config[appC.OG_PICS_PATH]
    
#     for result in queryResults:
#         id = result[0]
#         suffix = result[1]
#         pathList.append(f"{picsDir}/{id}{suffix}")
    
#     return pathList
    




    

# def searchMatchingTag(description:str) -> int:
#     tagID = -1
#     description = description.replace(" ", "%")
#     myConection = psycopg2.connect(host='localhost', port='5432', database='pics_db', user=current_app.config[appC.DB_USER], password=current_app.config[appC.DB_PASSWORD])
#     cur = myConection.cursor()


#     cur.execute("""
#                 select distinct tags.ID
#                 from tags 
#                     join tags_mtags as map on tags.id = map.fk_tag
#                     join minor_tags as mt on mt.id = map.fk_mtag
#                 where tags.name ilike %s or mt.name ilike %s
#                 """, (f'%{description}%',f'%{description}%'))
#     results = [row[0] for row in cur.fetchall()]

#     myConection.commit()
#     cur.close()
#     myConection.close()
#     if results != []:
#         tagID = results[0]
#     return tagID



