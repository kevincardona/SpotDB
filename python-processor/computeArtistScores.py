from nltk.tokenize import TweetTokenizer
from gensim.models import Word2Vec
from pymongo import MongoClient

tknzr = TweetTokenizer(strip_handles=True)
model = Word2Vec.load("word2vec.model")


def createEntry(name):
    numWords = 0
    artistCollection = db[name]
    cumGood = 0
    cumBad = 0
    for tweet in artistCollection.find():
        tweetArray = tweet['text'].split(' ')
        for word in tweetArray:
            if word in model.wv.vocab:
                numWords += 1
                cumGood += model.wv.similarity(word, "positive")
                cumBad += model.wv.similarity(word, "bad")
    newEntry = {
        'name': name,
        'good': cumGood,
        'bad': cumBad,
        'combined': cumGood - cumBad
    }
    print(newEntry)
    return newEntry


if __name__ == "__main__":
    # connect to mongo
    client = MongoClient()
    db = client.spotdb
    collection = db.artists
    newEntries = []
    for post in collection.find():
        newEntries.append(createEntry(post['name']))
    entryCollection = db.scores
    entryCollection.delete_many({})
    entryCollection.insert_many(newEntries)
