# coding= UTF-8
import itertools
from CustomExeption.not_supported_language import NotSupportLanguage
import numpy as np

from sklearn.svm import SVC
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score
from variables import *


def train_SVM(language: str):
    if language not in supported_languages:
        raise NotSupportLanguage

    param_grid = {
                'C': [0.1, 1, 10, 50, 100, 150, 200, 150, 300],  # Regularization parameter
                'gamma': [10, 1, 0.1, 0.01, 0.001, 0.0001],  # Kernel coefficient
                'kernel': ['rbf']  # Type of SVM kernel
            }

    best_model, best_parameter, best_subset = search_for_best_parameter(language, SVC(), param_grid, 5)
    print(f'Reuslt: {best_model}\t {best_parameter}\t {best_subset}\t')
    


def search_for_best_parameter(language: str, model, param_grid, _cv):
    np.random.seed(0)

    best_model = None
    best_acc = 0.00
    best_parameter = None
    best_subset = None
    best_score = None
    
    full_features = ['mfcc', 'zero_crossing_rate', 'rmse', 'spectral_flux', 'tonnetz', 'spectral_contrast', 'chroma_stft', 'melspectrogram']
    y = np.load(f'{extracted_features_root_dir}/{language}_label.npy')
    for i in [5, 6, 7, 8]:

        all_subset = list(itertools.combinations(full_features, i))


        print("-----------------------------------------------------------------")
        print('best_acc\t best_parameter\t best_subset\t best_score\t')
        for possible_subset in all_subset:

            # Load data from generated numpy files
            X = np.load(f'{extracted_features_root_dir}/{language}_features.npy')
            X = create_subset_of_features(possible_subset, X)

            # Load the data
            X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=30)

            grid_search = GridSearchCV(model, param_grid, cv=_cv, scoring='accuracy')
            grid_search.fit(X_train, y_train)

            y_pred = grid_search.best_estimator_.predict(X_test)
            acc = accuracy_score(y_test, y_pred) 
            
            if acc > best_acc:
                best_model = grid_search.best_estimator_
                best_acc = acc
                best_parameter = grid_search.best_params_
                best_subset = possible_subset
                best_score = grid_search.best_score_
        
        print("-----------------------------------------------------------------")
        print(f'{best_acc}\t {best_parameter}\t {best_subset}\t {best_score}\t')
        print("-----------------------------------------------------------------")

    return best_model, best_parameter, best_subset


def create_subset_of_features(selected_features:tuple, all_features:np):
    result = None
    for feature in selected_features:
        if result is None:
            result = select_a_feature(feature, all_features)
        else:
            q = select_a_feature(feature, all_features)

            if all_features.ndim == 2:
                result = np.concatenate((result, q), axis=1)
            else:
                result = np.concatenate((result, q), axis=0)
    return result


def select_a_feature(feature:str, all_features:np):
    if feature not in feature_index:
        return None

    start_index = feature_index[feature][0]
    end_index = feature_index[feature][1]

    if all_features.ndim == 2:
        return all_features[:, start_index:end_index]
    else:
        return all_features[start_index:end_index]