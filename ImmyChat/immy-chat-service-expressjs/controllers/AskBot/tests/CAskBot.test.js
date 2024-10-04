const { createVocabPrompt, createPhrasePrompt, createContextPrompt, createDialogLinesPrompt} = require('../CAskBot');


describe('createVocabPrompt', () => {
  test('returns prompt when vocabulary is not null and has length > 0', () => {
    const lessonObject = {
      vocabulary: ['apple', 'banana', 'orange']
    };
    const result = createVocabPrompt(lessonObject);
    expect(result).toEqual({
      "role": "system",
      "content": "Try to naturally fit these vocabulary words in the response: apple, banana, orange"
    });
  });

  test('returns null when vocabulary is null', () => {
    const lessonObject = {
      vocabulary: null
    };
    const result = createVocabPrompt(lessonObject);
    expect(result).toBeNull();
  });

  test('returns null when vocabulary has length 0', () => {
    const lessonObject = {
      vocabulary: []
    };
    const result = createVocabPrompt(lessonObject);
    expect(result).toBeNull();
  });
});

describe('createPhrasePrompt', () => {
  test('returns prompt when phrases is not null and has length > 0', () => {
    const lessonObject = {
      phrases: ['Hello', 'How are you?', 'Goodbye']
    };
    const result = createPhrasePrompt(lessonObject);
    expect(result).toEqual({
      "role": "system",
      "content": "Try to naturally fit these phrases in the response only if it makes sense: Hello, How are you?, Goodbye"
    });
  });

  test('returns null when phrases is null', () => {
    const lessonObject = {
      phrases: null
    };
    const result = createPhrasePrompt(lessonObject);
    expect(result).toBeNull();
  });

  test('returns null when phrases has length 0', () => {
    const lessonObject = {
      phrases: []
    };
    const result = createPhrasePrompt(lessonObject);
    expect(result).toBeNull();
  });
});


describe('createDialogContextPrompt', () => {
  test('returns prompt when phrases is not null and has length > 0', () => {
    const lessonObject = {
      context: ['David and Erainne went on a date']
    };
    const result = createContextPrompt(lessonObject);
    expect(result).toEqual({
      "role": "system",
      "content": `This is the context of the dialogue: David and Erainne went on a date`
    });
  });

  test('returns null when context is null', () => {
    const lessonObject = {
      context: null
    };
    const result = createContextPrompt(lessonObject);
    expect(result).toBeNull();
  });

  test('returns null when context has length 0', () => {
    const lessonObject = {
      context: []
    };
    const result = createContextPrompt(lessonObject);
    expect(result).toBeNull();
  });
});


describe('createDialogLinesPrompt', () => {
  test('returns prompt when phrases is not null and has length > 0', () => {
    const lessonObject = {
      dialog_lines: [ 'Hi Erainne, where do you want to have dinner tonight?', 
                      'Baby, I want to have dinner at Yunshang, any objections?',
                      'Who would dare to go against you, we have no choice but Yunshang!',
                      'Haha, all hail to the queen, kneel before me you peasant!!!'
                    ]
    };
    const result = createDialogLinesPrompt(lessonObject);
    expect(result).toEqual(
      [
        {
          role: 'user',
          content: 'Haha, all hail to the queen, kneel before me you peasant!!!'
        },
        {
          role: 'assistant',
          content: 'Who would dare to go against you, we have no choice but Yunshang!'
        },
        {
          role: 'user',
          content: 'Baby, I want to have dinner at Yunshang, any objections?'
        },        
        {
          role: 'assistant',
          content: "Hi Erainne, where do you want to have dinner tonight?"
        }
      ]
    );
  });

  test('returns null when context is null', () => {
    const lessonObject = {
      dialog_lines: null
    };
    const result = createDialogLinesPrompt(lessonObject);
    expect(result).toBeNull();
  });

  test('returns null when context has length 0', () => {
    const lessonObject = {
      dialog_lines: []
    };
    const result = createDialogLinesPrompt(lessonObject);
    expect(result).toBeNull();
  });
});