import pytest
from vocabulary import preprocess_text, evaluate_vocabulary

def test_preprocess_text():
    sentence = "Hey there, it's been ages since we last caught up over coffee, and I was just thinking about all the crazy adventures we used to go on—how have you been holding up?"
    expected_tokens = ['hey', 'there', 'it', 'be', 'be', 'age', 'since', 'we', 'last', 'catch', 'up', 'over', 'coffee', 'and', 'i', 'be', 'just', 'think', 'about', 'all', 'the', 'crazy', 'adventure', 'we', 'use', 'to', 'go', 'on', 'how', 'have', 'you', 'be', 'hold', 'up']
    assert preprocess_text(sentence) == expected_tokens, "preprocess_text did not return expected tokens"

def test_evaluate_vocabulary():
    sentence = "Hey there, it's been ages since we last caught up over coffee, and I was just thinking about all the crazy adventures we used to go on—how have you been holding up?"
    language = 'english'
    results = evaluate_vocabulary(sentence, language)
    print(results)
