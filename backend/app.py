import sys
from flask import Flask, jsonify, request, abort, send_file
from flask_cors import CORS
from pathlib import Path
from werkzeug.datastructures.file_storage import FileStorage
from static.CustomTypes import appConfig as appC
from static import DB_Handler, InterpreteMetadata as myMeta, Functions as f
from dotenv import load_dotenv
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




@app.route("/api/query", methods=["POST"])
def run_query():
    data = request.get_json()
    query = data.get("query")
    page = data.get("query")
    queryResults = DB_Handler.getIDsAndSuffix(query)
    # pathList = DB_Handler.preparePaths(queryResults=queryResults, pathToFullRes=True)
    # queryResults = [{"id": result[0], "suffix": result[1]} for result in queryResults]
    tmp = jsonify(queryResults)
    return jsonify(queryResults)

@app.route("/serveImage")
def serve_image():
    # Get the full file path from the query parameter
    imgID = request.args.get('imgID')
    OGimg = request.args.get('OGimg')

    suffix = DB_Handler.getSuffix(id=imgID)
    
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
    tmp = jsonify(results)
    return jsonify(results)

@app.route("/upload", methods=["POST"])
def upload():
    tagsInput:str = request.form.get("tagInput")
    tags:list[str] = tagsInput.split(",")
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
            connectTagStatus = DB_Handler.addTags(imageUploadStatus['id'], tags+metaTags)
        status = f.formatStatus(status, imageUploadStatus, connectTagStatus)
    return jsonify(status)

@app.route("/addTag", methods=["POST"])
def addTag():
    data = request.get_json()
    newTag = data.get("newTag")
    synonyms = data.get("synonyms")
    status = f.createNewTag(newTag, synonyms)
    return jsonify(status)


def initApp(app):
    load_dotenv(dotenv_path="./static/.env")
    app.secret_key = os.getenv(appC.APP_KEY)
    app.config[appC.DB_USER] = os.getenv(appC.DB_USER)
    app.config[appC.DB_PASSWORD] = os.getenv(appC.DB_PASSWORD)

    app.config[appC.OG_PICS_PATH] = os.getenv(appC.OG_PICS_PATH)
    app.config[appC.PREW_PICS_PATH] = os.getenv(appC.PREW_PICS_PATH)
    DB_Handler.initDBPool(app)

if __name__ == "__main__":
    main()
