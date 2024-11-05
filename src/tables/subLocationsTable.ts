import pool from '../config/db'; // Import the database connection

export const createSublocationsTable = async (): Promise<void> => {
    const query = `
        CREATE TABLE IF NOT EXISTS sublocations (
            id SERIAL PRIMARY KEY,
            location_id INTEGER NOT NULL,
            location_name TEXT,
            about TEXT,
            additional_info TEXT,
            img_url VARCHAR(255)
        );
    `;
    try {
        await pool.query(query);
        console.log('Sublocations table created successfully.');
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error creating Sublocations table:', error.message);
        } else {
            console.error('Unexpected error:', error);
        }
    }
};


export const insertSublocations = async (): Promise<void> => {
    const query = `
        INSERT INTO sublocations (location_id, location_name, about, additional_info, img_url)
        VALUES
        (1, 'Spectra', 'A mesmerizing blend of fountain jets & vibrant projections makes it a must-see for spectacle enthusiasts!', 'Enjoy a FREE 15-minute nightly extravaganza at Event Plaza!', 'spectra.png'),
        
        (1, 'The Shoppes', 'Experience luxury shopping with curated collections from top designers, where sophistication meets creativity.', 'Capture Instagram-worthy moments amidst the stunning architecture of The Shoppes.', 'shoppes.png'),
        
        (1, 'Fountain of Wealth', 'An awe-inspiring marvel of size and unique design makes it an essential stop for all visitors seeking remarkable sights!', 'Make a wish at the Fountain of Wealth and invite good fortune!', 'fountainofwealth.png'),
        
        (2, 'Esplanade Mall', 'Esplanade Mall offers a vibrant mix of dining, shopping, and leisure, making it a must-visit for both locals & tourists.', 'Experience bouldering with breath-taking views at the gym in Esplanade Mall!', 'esplanademall.png'),
        
        (2, 'Theatres on the Bay', 'Dive into the arts, where stories unfold and ignite fresh perspectives through shared experiences!', 'Marvel at our thorny domes, showcasing innovative architectural design.', 'theatresonthebay.png'),
        
        (2, 'Esplanade Park', 'Enjoy a serene escape with lush greenery & historical landmarks, perfect for a leisurely & relaxing stroll!', 'Visit The Cenotaph, an 18-meter National Monument honouring World War heroes!', 'esplanadepark.png'),
        
        (3, 'Changi Jurassic Mile', 'Experience a thrilling journey through time with life-sized dinosaur statues, offering an exciting adventure for everyone.', 'Feeling adventurous? Rent a bike nearby & cycle through a prehistoric world!', 'jurassicmile.png'),
        
        (3, 'PAssion WaVe', 'Whether you''re a seasoned pro or a curious beginner, dive into thrilling watersports with stand up paddling & windsurfing!', 'Cool down after a hard day''s work at High Tide Bistro & Bar!', 'passionwave.png'),
        
        (3, 'Yoga Inc.', 'Enjoy yoga with a stunning beach backdrop - perfect for a refreshing & invigorating session!', 'Check out their classes in glasshouse studios, from Basics to Advanced levels.', 'yogainc.png'),
        
        (4, 'Thrilling Rides', 'Experience a thrilling mix of rides with attractions for risk-takers and children, offering something for everyone!', 'Feel the adrenaline rush on the Battlestar Galactica dueling roller coaster!', 'thrillingrides.png'),
        
        (4, 'Shows & Entertainment', 'From live performances to immersive 4D films, enjoy interactive shows  & unforgettable entertainment!', 'Catch the thrilling Waterworld show with death-defying stunts & explosive action!', 'showsandentertainment.png'),

        (4, 'Meet & Greet', 'Capture a timeless memory to cherish as you strike your best pose with your favourite iconic characters!', 'Meet the legendary Blue at the Raptor Encounter for a photo op!', 'meetandgreet.png');
    `;

    try {
        await pool.query(query);
        console.log('Specified sublocations inserted successfully.');
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error inserting specified sublocations:', error.message);
        } else {
            console.error('Unexpected error:', error);
        }
    }
};
