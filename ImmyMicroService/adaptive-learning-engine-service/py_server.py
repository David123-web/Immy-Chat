import os
import warnings
warnings.filterwarnings("ignore")

from joblib import load
from flask import Flask, jsonify, request
from flask_cors import CORS
from train import train_SVM
from detail import evaluate_detail
from vocabulary import evaluate_vocabulary
from fluency import evaluate_fluency, predict
from variables import *


app = Flask(__name__)
CORS(app)


fluency_prediction_models = {
    "english" : None,
    "japanese" : None,
    "chinese" : None,
    "german" : None,
    "vietnamese" : None,
    }

@app.route('/all', methods=['POST'])
def eval_all():
    data = request.json
    audio_file_addr = data.get('audio_file_addr')
    text_from_audio = data.get('text_from_audio')
    language = data.get('language')

    # print("audio_file_addr: ", audio_file_addr)
    # print("text_from_audio: ", text_from_audio)
    # print("language: ", language)

    result = {
        "fluency_eval" : 'medium',
        "vocab_eval": 'not supported language'
    }

    if text_from_audio is None or language is None:
        result['error'] = 'audio_file_addr is None or text_from_audio is None or language is None'
        return result

    vocabulary_result = evaluate_vocabulary(text_from_audio, language)
    # print("vocabulary_result: ", vocabulary_result)
    result['vocab_eval'] = vocabulary_result

    if audio_file_addr is None:
        result['error'] = 'audio_file_addr is None or text_from_audio is None or language is None'
        return result

    global fluency_prediction_models
    
    fluency_result = evaluate_fluency(audio_file_addr, text_from_audio, language, fluency_prediction_models[language])
    # print("fluency_result: ", fluency_result)
    result['fluency_eval'] = fluency_result['polly_speed_variable']
    result['fluency_level'] = fluency_result['fluency_level']

    # print("jsonfly(result): ", result)
    return result

"""
    This function is used to evaluate user speech fluency 

    Args:
        audio      : the audio file to be process
                
        languages  : the language spoken in the audio
        ...

    Returns:
        Json file contains:
            fluency: float,
            polly_speed_variable: string,
            status_code: int (200:good, 500:audio_file_not_exist, 501:could_not_generate_result)
"""
@app.route('/fluency', methods=['POST'])
def eval_fluency():
    data = request.json
    audio_file_addr = data.get('audio_file_addr')
    text_from_audio = data.get('text_from_audio')
    language = data.get('language')

    print("audio_file_addr: ", audio_file_addr)
    print("text_from_audio: ", text_from_audio)
    print("language: ", language)

    global fluency_prediction_models

    return jsonify(evaluate_fluency(audio_file_addr, text_from_audio,language, fluency_prediction_models))


"""
    This function is used to 

    Args:
        parameter1 (type): 
        
        parameter2 (type): 
    
    Returns:
        (type): 

"""
@app.route('/vocabulary', methods=['GET'])
def eval_vocabulary():
    text_from_audio = request.form.get('text_from_audio')
    language = request.form.get('language')

    result = eval_vocabulary(text_from_audio, language)

    return result


"""
    This function is used to 

    Args:
        parameter1 (type): 
        
        parameter2 (type): 
    
    Returns:
        (type): 

"""
@app.route('/detail', methods=['GET'])
def eval_detail():
    text_from_audio = request.args.get('text_from_audio')
    return jsonify(eval_detail(text_from_audio))


@app.route('/train', methods=['POST'])
def train_new_model():
    language = request.form.get('language')

    if language is None:
        result = {
            'status_code': 400,
            'error': 'Missing "language" parameter'
        }
        return jsonify(result)    

    result = train_SVM(language)


    
def init_server():
    global fluency_prediction_models

    # load trained model from binary
    for supported_language in supported_languages:
        print(f"Loading fluency model for: {supported_language}")
        fluency_prediction_models[supported_language] = load(f'./{models_root_dir}/{model_arch}_{supported_language}_trained.joblib')
        print(f"try to predict a audio, result should not be none, result is: ", predict(f'test_audio/{supported_language}.mp3', fluency_prediction_models[supported_language]))
        print(f"Finish loading fluency model for: {supported_language}")
    
if __name__ == '__main__':
    init_server()
    app.run(host='0.0.0.0', port=4000)