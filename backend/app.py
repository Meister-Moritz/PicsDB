import sys
from flask import Flask, jsonify, request, abort, send_file, json
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required
from pathlib import Path
from datetime import timedelta
from werkzeug.datastructures.file_storage import FileStorage
from static.CustomTypes import appConfig as appC
from static import DB_Handler, Functions as f
from dotenv import load_dotenv, find_dotenv
from static.Functions import buildSearchQueryAndParams, buildNavQueryAndParams, cleanTags
import os 
from PIL import Image


app = Flask(__name__)



def main():
    ip = '0.0.0.0'
    if len(sys.argv) > 1:
        ip = sys.argv[1]

    CORS(app) # Allow React to talk to Flask from another port
    jwt = JWTManager(app)
    initApp(app)
    app.run(host=ip, port=5000, debug=True)




@app.route("/api/search", methods=["POST"])
@jwt_required()
def run_query():
    data = request.get_json()
    search:dict = data.get("search")
    searchTags:dict = cleanTags(search['searchTags'])
    page = search['page']
    favMode = search['favMode']
    query = buildSearchQueryAndParams(searchTags=searchTags, page=page, favMode=favMode, picsPerSite=app.config.get(appC.PICS_PER_SITE))    
    queryResults = DB_Handler.getIDsAndSuffix(query)

    return jsonify(queryResults)

@app.route("/api/register", methods=["POST"])
def register():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    response = f.registerNewUser(username, password)
    return jsonify(response[0]), response[1]

@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    response = f.loginUser(username, password)
    return jsonify(response[0]), response[1]

@app.route("/api/navigate_id", methods=["POST"])
@jwt_required()
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

@app.route("/serveImage", methods=["POST"])
@jwt_required()
def serve_image():
    data = request.get_json()
    imgID = data.get("imgID")
    OGimg = data.get("OGimg")
    suffix = data.get("suffix")

    if suffix == None:
        suffix = DB_Handler.getSuffix(id=int(imgID))

    PROJECT_ROOT = Path(__file__).resolve().parent

    imgPath = PROJECT_ROOT / app.config.get(appC.OG_PICS_PATH) / Path(str(imgID) + suffix)
    if OGimg == 'false':
         imgPath = PROJECT_ROOT /app.config.get(appC.PREW_PICS_PATH) / Path(str(imgID) + suffix)
    
    # Check if the file exists
    if not(imgPath.exists() and imgPath.is_file()):
        print(f"File could not be found at {imgPath}")
        abort(404)  # File not found

    # Send the file to the browser
    return send_file(imgPath)

@app.route("/suggestTags", methods=["POST"])
@jwt_required()
def suggestTags():
    input = request.get_json().get("tags")
    catID = request.get_json().get("catID")
    results = DB_Handler.searchTagNames(input, catID)
    return jsonify(results)


@app.route("/suggestTagCats", methods=["POST"])
@jwt_required()
def suggestTagCats():
    input = request.get_json().get("tags")
    results = DB_Handler.searchTagNames(input)
    return jsonify(results)

@app.route("/upload", methods=["POST"])
@jwt_required()
def upload():
    tags = request.form.get("tags")
    files:list[FileStorage] = request.files.getlist("files")
    return jsonify(f.upload(tags, files))


@app.route("/getMandatoryCats", methods=["GET"])
@jwt_required()
def getMandatoryCats():
    print("backend")
    mandatoryCats = DB_Handler.getMandatoryCats();
    return jsonify(mandatoryCats)


@app.route("/addTag", methods=["POST"])
@jwt_required()
def addTag():
    data = request.get_json()
    newTag = data.get("newTag")
    tagCatName = data.get("tagCatName")
    synonyms = data.get("synonyms")
    status = f.createNewTag(newTag, synonyms, tagCatName)
    return jsonify(status)

@app.route("/addTagCat", methods=["POST"])
@jwt_required()
def addTagCat():
    data = request.get_json()
    newTagCat = data.get("newTagCat")
    mandatoryInput = data.get("mandatoryInput")
    status = f.createNewTagCat(newTagCat, mandatoryInput)
    return jsonify(status)
    

@app.route("/api/imgageDetail", methods=["POST"])
@jwt_required()
@jwt_required()
def imgageDetail():
    id = request.get_json().get("id")
    results = f.collectImageDetail(id)
    return jsonify(results)

@app.route("/api/deleteImg", methods=["POST"])
@jwt_required()
def deleteImg():
    id = request.get_json().get("id")
    suffix = DB_Handler.getSuffix(id)
    os.remove(f'{app.config[appC.OG_PICS_PATH]}/{id}{suffix}')
    os.remove(f'{app.config[appC.PREW_PICS_PATH]}/{id}.webp')
    status = DB_Handler.deleteImg(id) 
    return jsonify(status)

@app.route("/updateFavs", methods=["POST"])
@jwt_required()
def updateFavs():
    newFavState = request.get_json().get("newFavsState")
    userID = f.getCurrentUserID()
    status = DB_Handler.updateFavs(userID, newFavState)
    return jsonify(status)

@app.route("/health", methods=["GET"])
def health():
    return {"status": "healthy"}, 200


def initApp(app):
    load_dotenv(dotenv_path=find_dotenv())
    app.secret_key = os.getenv(appC.APP_KEY)
    
    app.config[appC.DB_NAME] = os.getenv(appC.DB_NAME)
    app.config[appC.DB_USER] = os.getenv(appC.DB_USER)
    app.config[appC.DB_PASSWORD] = os.getenv(appC.DB_PASSWORD)
    app.config[appC.JWT_SECRET_KEY] = os.getenv(appC.JWT_SECRET_KEY)
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=24)
    app.config["JWT_TOKEN_LOCATION"] = ["headers", "query_string"]
    app.config["JWT_QUERY_STRING_NAME"] = "token"

    app.config[appC.OG_PICS_PATH] = os.getenv(appC.OG_PICS_PATH)
    app.config[appC.PREW_PICS_PATH] = os.getenv(appC.PREW_PICS_PATH)
    app.config[appC.PICS_PER_SITE] = 25
    db_pool = DB_Handler.initDBPool(app)

if __name__ == "__main__":
    main()
