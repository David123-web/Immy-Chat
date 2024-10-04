const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const { fetchDialogLines, fetchDialogs} = require('../dialogsService');
const { getApiConfig } = require('../../../config/apiConfig');

describe('fetchDialogs', () => {
    let mockAxios;
  
    beforeEach(() => {
      mockAxios = new MockAdapter(axios);
    });
  
    afterEach(() => {
      mockAxios.restore();
    });
  
    test('returns dialog context when request is successful', async () => {
      const lessonId = 31;
      const dialogContext = [{
        id: 31,
        lessonId: 494,
        thumbnailId: null,
        index: 0,
        context: "<p>On Saturday evening, Jake's schedule is free so he would like to ask Chloe to see a new comedy movie. Please listen to the conversation and learn about:</p><p>- How Jake and Chloe start a conversation on the phone.</p><p>- How Jake invites Chloe to go to the cinema.</p><p>- How Chloe reacts to his invitation.</p><p>- How Jake suggests picking up Chloe.</p><p><i>Vào tối thứ bảy, Jake có thời gian rảnh nên anh ấy muốn rủ Chloe đi xem một bộ phim hài mới ra mắt. Bây giờ, hãy lắng nghe đoạn hội thoại và tìm hiểu:</i></p><p><i>- Cách Jake và Chloe bắt đầu cuộc trò chuyện qua điện thoại.</i></p><p><i>- Cách Jake mời Chloe đi xem phim, và cách Chloe đáp lại lời mời.</i></p><p><i>- Cách Jake đề nghị đón Chloe.</i></p>",
        contextAudioId: null,
        introduction: '<p><em>Đừng quá lo lắng nếu bạn không biết cách bắt đầu một cuộc gọi. Trong bài học này, chúng ta sẽ học về cách mời một người bạn đi xem phim và biết cách kéo dài cuộc trò chuyện qua điện thoại. Có những cụm từ hữu ích sẽ xuất hiện trong bài học này, bạn hãy dành thời gian học và thực tập thường xuyên nhé.   </em>            </p>',
        updatedAt: '2023-09-16T03:33:44.691Z',
        createdAt: '2023-09-07T02:33:29.718Z'
      }];
      const expecteddialogContext = ["<p>On Saturday evening, Jake's schedule is free so he would like to ask Chloe to see a new comedy movie. Please listen to the conversation and learn about:</p><p>- How Jake and Chloe start a conversation on the phone.</p><p>- How Jake invites Chloe to go to the cinema.</p><p>- How Chloe reacts to his invitation.</p><p>- How Jake suggests picking up Chloe.</p><p><i>Vào tối thứ bảy, Jake có thời gian rảnh nên anh ấy muốn rủ Chloe đi xem một bộ phim hài mới ra mắt. Bây giờ, hãy lắng nghe đoạn hội thoại và tìm hiểu:</i></p><p><i>- Cách Jake và Chloe bắt đầu cuộc trò chuyện qua điện thoại.</i></p><p><i>- Cách Jake mời Chloe đi xem phim, và cách Chloe đáp lại lời mời.</i></p><p><i>- Cách Jake đề nghị đón Chloe.</i></p>"];
  
      const endpoint = 'dialogs/immy';
      const params = { lessonId };
      const config = getApiConfig(endpoint, 'get', params);
  
      mockAxios.onGet(config.url, { params }).reply(200, dialogContext);
  
      const result = await fetchDialogs(lessonId);
      expect(result).toEqual(expecteddialogContext);
    });
  
    test('throws error when request fails', async () => {
      const lessonId = '123';
      const errorMessage = 'Request failed with status code 500';
  
      const endpoint = 'dialogs/immy';
      const params = { lessonId };
      const config = getApiConfig(endpoint, 'get', params);
  
      mockAxios.onGet(config.url, { params }).reply(500);
  
      await expect(fetchDialogs(lessonId)).rejects.toThrowError(errorMessage);
    });



  });


  describe('fetchDialogLines', () => {
    let mockAxios;
  
    beforeEach(() => {
      mockAxios = new MockAdapter(axios);
    });
  
    afterEach(() => {
      mockAxios.restore();
    });
  
    test('returns dialog lines when request is successful', async () => {
      const lessonId = 31;
      const dialogs_lines =  [
        {
          id: 159,
          index: 0,
          dialogId: 31,
          characterId: 23,
          content: 'Hi, Chloe, it’s Jake. How are you? (Xin chào, Chloe, mình là Jake đây. Bạn thế nào?)',
          updatedAt: '2023-09-16T03:33:45.568Z',
          createdAt: '2023-09-07T02:33:30.392Z'
        },
        {
          id: 160,
          index: 1,
          dialogId: 31,
          characterId: 24,
          content: 'Oh, hi, Jake! I was just thinking about you. (Ồ, xin chào, Jake. Mình vừa nghĩ đến bạn.)',
          updatedAt: '2023-09-16T03:33:46.568Z',
          createdAt: '2023-09-07T02:33:30.867Z'
        },
        {
          id: 161,
          index: 2,
          dialogId: 31,
          characterId: 23,
          content: "That’s nice. I was wondering if you'd like to go to the movies tonight. (Tuyệt. Mình đang tự hỏi là bạn có muốn đi xem phim tối nay hay không.)",
          updatedAt: '2023-09-16T03:33:47.465Z',
          createdAt: '2023-09-07T02:37:41.066Z'
        },
        {
          id: 162,
          index: 3,
          dialogId: 31,
          characterId: 24,
          content: "Sure, I'd love to! What’s playing? (Tất nhiên rồi, mình rất muốn! Phim gì đang chiếu vậy?)",
          updatedAt: '2023-09-16T03:33:48.365Z',
          createdAt: '2023-09-07T02:37:41.493Z'
        },
        {
          id: 163,
          index: 4,
          dialogId: 31,
          characterId: 23,
          content: 'I was thinking about that new comedy Lights Out. What do you think? (Mình đã nghĩ đến phim hài kịch mới Lights Out. Bạn nghĩ thế nào?)',
          updatedAt: '2023-09-16T03:33:49.259Z',
          createdAt: '2023-09-07T02:37:41.904Z'
        },
        {
          id: 164,
          index: 5,
          dialogId: 31,
          characterId: 24,
          content: 'Sounds great! (Nghe có vẻ hay đó!)',
          updatedAt: '2023-09-16T03:33:50.157Z',
          createdAt: '2023-09-07T02:37:42.332Z'
        },
        {
          id: 165,
          index: 6,
          dialogId: 31,
          characterId: 23,
          content: "OK, I'll pick you up around 7:30. The movie starts at 8:00. (Được rồi, mình sẽ đón bạn khoảng 7:30. Phim sẽ bắt đầu chiếu lúc 8:00)",
          updatedAt: '2023-09-16T03:33:51.052Z',
          createdAt: '2023-09-07T02:37:42.752Z'
        },
        {
          id: 166,
          index: 7,
          dialogId: 31,
          characterId: 24,
          content: 'See you then. Bye! (Gặp bạn sau. Tạm biệt!)',
          updatedAt: '2023-09-16T03:33:51.953Z',
          createdAt: '2023-09-07T02:37:43.164Z'
        }
      ];
      const expecteddialoglines =  [
        'Hi, Chloe, it’s Jake. How are you? (Xin chào, Chloe, mình là Jake đây. Bạn thế nào?)',
        'Oh, hi, Jake! I was just thinking about you. (Ồ, xin chào, Jake. Mình vừa nghĩ đến bạn.)',
        "That’s nice. I was wondering if you'd like to go to the movies tonight. (Tuyệt. Mình đang tự hỏi là bạn có muốn đi xem phim tối nay hay không.)",
        "Sure, I'd love to! What’s playing? (Tất nhiên rồi, mình rất muốn! Phim gì đang chiếu vậy?)",
        'I was thinking about that new comedy Lights Out. What do you think? (Mình đã nghĩ đến phim hài kịch mới Lights Out. Bạn nghĩ thế nào?)',
        'Sounds great! (Nghe có vẻ hay đó!)',
        "OK, I'll pick you up around 7:30. The movie starts at 8:00. (Được rồi, mình sẽ đón bạn khoảng 7:30. Phim sẽ bắt đầu chiếu lúc 8:00)",
        'See you then. Bye! (Gặp bạn sau. Tạm biệt!)'
      ];
  
      const endpoint = 'dialog-lines/immy';
      const params = { lessonId };
      const config = getApiConfig(endpoint, 'get', params);
  
      mockAxios.onGet(config.url, { params }).reply(200, dialogs_lines);
  
      const result = await fetchDialogLines(lessonId);
      expect(result).toEqual(expecteddialoglines);
    });
  
    test('throws error when request fails', async () => {
      const lessonId = '123';
      const errorMessage = 'Request failed with status code 500';
  
      const endpoint = 'dialog-lines/immy';
      const params = { lessonId };
      const config = getApiConfig(endpoint, 'get', params);
  
      mockAxios.onGet(config.url, { params }).reply(500);
  
      await expect(fetchDialogLines(lessonId)).rejects.toThrowError(errorMessage);
    });



  });


