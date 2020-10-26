module.exports = (app) => {
const voice = require('../controllers/voice.controllers.js');

app.post('/share-voice-notes', voice.createVoiceNote);
app.post('/save-voice-notes', voice.saveUserVoiceNotes);
app.get('/fetch-all-notes/:teamName', voice.getVoiceNotes);
app.get('/fetch-user-voice-notes/:userName', voice.getUserVoiceNotes);

}
