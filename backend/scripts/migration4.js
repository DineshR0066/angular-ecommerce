import mongoose from "mongoose";

const MONGO_URI = "mongodb+srv://ramdinesh2709_db_user:lbxJOPfaBjwW3W0O@cluster0.aviennq.mongodb.net/cloned";

// 1. Define the Schema
const productSchema = new mongoose.Schema({
  product_category_name: String,
  product_name: String,
}, { strict: false });

const Product = mongoose.model("Product", productSchema);

// 2. Base mapping of specific items for major categories
// This will be used to "seed" the larger arrays
const categoryProductMap = {
  "furniture_decor": ["Sofa", "Dining Table", "Coffee Table", "Wall Clock", "Armchair", "Lamp Shade", "Office Desk"],
  "bed_bath_table": ["King Size Bed", "Cotton Bath Towel", "Satin Pillowcase", "Quilt Cover", "Bath Mat"],
  "health_beauty": ["Face Moisturizer", "Shampoo", "Electric Toothbrush", "Perfume", "Hair Straightener"],
  "telephony": ["Smartphone", "Wireless Earbuds", "Phone Case", "Power Bank", "Tablet Stand"],
  "sports_leisure": ["Yoga Mat", "Dumbbell Set", "Mountain Bike", "Running Shoes", "Camping Tent"],
  "housewares": ["Non-Stick Frying Pan", "Kitchen Knife Set", "Storage Container", "Electric Kettle", "Cutlery Tray"],
  "toys": ["LEGO Set", "Remote Control Car", "Board Game", "Plush Toy", "Action Figure"],
  "auto": ["Car Floor Mats", "Dash Camera", "Portable Tire Inflator", "Leather Seat Cover"],
  "watches_gifts": ["Analog Watch", "Smartwatch", "Leather Wallet", "Jewelry Box"],
  "computers_accessories": ["Mechanical Keyboard", "Gaming Mouse", "Laptop Backpack", "USB-C Dock"],
  "baby": ["Baby Stroller", "Diaper Bag", "Crib Mattress", "Infant Car Seat"],
  "consoles_games": ["PlayStation 5 Pro", "Nintendo Switch 2", "Xbox Series X", "Grand Theft Auto VI", "Resident Evil Requiem", "Pokémon Pokopia", "Marvel's Wolverine", "Steam Deck OLED", "Xbox Series S", "007 First Light", "Forza Horizon 6", "Monster Hunter Stories 3: Twisted Reflection"],
  "stationery": ["Hardcover Lined Journal", "Retractable Gel Pens (12-Pack)", "Pastel Highlighter Set", "Weekly Desktop Planner", "Premium Fountain Pen", "Washi Tape Multi-Pack", "Electric Pencil Sharpener", "Sticky Note Variety Bundle", "Metal Mesh Desk Organizer", "Bullet Journaling Stencils"],
  "luggage_acessorios": ["Hardshell Carry-On Suitcase", "Set of 6 Compression Packing Cubes", "Digital Luggage Scale", "Memory Foam Travel Neck Pillow", "Leather Passport Holder & Luggage Tag Set", "Foldable Toiletry Bag with Hanging Hook", "TSA-Approved Cable Luggage Lock", "Universal Travel Power Adapter", "Underseat Rolling Cabin Bag", "Portable Power Bank for Travel"],
  "musical_instruments": ["Acoustic Dreadnought Guitar", "61-Key Portable Electronic Keyboard", "Tenor Ukulele (Mahogany)", "Electronic Drum Pad Kit", "Professional Studio Condenser Microphone", "Portable Guitar Amplifier", "Adjustable Folding Music Stand", "Digital Clip-on Chromatic Tuner", "Standard Bb Trumpet with Case", "Student Violin Starter Set"],
  "home_comfort": ["Digital Ultrasonic Humidifier",  "Orthopedic Gel Seat Cushion",  "Smart Wi-Fi Thermostat",  "Portable Space Heater with Remote",  "Aromatherapy Essential Oil Diffuser",  "Dehumidifier with Drain Hose",  "Plush Sherpa Throw Blanket",  "Tower Fan with Sleep Mode"],
  "agro_industry_and_commerce": ["Digital Soil pH and Moisture Meter",  "Heavy-Duty Commercial Greenhouse Film",  "Industrial Scales (300kg Capacity)",  "Automatic Chicken Coop Door Opener",  "Electric Fence Energizer",  "Hydroponic Nutrient Solution Set",  "Commercial Grade Leaf Trimmer",  "Beehive Starter Kit (Cedar Wood)"],
  "small_appliances": ["Digital Air Fryer (5.5L)",  "Single-Serve Coffee Maker",  "Variable Temperature Electric Kettle",  "Personal Smoothie Blender",  "4-Slice Toaster with Bagel Mode",  "Automatic Bread Maker",  "Electric Food Dehydrator",  "Slow Cooker with Programmable Timer"],
  "cool_stuff": ["Levitating Magnetic Globe",  "Retro Arcade Machine (Tabletop)",  "Portable Mini Movie Projector",  "RGB Mechanical Gaming Keyboard",  "Smart LED Hexagon Wall Panels",  "Plasma Ball Lamp",  "Pocket-Sized Thermal Printer",  "Bluetooth Beanie with Built-in Speakers"],
  "fashion_shoes": ["Breathable Mesh Running Sneakers",  "Classic Leather Chelsea Boots",  "Memory Foam Walking Shoes",  "Suede Slip-on Loafers",  "Platform Canvas High-Tops",  "Water-Resistant Hiking Shoes",  "Minimalist Strappy Sandals",  "Formal Wingtip Oxfords"],
  "arts_and_craftmanship": ["Professional Acrylic Paint Set (24 Colors)",  "Mixed Media Sketchbook",  "Electric Pottery Wheel Kit",  "Dual-Tip Alcohol Brush Markers",  "Sculpting Clay Tool Set",  "Canvas Panels Multipack",  "Precision Craft Knife Set",  "Embroidery Starter Kit with Hoops"],
  "electronics": [
    "Noise-Canceling Wireless Headphones",
    "Smart Streaming Stick 4K",
    "Portable Bluetooth Party Speaker",
    "Dual-Band Wi-Fi 6 Router",
    "Universal Smart Remote Control",
    "Digital Voice Assistant Hub",
    "High-Speed HDMI 2.1 Cable",
    "Wireless Charging Pad (15W)"
  ],
  "diapers_and_hygiene": [
    "Premium Ultra-Soft Baby Diapers",
    "Fragrance-Free Sensitive Baby Wipes",
    "Hypoallergenic Baby Shampoo & Wash",
    "Disposable Bed Underpads",
    "Antiseptic Hand Sanitizer Gel",
    "Gentle Skin Cleansing Bar",
    "Moisturizing Diaper Rash Cream",
    "Adult Incontinence Briefs"
  ],
  "cine_photo": [
    "Mirrorless Digital Camera Body",
    "Compact 4K Video Camcorder",
    "Adjustable Aluminum Camera Tripod",
    "High-Speed 128GB SDXC Memory Card",
    "Instant Film Camera (Retro Style)",
    "External Camera Flash Speedlight",
    "Waterproof Action Camera",
    "Professional Photography Lighting Kit"
  ],
  "christmas_supplies": [
    "Pre-Lit Artificial Christmas Tree",
    "Multi-Color LED String Lights",
    "Hand-Painted Glass Ornaments",
    "Outdoor Inflatable Holiday Decoration",
    "Personalized Christmas Stockings",
    "Velvet Christmas Tree Skirt",
    "Traditional Pine Holiday Wreath",
    "Decorative Christmas Table Runner"
  ],
  "air_conditioning": [
    "Portable Air Conditioner (12,000 BTU)",
    "Energy Star Window AC Unit",
    "Smart Split-System Air Conditioner",
    "Evaporative Swamp Cooler Fan",
    "Wall-Mounted AC Remote Control",
    "Replacement High-Airflow Filter",
    "Anti-Vibration AC Support Bracket",
    "Ductless Mini-Split Heat Pump"
  ],
  "pet_shop": [
    "Churu Lickable Cat Treats",
    "Wild Alaskan Salmon Oil for Dogs & Cats",
    "Orthopedic Memory Foam Dog Bed",
    "No-Pull Adjustable Dog Harness",
    "Interactive Automatic Ball Launcher",
    "Dog Snuffle Mat for Foraging",
    "Smart Wi-Fi Pet Feeder with Camera",
    "Biodegradable Eco-Friendly Poop Bags",
    "Clumping Cat Litter with Odor Control",
    "Self-Grooming Wall Brush for Cats"
  ],
  "kitchen_dining_laundry_garden_furniture": [
    "Teak Wood Outdoor Dining Set",
    "Woven Rope Patio Accent Chair",
    "HDPE Wicker Garden Sofa Sectional",
    "Rolling Kitchen Island with Granite Top",
    "Folding Bamboo Laundry Drying Rack",
    "Industrial Style Adjustable Bar Stools",
    "Sleek Aluminum Outdoor Bistro Set",
    "Stackable Galvanized Steel Garden Chairs",
    "Marble Top Round Dining Table",
    "Weather-Resistant Garden Storage Bench"
  ],
  "drinks": [
    "Premium Ceremonial Grade Matcha Powder",
    "Artisan Pistachio Coffee Syrup",
    "Natural Electrolyte Coconut Water",
    "Low-Alcohol Sparkling Botanical Tonic",
    "Cold-Pressed Organic Green Juice",
    "Prebiotic Soda for Gut Health",
    "Vietnamese Ground Coffee with Chicory",
    "Craft Roasted Whole Bean Coffee",
    "Sparkling Mineral Water (Glass Bottle)",
    "Black Cherry & Cream Soda Blend"
  ],
  "flowers": [
    "Dozen Long-Stemmed Red Roses",
    "Potted White Moth Orchid (Phalaenopsis)",
    "Sunlit Citrus Sunflower & Tulip Bouquet",
    "Moody Jewel Tone Dahlia Arrangement",
    "Cottage Style Ranunculus & Carnation Mix",
    "Pastel Sorbet Hydrangea Bouquet",
    "Fresh Cut Wildflower Field Mix",
    "Fragrant Lavender & Dried Flower Bundle",
    "Stargazer Lily & Eucalyptus Arrangement",
    "Luxury White Peony Bridal Bouquet"
  ],
  "industry_commerce_and_business": [
    "Heavy-Duty Hydraulic Pallet Jack",
    "High-Speed Desktop Thermal Label Printer",
    "Electronic Touchscreen Cash Register",
    "Industrial Steel Boltless Storage Shelving",
    "Wireless Bluetooth Barcode Scanner",
    "Ergonomic Mesh Office Task Chair",
    "Biodegradable Eco-Packaging Peanuts",
    "Fire-Resistant Industrial Safety Boots",
    "Cross-Cut High-Security Paper Shredder",
    "Digital Platform Warehouse Shipping Scale"
  ],
  "fashion_bags_accessories": [
    "Prada Re-Nylon Drawstring Pouch",
    "Loewe Flamenco Mini Leather Clutch",
    "Coach Empire Leather Carryall Bag",
    "Ralph Lauren Vintage Leather Duffel",
    "Polarized Classic Aviator Sunglasses",
    "Luxury Gold-Tone Chronograph Watch",
    "Pure Silk Floral Print Scarf",
    "RFID Blocking Genuine Leather Wallet",
    "Water-Resistant Canvas Laptop Backpack",
    "Minimalist Adjustable Metal Link Belt"
  ]
  
};

