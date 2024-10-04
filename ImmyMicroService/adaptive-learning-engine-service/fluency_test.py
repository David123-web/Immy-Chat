
import pytest

from fluency import adjust_polly_variable, predict
from pause_duration import get_polly_speed_variable

@pytest.mark.parametrize("polly_speed_variable, expected", [
    ("x-slow", "x-slow"),  # Test case where input is not in low_variable
    ("slow", "slow"),      # Test case within low_variable
    ("medium", "medium"),  # Test case within low_variable
    ("fast", "medium"),    # Test case where input is not in low_variable
    ("x-fast", "medium"),  # Test case where input is not in low_variable
])
def test_adjust_polly_variable_low(polly_speed_variable, expected):
    assert adjust_polly_variable(polly_speed_variable,"low") == expected

# Test cases for y_predict = "mid"
@pytest.mark.parametrize("polly_speed_variable, expected", [
    ("x-slow", "slow"),    # Edge case, converts to closest in mid_variable
    ("slow", "slow"),      # Test case within mid_variable
    ("medium", "medium"),  # Test case within mid_variable
    ("fast", "fast"),      # Test case within mid_variable
    ("x-fast", "fast"),    # Edge case, converts to closest in mid_variable
])
def test_adjust_polly_variable_mid(polly_speed_variable, expected):
    assert adjust_polly_variable(polly_speed_variable, "mid") == expected

# Test cases for y_predict = "high"
@pytest.mark.parametrize("polly_speed_variable, expected", [
    ("x-slow", "slow"),    # Test case where input is not in high_variable, default to 'slow'
    ("slow", "slow"),      # Test case within high_variable
    ("medium", "medium"),  # Test case within high_variable
    ("fast", "fast"),      # Test case within high_variable
    ("x-fast", "x-fast"),  # Test case within high_variable
])
def test_adjust_polly_variable_high(polly_speed_variable, expected):
    assert adjust_polly_variable(polly_speed_variable, "high") == expected

@pytest.mark.parametrize("audio_path, expected", [
    ("test/test_audio/polly-fast.mp3", "medium"),    
    ("test_audio/polly-medium.mp3", "medium"),    
    ("test_audio/polly-slow.mp3", "slow"),    
    ("test_audio/polly-x-fast.mp3", "x-fast"),    
    ("test_audio/polly-x-slow.mp3", "x-slow"),    
])
def test_adjust_polly_variable_high(audio_path, expected):
    s1 = 'This is a standard testing audio that test how prosody rate variable affect the sound generate by amazon polly. We will try x-slow, slow, medium, fast, and x-fast.'

    assert get_polly_speed_variable(audio_path, s1, 'english') == expected
