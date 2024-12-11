const express = require('express');
    const youtubeDl = require('youtube-dl-node');

    const app = express();
    const port = 3000;

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.get('/', (req, res) => {
      res.send(`
        <h1>YouTube Video Downloader</h1>
        <form action="/download" method="post">
          <label for="url">Enter YouTube URL:</label>
          <input type="text" id="url" name="url"><br><br>
          <label for="format">Select Output Format:</label>
          <select id="format" name="format">
            <option value="mp4">MP4</option>
            <option value="webm">WebM</option>
            <option value="flv">FLV</option>
          </select><br><br>
          <button type="submit">Download and Convert</button>
        </form>
      `);
    });

    app.post('/download', (req, res) => {
      const url = req.body.url;
      const format = req.body.format;

      youtubeDl.getInfo(url).then(info => {
        const videoTitle = info.title;
        const outputUrl = `/downloads/${videoTitle}.${format}`;

        youtubeDl.exec([url, '-x', `--audio-format=${format}`, '--output="${outputUrl}"`], {}, (err, output) => {
          if (err) {
            res.send(`Error: ${err.message}`);
          } else {
            res.send(`
              <h1>Download Complete</h1>
              <p>Video downloaded and converted successfully!</p>
              <a href="${outputUrl}" download>Download Video</a>
            `);
          }
        });
      }).catch(err => {
        res.send(`Error: ${err.message}`);
      });
    });

    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}/`);
    });
