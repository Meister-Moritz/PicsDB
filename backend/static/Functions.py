from static import DB_Handler, InterpreteMetadata as myMeta
from static.CustomTypes import appConfig as appC, ConstantVariables as constV
from pathlib import Path
from PIL import Image, PngImagePlugin
import imagehash
from static import DB_Handler as db





def createNewTag(newTag:str, synonyms:str) -> str:
    
    status = ''
    synonyms = synonyms.split(',')
    tagID = db.getTagID(newTag)
    if tagID > 0:
        for synonym in synonyms:
            addSynonymToTag(tagID, synonym)
        return 'Tag already exists, but synonyms where added'
    tagID = db.insertTag(newTag)
    for synonym in synonyms:
        addSynonymToTag(tagID, synonym)
    return 'Tag succesfully added'

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
        return {'id':-1, 'status':f'Image already exists see ID: >{hash['oldID']}<'}
    id = DB_Handler.addImage(suffix=suffix, hash=hash['newHash'])
    saveOG(image=pilImage, id=id, suffix=suffix)
    savePreview(image=pilImage, id=id)
    return {'id': id, 'status': f'upload succesfull with ID: >{id}<'}
    

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
    status.append(f'{imageUploadStatus['status']}\n')
    for tagS in connectTagStatus:
        status.append(f'   {tagS['status']}\n')
    return status