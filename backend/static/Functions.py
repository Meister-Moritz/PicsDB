from static  import DB_Handler, InterpreteMetadata as myMeta
from static.CustomTypes import appConfig as appC, ConstantVariables as constV
from werkzeug.datastructures.file_storage import FileStorage
from flask_jwt_extended import create_access_token, get_jwt_identity
from pathlib import Path
from PIL import Image, PngImagePlugin
import bcrypt
import imagehash
from static import DB_Handler as db
import re





def createNewTag(newTag:str, synonyms:str, tagCatName:str) -> str:
    
    status = ''
    synonyms = synonyms.split(',')
    tagCatName = tagCatName.strip()
    tagID = db.getTagID(newTag)
    if tagID > 0:
        for synonym in synonyms:
            addSynonymToTag(tagID, synonym)
        return 'Tag already exists, but synonyms where added'
    tagCatID = db.getTagCatID(tagCatName)
    if tagCatID < 0:
        return f"Tag category '{tagCatName}' dosn't exist, tag was not created"
    tagID = db.insertTag(newTag, tagCatID)
    for synonym in synonyms:
        addSynonymToTag(tagID, synonym)
    return 'Tag succesfully added'

def createNewTagCat(newTagCat:str, mandatoryInput:str) -> str:
    
    status = ''
    newTagCat = newTagCat.strip()
    mandatoryInput = mandatoryInput.strip()
    try:
        mandatoryInput:int = int(mandatoryInput)
    except (TypeError, ValueError):
        return 'Mandatory Tags is not a number, Tag category was not created'

    tagCatID:int = db.getTagCatID(newTagCat)
    if tagCatID == -1:
        tagCatID:int = db.insertTagCat(newTagCat, mandatoryInput)
        return f"Tag category succesfully added. ID: {tagCatID}"
    else:
        db.updateTagCatID(tagCatID, newTagCat, mandatoryInput)
        return f"Tag category updated. ID: {tagCatID}"
    

def addSynonymToTag(tagID:int, synonym:str):
    synonymID = db.getSynonymID(synonym)
    if synonymID < 0:
        synonymID = db.insertSynonym(synonym)
    
    db.connectTagToSynonym(tagID=tagID, synonymID=synonymID)


def processUpload(pilImage:Image, keepOGFormat:bool, filename:str) -> tuple[int, str]:
    suffix = ".webp"
    if keepOGFormat:
        suffix = "." + pilImage.format
    
    hash = handleHashing(pilImage)
    if hash['newHash'] == -1:
        return {'id':-1, 'status':f"Image already exists see ID: >{hash['oldID']}<"}
    id = DB_Handler.addImage(suffix=suffix, hash=hash['newHash'])
    saveOG(image=pilImage, id=id, suffix=suffix)
    savePreview(image=pilImage, id=id)
    return {'id': id, 'status': f"upload succesfull with ID: >{id}<"}
    

def handleHashing(pilImage):
    """returns {'newHash': bin, 'oldID': int}
    -1 if it doesnt exist"""

    hash_hex = str(imagehash.phash(pilImage))
    
    hash_dez = int(hash_hex, 16)
    hash_bin = bin(hash_dez)[2:]
    output = DB_Handler.searchHash(hash_bin)
    if output == None:
        return {'newHash': hash_bin, 'oldID': -1}
    else:
        return {'newHash': -1, 'oldID': output[0]}
    


def saveOG(image:Image, id, suffix:str):
    imgPath = constV.OG_PICS_PATH / Path(str(id) + suffix)
    if suffix.capitalize == 'PNG': 
        pngInfo = getPngMetadata(image)
        image.save(imgPath, pnginfo=pngInfo, optimize=True)
        return
    image.save(imgPath, format="WEBP", optimize=True, lossless=True)

def savePreview(image, id):
    image.thumbnail((222,222))
    imgPath = constV.PREW_PICS_PATH / Path(str(id) + constV.SUFFIX)
    image.save(imgPath, format="WEBP", optimize=True, quality=50)


def getPngMetadata(img:Image):
    # Create PNG metadata container
    pnginfo = PngImagePlugin.PngInfo()

    # Copy all text metadata (including ComfyUI workflow)
    if hasattr(img, "text"):
        # Pillow >=10 stores PNG text chunks in img.text
        for key, value in img.text.items():
            pnginfo.add_text(key, value)
    else:
        # fallback for older versions
        for key, value in img.info.items():
            if isinstance(value, str):  # PNG text chunks
                pnginfo.add_text(key, value)
    return pnginfo

def formatStatus(status, imageUploadStatus, connectTagStatus):
    status.append(f"{imageUploadStatus['status']}\n")
    for tagS in connectTagStatus:
        status.append(f"   {tagS['status']}\n")
    return status

