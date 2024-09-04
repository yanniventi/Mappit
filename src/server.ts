import app from './app';
import pool from './config/db';

// Start the server
const PORT = pool.port || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
