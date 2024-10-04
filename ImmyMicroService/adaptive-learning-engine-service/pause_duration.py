from pydub import AudioSegment
from pydub.silence import split_on_silence
from CustomExeption.not_supported_language import NotSupportLanguage
from variables import *

'''
    sound is a pydub.AudioSegment
    silence_threshold in dB
    chunk_size in ms

    iterate over chunks until you find the first one with sound
'''
def detect_leading_silence(sound, silence_threshold=-40.0, chunk_size=10):
    trim_ms = 0 # ms

    assert chunk_size > 0 # to avoid infinite loop
    while sound[trim_ms:trim_ms+chunk_size].dBFS < silence_threshold and trim_ms < len(sound):
        trim_ms += chunk_size

    return trim_ms

"""
    This function calculate the audio file length (in second) and total non silence length (in second)

    Args:
        path_to_audio (string): path to access that audio file

    Returns: a tuple of two floats
        (float): total audio length
        (float): total non silence length
        (float): ratio of (total non silence length) vs (total audio length)
"""
def calculate_total_silence_duration(path_to_audio, printS=False):
    # Load your audio file
    audio = AudioSegment.from_file(path_to_audio)

    start_trim = detect_leading_silence(audio)
    end_trim = detect_leading_silence(audio.reverse())

    duration = len(audio)    
    audio = audio[start_trim:duration-end_trim]

    # Total length of the audio file in seconds
    total_audio_length = len(audio) / 1000

    # Split audio on pauses (silence)
    chunks = split_on_silence(audio, min_silence_len=50, silence_thresh=-40)
    
    total_non_silence_length = 0
    
    rr = AudioSegment.empty()
    for chunk in chunks:
        total_non_silence_length += chunk.duration_seconds 
        rr += chunk

    difference = total_audio_length - total_non_silence_length

    if printS:
        print("total_audio_length: ", total_audio_length)
        print("Total_non_silence_length: ", total_non_silence_length)
        print("Difference: ", difference)
        rr.export("./resutl.wav", format='wav')

    return (total_audio_length, total_non_silence_length, total_non_silence_length/total_audio_length)

def get_polly_speed_variable(path_to_audio:str, text_from_audio:str, language:str):    
    
    try:
        t = calculate_total_silence_duration(path_to_audio)
        num_word_said_per_second = round(len(text_from_audio.split(' ')) / t[0], 3)
        polly_speech_rate = amazon_polly_speech_speed_silence_ratio[language]
        closest_key = min(polly_speech_rate.keys(), key=lambda k: abs(polly_speech_rate[k] - num_word_said_per_second))
        return closest_key

    except :
        return 'medium'
