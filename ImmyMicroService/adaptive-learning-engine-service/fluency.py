from pause_duration import get_polly_speed_variable
from variables import *
import numpy as np
from train import feature_extraction

def predict(audio_file_path:str, model):
    
    extracted_features = np.hstack(feature_extraction(audio_file_path, n_mfccs))
    extracted_features = extracted_features.reshape(1, -1)

    return number_to_fluency[model.predict(extracted_features)[0]]

def evaluate_fluency(audio_file_addr, text_from_audio, language, fluency_prediction_model):
    result = {
        'fluency_level': 'None',
        'polly_speed_variable': 'Normal',
    }

    y_predict ='mid'
    
    polly_speed_variable = get_polly_speed_variable(audio_file_addr, text_from_audio, language)

    if fluency_prediction_model is not None:            
        y_predict = predict(audio_file_addr, fluency_prediction_model)
        
        result['fluency_level'] =  y_predict
    result["polly_speed_variable"] = adjust_polly_variable(polly_speed_variable, y_predict)

    return result

def adjust_polly_variable(polly_speed_variable:str, y_predict:str):
    low_variable = ('x-slow','slow','medium')
    mid_variable = ('slow','medium', 'fast')
    high_variable = ('slow','medium','fast','x-fast')

    if y_predict == "low":
        if polly_speed_variable not in low_variable:
            return 'medium'
        else:
            return polly_speed_variable
    elif y_predict == "mid":
        if polly_speed_variable not in mid_variable:
            if polly_speed_variable == "x-slow":
                return "slow"
            elif polly_speed_variable == "x-fast":
                return "fast"
            else:
                return 'medium'
        else:
            return polly_speed_variable
    else:
        if polly_speed_variable not in high_variable: 
            return 'slow'
        else:
            return polly_speed_variable

# from joblib import load   
# eng_model = load(f'./{models_root_dir}/{model_arch}_english_trained.joblib')
# print(predict('test_audio/polly-fast.mp3', eng_model))