# used for machine learning
n_mfccs = 40

model_arch = 'SVM'

selected_features_for_languages = {
    'english': ('mfcc', 'zero_crossing_rate', 'rmse', 'tonnetz', 'melspectrogram')
}

feature_index = {
    'all': (0, 176),
    'mfcc': (0, 20),
    'rmse': (20, 21),
    'spectral_flux': (21, 22),
    'zero_crossing_rate': (22, 23),
    'tonnetz': (23, 29),
    'spectral_contrast': (29, 36),
    'chroma_stft': (36, 48),
    'melspectrogram': (48, 176)
}

number_to_fluency = {
    0 : 'high',
    1 : 'low',
    2 : 'mid'
}

# used for polly 
amazon_polly_speech_speed_variable = ('x-slow', 'slow', 'medium', 'fast', 'x-fast')

amazon_polly_speech_speed_silence_ratio = {
    'english': {
        'x-slow': 1.765,
        'slow': 2.121, 
        'medium': 2.51, 
        'fast': 3.31, 
        'x-fast': 3.568
    }
}

# used for all

supported_languages = (
    'english',
)

audio_files_root_dir = r'audio_files'

extracted_features_root_dir = r'extracted_features'

models_root_dir = r'models_raw_bytes'
