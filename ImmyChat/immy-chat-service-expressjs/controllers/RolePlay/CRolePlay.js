const { getSocketId } = require("../../SocketServer/SocketServer");
const { insertLessonData, deleteLessonData } = require("../../db/index");
const { fetchVocabulary } = require("../../api/services/vocabulariesService");
const { fetchPhrases } = require("../../api/services/phrasesService");
const { fetchDialogLines, fetchDialogs } = require("../../api/services/dialogsService");


const RolePlayController = {

  postRolePlayLesson: async (req, res) => {
    try {
      const { lessonId, isRolePlaying } = req.body;
      const socketId = getSocketId();
      if (socketId.length !== 0) {
        if (isRolePlaying) {
          const vocabulary = await getVocabularies(lessonId);
          const dialogs = await getDialogs(lessonId);
          const dialogs_lines = await getDialogLines(lessonId);
          // console.log(dialogs);
          // console.log(dialogs_lines);
          const phrases = await getPhrases(lessonId);
          await insertLessonData(socketId, vocabulary, phrases, dialogs, dialogs_lines);
          console.log("inserted lesson data");
        }
        else {
          deleteLessonData(socketId);
        }
      } else {
        console.error("No socketId Found");
      }

      res.status(200).json({ message: `Successfully set roleplay mode to ${isRolePlaying}.` });
    } catch (error) {
      console.error('Error in postRolePlayLesson:', error.message);
      res.status(400).json({ error: error.message });
    }
  }

}


async function getVocabularies(lessonId) {
  try {
    const vocabulary = await fetchVocabulary(lessonId);
    return vocabulary;
  } catch (error) {
    console.error('Error in fetchVocabulary:', error.message);
  }
}

async function getPhrases(lessonId) {
  try {
    const phrases = await fetchPhrases(lessonId);
    return phrases;
  } catch (error) {
    console.error('Error in fetchPhrases:', error.message);
  }
}

async function getDialogs(lessonId) {
  try {
    const dialogs = await fetchDialogs(lessonId);
    return dialogs;
  } catch (error) {
    console.error('Error in fetchDialogs:', error.message);
  }
}

async function getDialogLines(lessonId) {
  try {
    const dialogs_lines = await fetchDialogLines(lessonId);
    return dialogs_lines;
  } catch (error) {
    console.error('Error in fetchDialogLines:', error.message);
  }
}



module.exports = { RolePlayController, getVocabularies, getPhrases, getDialogLines, getDialogs };