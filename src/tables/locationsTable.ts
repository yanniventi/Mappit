import pool from '../config/db'; // Import the database connection

// Function to create the 'users' table
export const createLocationsTable = async (): Promise<void> => {
    const query = `
        CREATE TABLE IF NOT EXISTS locations (
            id SERIAL PRIMARY KEY,
            location_name VARCHAR(255) NOT NULL,
            country VARCHAR(100) NOT NULL,
            about TEXT,
            additional_info TEXT,
            location VARCHAR(255),
            phone VARCHAR(20),
            web_address VARCHAR(255),
            opening_closing_hours VARCHAR(255),
            img_url VARCHAR(255)
        );
    `;
    try {
        await pool.query(query);
        console.log('Locations table created successfully.');
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error creating Locations table:', error.message);
        } else {
            console.error('Unexpected error:', error);
        }
    }
};


// Function to insert example locations into the 'locations' table
export const insertLocations = async (): Promise<void> => {
    const query = `
        INSERT INTO locations (location_name, country, about, additional_info, location, phone, web_address, opening_closing_hours, img_url)
        VALUES 
        ('Marina Bay Sands', 'Singapore', 'A world-famous luxury hotel with rooftop infinity pool, casino, and high-end shopping mall.', 'The hotel features the iconic SkyPark with an observation deck offering panoramic views of the Singapore skyline.', '10 Bayfront Avenue, Singapore 018956', '+6566888888', 'https://www.marinabaysands.com', 'Mon-Sun: 24 hours', 'https://www.marinabaysands.com/etc/designs/mbs/images/marina-bay-sands-singapore.jpg'),

        ('Gardens by the Bay', 'Singapore', 'A nature park spanning 101 hectares, featuring iconic Supertree Grove, Cloud Forest, and Flower Dome.', 'Gardens by the Bay showcases a futuristic approach to integrating nature into urban spaces.', '18 Marina Gardens Dr, Singapore 018953', '+6564206848', 'https://www.gardensbythebay.com.sg', 'Mon-Sun: 5:00 AM - 2:00 AM (Outdoor Gardens), Flower Dome: 9:00 AM - 9:00 PM', 'https://www.gardensbythebay.com.sg/etc/designs/gbtb-client/images/about/news/presskit-01.jpg'),

        ('Sentosa Island', 'Singapore', 'A popular resort island with beaches, theme parks, luxury resorts, and attractions like Universal Studios Singapore.', 'Sentosa Island offers something for everyone, including beaches, museums, and adventure sports.', 'Sentosa Island, Singapore', '+6518007368672', 'https://www.sentosa.com.sg', 'Mon-Sun: 24 hours', 'https://www.sentosa.com.sg/images/default-source/default-album/beaches-tanjong-beach.jpg'),

        ('Singapore Zoo', 'Singapore', 'A world-renowned zoo offering open concept exhibits, home to over 2,800 animals from around the world.', 'Singapore Zoo is known for its "open" enclosures, where animals are separated from visitors by hidden barriers.', '80 Mandai Lake Rd, Singapore 729826', '+6562693411', 'https://www.wrs.com.sg/en/singapore-zoo.html', 'Mon-Sun: 8:30 AM - 6:00 PM', 'https://www.wrs.com.sg/content/dam/wrs/singapore-zoo/home/zoo-about-keyvisual-1920x1080.jpg'),

        ('National Museum of Singapore', 'Singapore', 'The oldest museum in Singapore, showcasing the history and culture of Singapore through immersive exhibitions.', 'The museum holds an extensive collection of artifacts, artwork, and historical documents related to Singapore’s past.', '93 Stamford Rd, Singapore 178897', '+6563323659', 'https://www.nationalmuseum.sg', 'Mon-Sun: 10:00 AM - 7:00 PM', 'https://www.nationalmuseum.sg/sites/nms2/images/About_us/Main-Header.jpg'),

        ('Changi Airport', 'Singapore', 'Singapore’s world-class international airport with award-winning facilities, retail, and dining options.', 'Changi Airport is known for its Jewel complex, which includes the world’s tallest indoor waterfall.', 'Changi Airport, Singapore', '+6565956868', 'https://www.changiairport.com', 'Mon-Sun: 24 hours', 'https://www.changiairport.com/etc/designs/cag-core/images/social-share.jpg'),

        ('Clarke Quay', 'Singapore', 'A historical riverside quay in Singapore, known for its vibrant nightlife and dining options.', 'Clarke Quay is home to various nightclubs, bars, and restaurants, offering a lively nightlife experience.', '3 River Valley Rd, Singapore 179024', '+6563373292', 'https://www.clarkequay.com.sg', 'Mon-Sun: 10:00 AM - 10:00 PM', 'https://www.clarkequay.com.sg/images/default-source/gallery/01cq.jpg'),

        ('Merlion Park', 'Singapore', 'A landmark and major tourist attraction in Singapore, home to the famous Merlion statue.', 'The Merlion, with the head of a lion and the body of a fish, is an iconic symbol of Singapore.', '1 Fullerton Rd, Singapore 049213', NULL, 'https://www.visitsingapore.com', 'Mon-Sun: 24 hours', 'https://www.visitsingapore.com/merlion-park-image.jpg'),

        ('Singapore Flyer', 'Singapore', 'One of the world’s largest observation wheels offering panoramic views of the city.', 'The Singapore Flyer is a 165-meter tall Ferris wheel that offers stunning views of the Marina Bay skyline.', '30 Raffles Ave, Singapore 039803', '+6563333311', 'https://www.singaporeflyer.com', 'Mon-Sun: 2:00 PM - 10:00 PM', 'https://www.singaporeflyer.com/etc/designs/flyer/images/og-share.jpg'),

        ('ArtScience Museum', 'Singapore', 'A museum blending art and science, located at Marina Bay Sands with interactive and futuristic exhibits.', 'The ArtScience Museum hosts touring exhibitions and permanent exhibitions related to digital art and technology.', '6 Bayfront Ave, Singapore 018974', '+6566888888', 'https://www.marinabaysands.com/museum.html', 'Mon-Sun: 10:00 AM - 7:00 PM', 'https://www.marinabaysands.com/museum/ArtScience-Museum-og.jpg');
    `;

    try {
        await pool.query(query);
        console.log('Locations inserted successfully.');
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error inserting locations:', error.message);
        } else {
            console.error('Unexpected error:', error);
        }
    }
};