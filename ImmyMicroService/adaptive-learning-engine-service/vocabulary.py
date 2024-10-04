import pandas as pd
import spacy
from variables import *

file_path = './word_frequency/word_spok_frequency_en.csv'
lemmas_df = pd.read_csv(file_path)

beginner_list = lemmas_df.iloc[:1000]
intermediate_list = lemmas_df.iloc[1000:3000]
advanced_list = lemmas_df.iloc[3000:]

nlp = spacy.load('en_core_web_lg')

def preprocess_text(doc):
    parsed_doc = nlp(doc)
    
    tokens = [token.lemma_
              for token in parsed_doc
              if not token.is_punct]
    
    tokens = [token.lower() for token in tokens]
    
    return tokens

def evaluate_vocabulary(sentence:str, language:str):
    if language not in supported_languages:
        return "not supported language"
    tokens = preprocess_text(sentence)
    # print(tokens)
    # print(len(tokens))
    beginner_count = 0
    intermediate_count = 0
    advanced_count = 0

    for token in tokens:
        if token in beginner_list.values:
            beginner_count += 1
        elif token in intermediate_list.values:
            intermediate_count += 1
        elif token in advanced_list.values:
            advanced_count += 1
        else:
            intermediate_count += 1

    beginner_ratio = round(beginner_count / len(tokens) * 100)
    intermediate_ratio = round(intermediate_count / len(tokens) * 100)
    advanced_ratio = round(advanced_count / len(tokens) * 100)

    return [str(beginner_ratio)+'%', str(intermediate_ratio)+'%', str(advanced_ratio)+'%']