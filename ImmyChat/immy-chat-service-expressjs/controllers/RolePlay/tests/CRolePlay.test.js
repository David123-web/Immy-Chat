const { getVocabularies, getPhrases, getDialogLines, getDialogs  } = require('../CRolePlay');
const { fetchVocabulary } = require("../../../api/services/vocabulariesService");
const { fetchPhrases } = require("../../../api/services/phrasesService");
const { fetchDialogLines, fetchDialogs} = require("../../../api/services/dialogsService");

jest.mock('../../../api/services/vocabulariesService');
jest.mock('../../../api/services/phrasesService');
jest.mock("../../../api/services/dialogsService");


describe('getVocabularies', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('returns vocabulary when fetchVocabulary is successful', async () => {
    const lessonId = 'lessonId';
    const vocabularyData = ['word1', 'word2'];
    fetchVocabulary.mockResolvedValue(vocabularyData);
    const result = await getVocabularies(lessonId);
    expect(fetchVocabulary).toHaveBeenCalledWith(lessonId);
    expect(result).toEqual(vocabularyData);
  });

  test('throws error when fetchVocabulary fails', async () => {
    const lessonId = 'lessonId';
    const errorMessage = 'Failed to fetch vocabulary';
    fetchVocabulary.mockRejectedValue(new Error(errorMessage));
    try {
      await getVocabularies(lessonId);
    } catch (error) {
      expect(fetchVocabulary).toHaveBeenCalledWith(lessonId);
      expect(error.message).toBe(errorMessage);
    }
  });
});

describe('getPhrases', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('returns phrases when fetchPhrases is successful', async () => {
    const lessonId = 'lessonId';
    const phrasesData = ['phrase1', 'phrase2'];
    fetchPhrases.mockResolvedValue(phrasesData);
    const result = await getPhrases(lessonId);
    expect(fetchPhrases).toHaveBeenCalledWith(lessonId);
    expect(result).toEqual(phrasesData);
  });

  test('throws error when fetchPhrases fails', async () => {
    const lessonId = 'lessonId';
    const errorMessage = 'Failed to fetch phrases';
    fetchPhrases.mockRejectedValue(new Error(errorMessage));
    try {
      await getPhrases(lessonId);
    } catch (error) {
      expect(fetchPhrases).toHaveBeenCalledWith(lessonId);
      expect(error.message).toBe(errorMessage);
    }
  });
});

describe('getdialogs', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('returns dialog context when fetchdialogs is successful', async () => {
    const lessonId = 31;
    const dialogData = ["<p>On Saturday evening, Jake's schedule is free so he would like to ask Chloe to see a new comedy movie. Please listen to the conversation and learn about:</p><p>- How Jake and Chloe start a conversation on the phone.</p><p>- How Jake invites Chloe to go to the cinema.</p><p>- How Chloe reacts to his invitation.</p><p>- How Jake suggests picking up Chloe.</p><p><i>Vào tối thứ bảy, Jake có thời gian rảnh nên anh ấy muốn rủ Chloe đi xem một bộ phim hài mới ra mắt. Bây giờ, hãy lắng nghe đoạn hội thoại và tìm hiểu:</i></p><p><i>- Cách Jake và Chloe bắt đầu cuộc trò chuyện qua điện thoại.</i></p><p><i>- Cách Jake mời Chloe đi xem phim, và cách Chloe đáp lại lời mời.</i></p><p><i>- Cách Jake đề nghị đón Chloe.</i></p>"];
  
    fetchDialogs.mockResolvedValue(dialogData);
    const result = await getDialogs(lessonId);
    expect(fetchDialogs).toHaveBeenCalledWith(lessonId);
    expect(result).toEqual(dialogData);
  });

  test('throws error when fetchDialogs fails', async () => {
    const lessonId = 'lessonId';
    const errorMessage = 'Failed to fetch dialogs';
    fetchDialogs.mockRejectedValue(new Error(errorMessage));
    try {
      await getDialogs(lessonId);
    } catch (error) {
      expect(fetchDialogs).toHaveBeenCalledWith(lessonId);
      expect(error.message).toBe(errorMessage);
    }
  });
});

describe('getdialoglines', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('returns dialoglines when fetchdialoglines is successful', async () => {
    const lessonId = 31;
    const dialogData =  [
      'Hi, Chloe, it’s Jake. How are you? (Xin chào, Chloe, mình là Jake đây. Bạn thế nào?)',
      'Oh, hi, Jake! I was just thinking about you. (Ồ, xin chào, Jake. Mình vừa nghĩ đến bạn.)',
      "That’s nice. I was wondering if you'd like to go to the movies tonight. (Tuyệt. Mình đang tự hỏi là bạn có muốn đi xem phim tối nay hay không.)",
      "Sure, I'd love to! What’s playing? (Tất nhiên rồi, mình rất muốn! Phim gì đang chiếu vậy?)",
      'I was thinking about that new comedy Lights Out. What do you think? (Mình đã nghĩ đến phim hài kịch mới Lights Out. Bạn nghĩ thế nào?)',
      'Sounds great! (Nghe có vẻ hay đó!)',
      "OK, I'll pick you up around 7:30. The movie starts at 8:00. (Được rồi, mình sẽ đón bạn khoảng 7:30. Phim sẽ bắt đầu chiếu lúc 8:00)",
      'See you then. Bye! (Gặp bạn sau. Tạm biệt!)'
    ];
  
    fetchDialogLines.mockResolvedValue(dialogData);
    const result = await getDialogLines(lessonId);
    expect(fetchDialogLines).toHaveBeenCalledWith(lessonId);
    expect(result).toEqual(dialogData);
  });

  test('throws error when fetchdialoglines fails', async () => {
    const lessonId = 'lessonId';
    const errorMessage = 'Failed to fetch dialog lines';
    fetchDialogLines.mockRejectedValue(new Error(errorMessage));
    try {
      await getDialogLines(lessonId);
    } catch (error) {
      expect(fetchDialogLines).toHaveBeenCalledWith(lessonId);
      expect(error.message).toBe(errorMessage);
    }
  });
});