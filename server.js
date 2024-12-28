const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(express.json()); // Body parsing
app.use(cors({ origin: '*' })); // Allow all origins for CORS

// Memory-based storage
let comments = [];
let announcement = "기본 공지 내용";

// Load data from JSON file if it exists
if (fs.existsSync('comments.json')) {
    comments = JSON.parse(fs.readFileSync('comments.json'));
}
if (fs.existsSync('announcement.json')) {
    announcement = fs.readFileSync('announcement.json', 'utf-8');
}

// Routes

// Get comments
app.get('/get-comments', (req, res) => {
    res.json(comments);
});

// Save comment
app.post('/save-comment', (req, res) => {
    const { nickname, comment } = req.body;
    if (nickname && comment) {
        comments.unshift({ nickname, comment }); // Add comment to the beginning
        fs.writeFileSync('comments.json', JSON.stringify(comments, null, 2)); // Save to file
        res.status(201).json({ message: '댓글이 저장되었습니다.' });
    } else {
        res.status(400).json({ error: '닉네임과 댓글을 입력해주세요.' });
    }
});

// Delete comment
app.post('/delete-comment', (req, res) => {
    const { index } = req.body;
    if (index >= 0 && index < comments.length) {
        comments.splice(index, 1); // Remove comment by index
        fs.writeFileSync('comments.json', JSON.stringify(comments, null, 2)); // Save to file
        res.status(200).json({ message: '댓글이 삭제되었습니다.' });
    } else {
        res.status(400).json({ error: '유효하지 않은 인덱스입니다.' });
    }
});

// Get announcement
app.get('/get-announcement', (req, res) => {
    res.json({ announcement });
});

// Update announcement
app.post('/update-announcement', (req, res) => {
    const { announcement: newAnnouncement } = req.body;
    if (newAnnouncement) {
        announcement = newAnnouncement;
        fs.writeFileSync('announcement.json', announcement); // Save to file
        res.status(200).json({ message: '공지 내용이 업데이트되었습니다.' });
    } else {
        res.status(400).json({ error: '공지 내용을 입력해주세요.' });
    }
});

// Root route
app.get('/', (req, res) => {
    res.send('API 서버가 정상적으로 작동 중입니다. 유효한 엔드포인트를 사용하세요.');
});

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`서버가 실행 중입니다. http://localhost:${PORT}`);
});
