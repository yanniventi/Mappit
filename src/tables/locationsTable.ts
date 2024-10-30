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
        ('Singapore Cable Car', 'Singapore', 'Enjoy a scenic cable car ride with stunning views of Singapore’s skyline, harbor, and Sentosa Island.', 'The cable car links Mount Faber, HarbourFront, and Sentosa, offering a unique perspective of the city.', '109 Mount Faber Rd, Singapore 099203', '+6563779688', 'https://www.mountfaberleisure.com/singapore-cable-car', 'Mon-Sun: 8:45 AM - 10:00 PM', 'locations/singapore-cable-car.png'),

        ('Mega Adventure Park', 'Singapore', 'Feeling daring? With 4 activities to choose from, embark on the highest adventure in Singapore!', 'Take MegaZip - Asia’s #1 zipline above the jungle, across the beach and out to the island.', '10A Siloso Beach Walk, Sentosa, Singapore 099008', '+6563779688', 'https://www.megazip.com.sg', 'Mon-Sun: 8:30 AM - 6:00 PM', 'locations/singapore-mega-adventure-park.png'),
        
        ('Singapore Zoo', 'Singapore', 'Open concept enclosures and immersive wildlife make it a must-see for nature-lovers!', 'Witness adorable performances from talented animals and get up close during feeding sessions.', '80 Mandai Lake Rd, Singapore 729826', '+6562693411', 'https://www.wrs.com.sg/en/singapore-zoo.html', 'Mon-Sun: 8:30 AM - 6:00 PM', 'locations/singapore-zoo.png'),

        ('Marina Bay Sands', 'Singapore', 'A world-famous luxury hotel with rooftop infinity pool, casino, and high-end shopping mall.', 'The hotel features the iconic SkyPark with an observation deck offering panoramic views of the Singapore skyline.', '10 Bayfront Avenue, Singapore 018956', '+6566888888', 'https://www.marinabaysands.com', 'Mon-Sun: 24 hours', 'https://www.civitatis.com/f/singapur/singapur/galeria/hotel-marina-bay-sands.jpg'),

        ('Gardens by the Bay', 'Singapore', 'A nature park spanning 101 hectares, featuring iconic Supertree Grove, Cloud Forest, and Flower Dome.', 'Gardens by the Bay showcases a futuristic approach to integrating nature into urban spaces.', '18 Marina Gardens Dr, Singapore 018953', '+6564206848', 'https://www.gardensbythebay.com.sg', 'Mon-Sun: 5:00 AM - 2:00 AM (Outdoor Gardens), Flower Dome: 9:00 AM - 9:00 PM', 'https://www.visitsingapore.com/content/dam/visitsingapore/neighbourhoods/marina-bay/page-image-gardens-by-the-bay_756x560.jpg'),

        ('Sentosa Island', 'Singapore', 'A popular resort island with beaches, theme parks, luxury resorts, and attractions like Universal Studios Singapore.', 'Sentosa Island offers something for everyone, including beaches, museums, and adventure sports.', 'Sentosa Island, Singapore', '+6518007368672', 'https://www.sentosa.com.sg', 'Mon-Sun: 24 hours', 'https://www.visitsingapore.com/content/dam/visitsingapore/neighbourhoods/sentosa/video-fallback_780x440.jpg'),

        ('Changi Airport', 'Singapore', 'Singapore’s world-class international airport with award-winning facilities, retail, and dining options.', 'Changi Airport is known for its Jewel complex, which includes the world’s tallest indoor waterfall.', 'Changi Airport, Singapore', '+6565956868', 'https://www.changiairport.com', 'Mon-Sun: 24 hours', 'https://static01.nyt.com/images/2019/12/02/travel/02singapore-sub/merlin_164028534_c51c096d-a0f9-4b9b-be7d-1f8d11bbf72c-articleLarge.jpg?quality=75&auto=webp&disable=upscale'),

        ('Clarke Quay', 'Singapore', 'A historical riverside quay in Singapore, known for its vibrant nightlife and dining options.', 'Clarke Quay is home to various nightclubs, bars, and restaurants, offering a lively nightlife experience.', '3 River Valley Rd, Singapore 179024', '+6563373292', 'https://www.clarkequay.com.sg', 'Mon-Sun: 10:00 AM - 10:00 PM', 'https://www.introducingsingapore.com/f/singapur/singapur/guia/clarke-quay-m.jpg'),

        ('Merlion Park', 'Singapore', 'A landmark and major tourist attraction in Singapore, home to the famous Merlion statue.', 'The Merlion, with the head of a lion and the body of a fish, is an iconic symbol of Singapore.', '1 Fullerton Rd, Singapore 049213', '+6563373292', 'https://www.visitsingapore.com', 'Mon-Sun: 24 hours', 'https://www.visitsingapore.com/content/dam/visitsingapore/neighbourhoods/marina-bay/page-image-merlion-park_756x560.jpg'),

        ('Singapore Flyer', 'Singapore', 'One of the world’s largest observation wheels offering panoramic views of the city.', 'The Singapore Flyer is a 165-meter tall Ferris wheel that offers stunning views of the Marina Bay skyline.', '30 Raffles Ave, Singapore 039803', '+6563333311', 'https://www.singaporeflyer.com', 'Mon-Sun: 2:00 PM - 10:00 PM', 'https://www.visitsingapore.com/content/dam/visitsingapore/neighbourhoods/marina-bay/page-image-singapore-flyer_756x560.jpg'),

        ('ArtScience Museum', 'Singapore', 'A museum blending art and science, located at Marina Bay Sands with interactive and futuristic exhibits.', 'The ArtScience Museum hosts touring exhibitions and permanent exhibitions related to digital art and technology.', '6 Bayfront Ave, Singapore 018974', '+6566888888', 'https://www.marinabaysands.com/museum.html', 'Mon-Sun: 10:00 AM - 7:00 PM', 'https://i0.wp.com/busykidd.com/wp-content/uploads/2024/06/art-science-museum-1-fb.jpg?fit=680%2C510&ssl=1');
    
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