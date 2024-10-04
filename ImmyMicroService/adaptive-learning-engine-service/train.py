# coding= UTF-8

import glob
import os
import librosa
import numpy as np
from CustomExeption.not_supported_language import NotSupportLanguage
from joblib import dump, load
from sklearn.svm import SVC
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
from variables import *

"""
    This function is used extra features from a audio file

    Args:
        path_to_audio (string): a url/path to access the audio file.

    Returns:
        (List) a list of features from an audio files
"""
def feature_extraction(file_name, n_mfcc):    
    X, sample_rate = librosa.load(file_name, sr=44100)  # Can also load file using librosa

    # X, sample_rate = librosa.load(file_name, sr=None)  # Can also load file using librosa
    if X.ndim > 1:
        X = X[:, 0]
    X = X.T

    # Fourier Transform
    stft = np.abs(librosa.stft(X))

    mfcc = np.mean(librosa.feature.mfcc(y=X, sr=sample_rate, n_mfcc=n_mfcc).T, axis=0)  # Returns N_mel coefs
    zero_crossing_rate = np.mean(librosa.feature.zero_crossing_rate(y=X).T, axis=0)  # Returns 1 value
    rmse = np.mean(librosa.feature.rms(y=X)[0].T, axis=0)  # RMS Energy for each Frame (Stanford's). Returns 1 value
    spectral_flux = np.mean(librosa.onset.onset_strength(y=X, sr=sample_rate).T, axis=0)  # Spectral Flux (Stanford's). Returns 1 Value
    
    # tonnetz = np.mean(librosa.feature.tonnetz(y=librosa.effects.harmonic(X), sr=sample_rate).T, axis=0)  # tonal centroid features Returns 6 values
    # spectral_contrast = np.mean(librosa.feature.spectral_contrast(S=stft, sr=sample_rate).T, axis=0)  # Returns 7 values
    # chroma_stft = np.mean(librosa.feature.chroma_stft(S=stft, sr=sample_rate).T, axis=0)  # Returns 12 values
    # melspectrogram = np.mean(librosa.feature.melspectrogram(y=X, sr=sample_rate).T, axis=0)  # Returns 128 values

    # return [mfcc, rmse, spectral_flux, zero_crossing_rate, tonnetz, spectral_contrast, chroma_stft, melspectrogram]
    return [mfcc, rmse, spectral_flux, zero_crossing_rate]

"""
    This function is used to parse features extract from all audio files and parse into into a single np 2D array.

    Args:
        parent_dir  (string): a path the audio files for one language. (for training ML model)
        
        sub_dirs    (list): folders in parent_dir. (usually "High", "Intermediate", and "Low", which mean different fluency level)
        
        file_ext    (string):  file format. (i.e., mp3, wav, etc)
        ...

    Returns:
        
"""
def parse_audio_files(parent_dir, sub_dirs, file_ext='*.mp3'):  # Audio Format
    number_of_features = n_mfccs + 3
    # number_of_features = 156 + n_mfccs  # 154 are the total values returned by rest of computed features
    features, labels = np.empty((0, number_of_features)), np.empty(0)

    # Extract features for each audio file

    # The enumerate() function adds a counter to an iterable.
    for label, sub_dir in enumerate(sub_dirs):  
        # parent is data, sub_dirs are the classes
        for file_name in glob.glob(os.path.join(parent_dir, sub_dir, file_ext)):  
            try:
                extracted_features = np.hstack(feature_extraction(file_name, n_mfccs))
                
                # Stack arrays in sequence vertically (row wise).
                features = np.vstack([features, extracted_features])  
                labels = np.append(labels, label)
                
            except Exception as e:
                print("Actual File Name: ", file_name)
                print("[Error] there was an error in feature extraction. %s" % (e))
                continue

        print("Extracted features from %s, done" % (sub_dir))
        print("label (number) for %s, is %d" % (sub_dir, label))
    return np.array(features), np.array(labels, dtype=int)


"""
    This function prepares data for ML model training. 
    The result for training data is saved to {language}_features.npy files
    The result for training label is saved to {language}_lable.npy files

    Args:
        language (string): the language that want to be trained with

    Returns:
        None
"""
def prepare_for_training(language: str):
    if language not in supported_languages:
        raise NotSupportLanguage

    audio_subdirectories = os.listdir(f'{audio_files_root_dir}/{language}/')
    audio_subdirectories.sort()
    if '.DS_Store' in audio_subdirectories:
        audio_subdirectories.remove('.DS_Store')

    print('Audio Subdirs: ', audio_subdirectories)
    
    features, labels = parse_audio_files(f'audio_files/{language}', audio_subdirectories)
    np.save(f'{extracted_features_root_dir}/{language}_features.npy', features)
    np.save(f'{extracted_features_root_dir}/{language}_label.npy', labels)

    return True

def train_SVM(language):
    X = np.load(f'{extracted_features_root_dir}/english_features.npy')
    y = np.load(f'{extracted_features_root_dir}/english_label.npy')
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=30)

    model = SVC(gamma=0.0001, C=50, kernel='rbf')
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    acc = accuracy_score(y_test, y_pred) 
    print(acc)
    dump(model, f'{models_root_dir}/SVM_{language}_trained.joblib')


def train(language):
    if language not in supported_languages:
        return False
    
    prepare_for_training(language)
    train_SVM(language)

    return True

# train('english')
# print(predict('./test_audio/normal/dingwen_45.mp3', 'english'))
