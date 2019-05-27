from nltk.tokenize import TweetTokenizer
from gensim.models import Word2Vec
from pymongo import MongoClient
import numpy as np
import config as cfg
import pandas

tknzr = TweetTokenizer(strip_handles=True)
model = Word2Vec.load("word2vec.model")


def createEntry(name):
    artistCollection = db[name]
    fiveNumSum = []
    cumGood = 0
    cumBad = 0
    scores = []
    randomTweet = ''
    for tweet in artistCollection.find():
        numWords = 1
        currTweetCombined = 0
        currTweetGood = 0
        currTweetBad = 0
        randomTweet = tweet['text']
        tweetArray = tweet['text'].split(' ')
        for word in tweetArray:
            if word in model.wv.vocab:
                numWords += 1
                currTweetGood += model.wv.similarity(word, "positive")
                currTweetBad += model.wv.similarity(word, "bad")
                currTweetCombined = currTweetCombined + cumGood - cumBad
        cumGood += currTweetGood/numWords
        cumBad += currTweetBad/numWords
        currTweetCombined = currTweetCombined/numWords
        scores.append(currTweetCombined)
    if not scores:
        fiveNumSum.append([0, 0, 0, 0, 0])
    else:
        fiveNumSum.append(np.min(scores))
        for quartile in np.percentile(scores, [25, 50, 75]):
            fiveNumSum.append(quartile)
        fiveNumSum.append(np.max(scores))
    newEntry = {
        'name': name,
        'good': cumGood,
        'bad': cumBad,
        'combined': cumGood - cumBad,
        'fiveNumSum': fiveNumSum,
        'scores': scores,
        'randomTweet': randomTweet
    }
    return newEntry


def qualify(newEntries):
    combinedScores = []
    for entry in newEntries:
        combinedScores.append(entry['combined'])
    mean = np.mean(combinedScores)
    std = np.std(combinedScores)
    for entry in newEntries:
        score = entry['combined']
        lower = mean - std
        upper = mean + std
        if score < lower:
            entry['qualityScore'] = 'Terrible'
        elif score < mean:
            entry['qualityScore'] = 'Below Average'
        elif score < upper:
            entry['qualityScore'] = 'Above Average'
        else:
            entry['qualityScore'] = 'Excellent'


if __name__ == "__main__":
    # connect to mongo
    client = MongoClient(cfg.mongo_connection)
    db = client.spotdb
    collection = db.artists
    newEntries = []
    for post in collection.find():
        newEntries.append(createEntry(post['name']))
    qualify(newEntries)
    entryCollection = db.scores
    entryCollection.delete_many({})
    entryCollection.insert_many(newEntries)
    entryCollection.find().sort("name", -1)
