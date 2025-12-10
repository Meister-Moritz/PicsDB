from PIL import Image
import json, io
from static import DB_Handler
import re

def gatherTagsFromMetadata(pilImage:Image) -> list[int]:
    tagIDs = []
    cleanedMetadata:list[str] = extractMetadata(pilImage)
    for description in cleanedMetadata:
        tagID = DB_Handler.searchMatchingTag(description)
        if tagID not in tagIDs and tagID != -1:
            tagIDs.append(tagID)
    return tagIDs


def extractMetadata(pilImage):
    cleanedMetadata:list[str] = []

    rawMeta = pilImage.info
    print(rawMeta)
    if "prompt" in rawMeta and "workflow" in rawMeta:
        cleanedMetadata = comfyMetadata(rawMeta)
    return cleanedMetadata


def comfyMetadata(rawMeta):
    cleanedMetadata:list[str] = []
    afterFirstClean = ''
    try:
        prompt = json.loads(rawMeta["prompt"])
        prompt:str = prompt['46:2']['inputs']['text']
    except:
        print("exept")
        return []

    inComment = False
    oldC = ''
    for c in prompt:
        if c == '#':
            inComment = True
        if c == '\n':
            inComment = False

        if inComment:
            continue
        if oldC == ',' and c == ',':
            continue
        if c in [":", "(", ")", "{", "}", "\\", "/", "<", ">", "1", "2", "3", "4", "5","6","7","8","9","0"]:
            continue

        if c in [";", ".", "\n"]:
            if oldC == ",":
                continue
            oldC = ","
            afterFirstClean += ","
        else:
            oldC = c
            afterFirstClean += c
    for element in afterFirstClean.split(','):
        element = element.strip()
        if element != '':
            cleanedMetadata.append(element)
    return cleanedMetadata