async function updateProductNames() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    // Get all unique categories that exist in your database
    const categoriesInDb = await Product.distinct("product_category_name");
    const bulkOps = [];

    for (const category of categoriesInDb) {
      // Find all documents belonging to this specific category
      const docs = await Product.find({ product_category_name: category });
      const namePool = categoryProductMap[category];

      console.log(`Processing ${docs.length} items in category: ${category}`);

      docs.forEach((doc, index) => {
        let newName;

        if (namePool && namePool.length > 0) {
          // Cycle through the provided names (0, 1, 2, 0, 1, 2...)
          newName = namePool[index % namePool.length];
        } else {
          // Fallback if category isn't in your JSON map
          newName = `${category.replace(/_/g, ' ')} Item ${index + 1}`;
        }

        // Create the UPDATE operation
        bulkOps.push({
          updateOne: {
            filter: { _id: doc._id }, // Find the specific document by ID
            update: { $set: { product_name: newName } } // Update only the product_name field
          }
        });
      });
    }

    // Execute the updates in batches of 1000 to prevent timeouts
    if (bulkOps.length > 0) {
      console.log(`Sending ${bulkOps.length} updates to the database...`);
      
      for (let i = 0; i < bulkOps.length; i += 1000) {
        const chunk = bulkOps.slice(i, i + 1000);
        await Product.bulkWrite(chunk);
        console.log(`Progress: ${Math.min(i + 1000, bulkOps.length)} / ${bulkOps.length} updated`);
      }
    }

    console.log("Database update complete!");
    process.exit(0);

  } catch (err) {
    console.error("Migration Error:", err);
    process.exit(1);
  }
}

updateProductNames();