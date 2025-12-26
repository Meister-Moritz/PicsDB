import sys
from flask import Flask, jsonify, request, abort, send_file
from flask_cors import CORS
from pathlib import Path
from werkzeug.datastructures.file_storage import FileStorage
from static.CustomTypes import appConfig as appC
from static import DB_Handler, InterpreteMetadata as myMeta, Functions as f
from dotenv import load_dotenv
from static.Functions import buildSearchQueryAndParams, buildNavQueryAndParams, cleanTags
import os 
from PIL import Image


app = Flask(__name__)



def main():
    ip = '0.0.0.0'
    if len(sys.argv) > 1:
        ip = sys.argv[1]
    initApp(app)
    CORS(app) # Allow React to talk to Flask from another port
    app.run(host=ip, port=5000, debug=True)




@app.route("/api/search", methods=["POST"])
def run_query():
    data = request.get_json()
    search:dict = data.get("search")
    searchTags:dict = cleanTags(search['searchTags'])
    page = search['page']
    favMode = search['favMode']
    query = buildSearchQueryAndParams(searchTags=searchTags, page=page, favMode=favMode, picsPerSite=app.config.get(appC.PICS_PER_SITE))     
    queryResults = DB_Handler.getIDsAndSuffix(query)

    return jsonify(queryResults)


@app.route("/api/navigate_id", methods=["POST"])
def navigateID():
    data = request.get_json()
    search:dict = data.get("search")
    searchTags = search['searchTags']
    # page = search['page']
    # favMode = search['favMode']
    imgID:int = data.get("image_id")
    mode:str = data.get("mode")
    query = buildNavQueryAndParams(searchTags, imgID, mode)     
    queryResults = DB_Handler.getIDsAndSuffix(query)

    return jsonify(queryResults)

@app.route("/serveImage")
def serve_image():
    # Get the full file path from the query parameter
    imgID = request.args.get('imgID')
    OGimg = request.args.get('OGimg')
    suffix = request.args.get('suffix')

    if suffix == 'null':
        suffix = DB_Handler.getSuffix(id=int(imgID))
    
    imgPath = app.config.get(appC.OG_PICS_PATH) / Path(str(imgID) + suffix)
    if OGimg == 'false':
         imgPath = app.config.get(appC.PREW_PICS_PATH) / Path(str(imgID) + suffix)
    
    # Check if the file exists
    if not(imgPath.exists() and imgPath.is_file()):
        abort(404)  # File not found

    # Send the file to the browser
    return send_file(imgPath)

@app.route("/suggestTags", methods=["POST"])
def suggestTags():
    input = request.get_json().get("tags")
    results = DB_Handler.searchTagNames(input)
    return jsonify(results)

@app.route("/upload", methods=["POST"])
def upload():
    tagsInput:str = request.form.get("tagInput")
    tagsLists:dict = cleanTags(tagsInput)
    tagList:list[str] = tagsLists['positiv'] # negative tags make no sense on the upload
    files:list[FileStorage] = request.files.getlist("files")
    if files == []:
        return jsonify('no files selected')
    status = []

    for file in files:
        
        pilImage = Image.open(file)
        metaTags:list[str] = myMeta.gatherTagsFromMetadata(pilImage)
        connectTagStatus = []
        imageUploadStatus = f.processUpload(pilImage, keepOGFormat=len(metaTags) > 0, filename=file.filename)
        if imageUploadStatus['id'] != -1:
            connectTagStatus = DB_Handler.addTags(imageUploadStatus['id'], tagList+metaTags)
        status = f.formatStatus(status, imageUploadStatus, connectTagStatus)
    return jsonify(status)

@app.route("/addTag", methods=["POST"])
def addTag():
    data = request.get_json()
    newTag = data.get("newTag")
    synonyms = data.get("synonyms")
    status = f.createNewTag(newTag, synonyms)
    return jsonify(status)

@app.route("/api/imgageDetail", methods=["POST"])
def imgageDetail():
    id = request.get_json().get("id")
    results = f.collectImageDetail(id)
    return jsonify(results)

@app.route("/api/deleteImg", methods=["POST"])
def deleteImg():
    id = request.get_json().get("id")
    suffix = DB_Handler.getSuffix(id)
    os.remove(f'{app.config[appC.OG_PICS_PATH]}/{id}{suffix}')
    os.remove(f'{app.config[appC.PREW_PICS_PATH]}/{id}.webp')
    status = DB_Handler.deleteImg(id) 
    return jsonify(status)

@app.route("/updateFavs", methods=["POST"])
def updateFavs():
    newFavState = request.get_json().get("newFavsState")
    userID = f.getCurrentUserID()
    status = DB_Handler.updateFavs(userID, newFavState)
    return jsonify(status)


def initApp(app):
    load_dotenv(dotenv_path="./static/.env")
    app.secret_key = os.getenv(appC.APP_KEY)
    app.config[appC.DB_NAME] = os.getenv(appC.DB_NAME)
    app.config[appC.DB_USER] = os.getenv(appC.DB_USER)
    app.config[appC.DB_PASSWORD] = os.getenv(appC.DB_PASSWORD)

    app.config[appC.OG_PICS_PATH] = os.getenv(appC.OG_PICS_PATH)
    app.config[appC.PREW_PICS_PATH] = os.getenv(appC.PREW_PICS_PATH)
    app.config[appC.PICS_PER_SITE] = 25
    DB_Handler.initDBPool(app)

if __name__ == "__main__":
    main()
