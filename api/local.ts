import 'dotenv/config';
import app from './index';

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Local API server is running on http://127.0.0.1:${port}`);
});