def buildSearchQueryAndParams(searchTags, page, favMode, picsPerSite):

    positivTags = searchTags['positiv']
    negativTags = searchTags['negative']
    select = [
        "SELECT pics.id, pics.suffix",
    ]
    joins = [
        "FROM pics",
        "left join map_pics_tags on pics.id = map_pics_tags.fk_pic",
        "left join tags on map_pics_tags.fk_tag = tags.id"
    ]
    where = []
    params = {}
    params['posTagsLength'] = len(positivTags)

    #fill lists
    if favMode:
        userID = getCurrentUserID()
        joins.append('join favs on pics.id = favs.fk_pic')
        where.append('favs.fk_user = %(user_id)s')
        params['user_id'] = userID
        
    if len(positivTags) > 0:    
        where.append('tags.name = ANY(ARRAY[%(search_tags)s])')
        params['search_tags'] = positivTags
      

    # build query from lists
    query = " ".join(select + joins)
    if where:
        query += " WHERE " + " AND ".join(where)

    query  += '\ngroup by pics.id, pics.suffix' 
    query  += '\nhaving count(tags.id) >= %(posTagsLength)s'
    query  += '\norder by pics.id desc limit %(limit)s offset %(offset)s' 
   
    params['limit'] = picsPerSite
    params['offset'] = picsPerSite*(page-1)

    return {'query': query, 'params': params}

def getCurrentUserID():
    return get_jwt_identity() #testuser

def registerNewUser(username, password) -> str:
    # Hash the password
    if(username == None or password == None):
        return {"error": "Password is empty"}, 400
        
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    del password

    if DB_Handler.getUser(username)[0] > 0:
        return {"error": "Username already exists"}, 400

    userID = DB_Handler.insertUser(username, hashed_password)
    
    return {"error": ""}, 200

def loginUser(username, password):
    # Hash the password
    
    if(username == None or password == None):
        return {"error": "Username or password are empty"}, 400

    user = DB_Handler.getUser(username)
    userID = user[0]
    pass_hash = user[1]
    if userID < 0:
        return {"error": "User does not exist"}, 400

    
    isValid = bcrypt.checkpw(password.encode('utf-8'), pass_hash.encode('utf-8'))

    if not isValid:
        return {"error": "Username or password are incorrect"}, 400

    access_token = create_access_token(identity=str(userID), additional_claims={"username": username})

    return {"access_token": access_token}, 200











def buildNavQueryAndParams(searchTags, imgID, mode):
    params = []
    query = """
select pics.id, pics.suffix
from pics
    left join map_pics_tags on pics.id = map_pics_tags.fk_pic
    left join tags on map_pics_tags.fk_tag = tags.id
"""
    # if searchTags != []:
    #     query += 'where tags.name = ANY(%s)'
    #     params.append(searchTags)
        

    if mode == "next":
        query  += """\n where pics.id > %s
                    order by id asc"""
    elif mode == "prev":
        query  += """\n where pics.id < %s
                    order by id desc"""
    params.append(imgID)
    query  += '\n limit 1'
    return {'query': query, 'params': params}

def collectImageDetail(imgID):
    """collect all details about an image
    returns dict{tagList:list[str], isFav:bool}"""
    userID = getCurrentUserID()
    tagsList:list[str] = DB_Handler.getTagsForImg(imgID)
    isFav:bool = DB_Handler.isImgFavOfUser(imgID=imgID, userID=userID)

    return {'tagList': tagsList, 'isFav': isFav}


def upload(tags:str, files:list[FileStorage]):
    status = []

    tagList = [item.strip() for item in tags.split(",")]
    status = DB_Handler.checkMandatoryTags(tagList)
    if(len(status) > 0):
        return status
    if files == []:
        return 'no files selected'
    for file in files:
        pilImage = Image.open(file)
        metaTags:list[str] = myMeta.gatherTagsFromMetadata(pilImage)
        connectTagStatus = []
        imageUploadStatus = processUpload(pilImage, keepOGFormat=len(metaTags) > 0, filename=file.filename)
        if imageUploadStatus['id'] != -1:
            connectTagStatus = DB_Handler.addTags(imageUploadStatus['id'], tagList+metaTags)
        status = formatStatus(status, imageUploadStatus, connectTagStatus)
    return status
       

def cleanTags(tagsInputs:str) -> dict[list[str]]:
    tagsInputs += ','
    cleanedTags = {'positiv':[], 'negative':[]}
    singleTag = ''
    positiv = True

    for c in tagsInputs:
        reNormalC = r"^[\w]$" # regex for a single character that is number/character/underscore
        reNormalCAndMinus = r"^[\w-]$" # regex for a single character that is number/character/underscore/minus

        
        c = c.lower()

        if singleTag == '': #start of word
            if re.search(reNormalCAndMinus, c) is None:
                continue
            elif c == '-':
                positiv = False
            else:
                positiv = True
        
        if re.search(r"^[\s-]$", c) and singleTag != '': #end of word
            if positiv == True:
                cleanedTags['positiv'].append(singleTag)
            else:
                cleanedTags['negative'].append(singleTag)
            singleTag = ''
            continue


        if re.search(reNormalC, c) is None:
            continue
        singleTag += c

    return cleanedTags