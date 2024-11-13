import pool from '../config/db'; // Import the database connection

export const createSublocationsTable = async (): Promise<void> => {
    const query = `
        CREATE TABLE IF NOT EXISTS sublocations (
            id SERIAL PRIMARY KEY,
            location_id INTEGER NOT NULL,
            location_name TEXT,
            about TEXT,
            additional_info TEXT,
            img_url VARCHAR(255),
            FOREIGN KEY (location_id) REFERENCES locations(id)
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

        (4, 'Meet & Greet', 'Capture a timeless memory to cherish as you strike your best pose with your favourite iconic characters!', 'Meet the legendary Blue at the Raptor Encounter for a photo op!', 'meetandgreet.png'),
       
        (5, 'Floral Fantasy', 'A magical wonderland of blooms with a blend of artistry and nature in every corner.', 'Marvel at the floral sculptures that bring a touch of whimsy to nature.', 'floralfantasy.png'),
        (5, 'OCBC Skyway', 'An elevated walkway offering breathtaking views of the Gardens and Marina Bay skyline.', 'Stroll along the Supertree Grove, especially beautiful at sunset.', 'ocbcskyway.png'),
        (5, 'SuperTree Grove', 'A collection of futuristic vertical gardens that light up beautifully at night.', 'Enjoy the Garden Rhapsody light and sound show every evening.', 'supertreegrove.png'),

        (6, 'Palawan Beach', 'A family-friendly beach with attractions and restaurants, perfect for a day out.', 'Cross the suspension bridge to the Southernmost Point of Continental Asia!', 'palawanbeach.png'),
        (6, 'S.E.A. Aquarium', 'Discover the wonders of marine life at one of the largest aquariums in the world.', 'Observe majestic sea creatures and vibrant coral reefs up close.', 'seaaquarium.png'),
        (6, 'Adventure Cove Waterpark', 'Experience thrilling water slides, snorkel with marine life, or just relax in the lazy river.', 'Try the Riptide Rocket, Southeast Asia’s first hydro-magnetic coaster.', 'adventurecove.png'),

        (7, 'Jewel Changi', 'A shopping and dining paradise, featuring the world’s tallest indoor waterfall.', 'Stroll through the lush greenery in the Forest Valley.', 'jewelchangi.png'),
        (7, 'HSBC Rain Vortex', 'The largest indoor waterfall in the world, illuminated in colorful lights at night.', 'Catch the light and sound show in the evenings for a visual spectacle.', 'rainvortex.png'),
        (7, 'Canopy Park', 'Enjoy interactive attractions such as bouncing nets and mirror mazes.', 'The perfect spot for family fun and panoramic airport views.', 'canopypark.png'),

        (8, 'Asian Civilisations Museum', 'Learn about Asia’s rich cultural heritage through immersive exhibits.', 'Explore the rich diversity of Asia’s history and artifacts.', 'acmuseum.png'),
        (8, 'Fort Canning Park', 'A historic hilltop landmark with trails, gardens, and colonial-era buildings.', 'Enjoy concerts, festivals, and scenic views of the city.', 'fortcanningpark.png'),
        (8, 'National Gallery Singapore', 'Home to the world’s largest collection of Singapore and Southeast Asian art.', 'View modern and contemporary masterpieces.', 'nationalgallery.png'),

        (9, 'Raffles Place', 'The bustling financial district known for its skyscrapers and vibrant dining scene.', 'Relax at the waterfront and watch the cityscape light up.', 'rafflesplace.png'),
        (9, 'Boat Quay', 'A lively riverside quay lined with pubs, restaurants, and nightlife.', 'Take a boat ride for beautiful views of the historic area.', 'boatquay.png'),
        (9, 'Singapore River Walk', 'Explore Singapore’s history along the river, lined with cultural landmarks.', 'Walk along the river to see iconic bridges and statues.', 'riverwalk.png'),

        (10, 'Merlion Statue', 'A 37-meter-tall symbol of Singapore’s cultural heritage and pride.', 'Catch the iconic photo op with the city skyline as the backdrop.', 'merlionstatue.png'),
        (10, 'Fullerton Hotel', 'A luxurious hotel housed in a heritage building along the Singapore River.', 'Explore the historic architecture and lavish interiors.', 'fullertonhotel.png'),
        (10, 'One Fullerton', 'A lively promenade with dining options, offering views of Marina Bay Sands.', 'Enjoy the evening city lights from the waterfront area.', 'onefullerton.png'),

        (11, 'Dino T-Rex', 'Gaze upon life-size dino replicas, a big hit with kids and tourists.', 'Get that perfect selfie with your favorite prehistoric creature.', 'dino_trex.png'),
        (11, 'Sunset Gallery', 'A rooftop with scenic views over Sentosa, ideal for unwinding and photography.', 'Enjoy a drink while watching the sun set over the horizon.', 'sunsetgallery.png'),
        (11, 'Beach Station', 'Sentosa’s main transport hub with access to attractions, dining, and more.', 'Hop on a tram or stroll along the beachside path.', 'beachstation.png');
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
