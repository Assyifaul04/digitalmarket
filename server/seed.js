import { db, init } from "./db.js";

// Initialize database first
init();

console.log("Seeding database with sample data...");

try {
  // Clear existing data (optional)
  db.exec("DELETE FROM cart_items");
  db.exec("DELETE FROM products");
  db.exec("DELETE FROM categories");

  // Reset auto-increment
  db.exec(
    "DELETE FROM sqlite_sequence WHERE name IN ('categories', 'products', 'cart_items')"
  );

  // Insert categories
  const insertCategory = db.prepare(
    "INSERT INTO categories (name, description) VALUES (?, ?)"
  );

  const categories = [
    ["Software", "Digital software and applications"],
    ["E-books", "Digital books and publications"],
    ["Templates", "Design templates and themes"],
    ["Courses", "Online courses and tutorials"],
    ["Music", "Digital music and audio files"],
    ["Graphics", "Digital graphics and design assets"],
  ];

  categories.forEach(([name, description]) => {
    insertCategory.run(name, description);
  });

  // Insert products
  const insertProduct = db.prepare(`
  INSERT INTO products (name, description, price, category_id, image, stock_quantity) 
  VALUES (?, ?, ?, ?, ?, ?)
`);

  const products = [
    // Software
    [
      "Photo Editor Pro",
      "Professional photo editing software with advanced features",
      29.99,
      1,
      "/images/photo-editor.jpg",
      100,
    ],
    [
      "Video Converter Ultimate",
      "Convert videos to any format with high quality",
      19.99,
      1,
      "/images/video-converter.jpg",
      150,
    ],
    [
      "Password Manager",
      "Secure password management tool for all devices",
      24.99,
      1,
      "/images/password-manager.jpg",
      200,
    ],

    // E-books
    [
      "JavaScript Complete Guide",
      "Comprehensive guide to modern JavaScript development",
      14.99,
      2,
      "/images/js-guide.jpg",
      500,
    ],
    [
      "Digital Marketing Secrets",
      "Master digital marketing strategies and techniques",
      12.99,
      2,
      "/images/marketing-book.jpg",
      300,
    ],
    [
      "Cryptocurrency Investing",
      "Learn how to invest in cryptocurrency safely",
      16.99,
      2,
      "/images/crypto-book.jpg",
      400,
    ],

    // Templates
    [
      "Bootstrap Landing Page",
      "Responsive landing page template with modern design",
      8.99,
      3,
      "/images/bootstrap-template.jpg",
      1000,
    ],
    [
      "React Admin Dashboard",
      "Complete admin dashboard template built with React",
      24.99,
      3,
      "/images/react-dashboard.jpg",
      50,
    ],
    [
      "WordPress Blog Theme",
      "Beautiful and SEO-optimized WordPress theme",
      15.99,
      3,
      "/images/wp-theme.jpg",
      75,
    ],

    // Courses
    [
      "Python for Beginners",
      "Complete Python programming course from scratch",
      39.99,
      4,
      "/images/python-course.jpg",
      25,
    ],
    [
      "Web Development Bootcamp",
      "Full-stack web development course with projects",
      59.99,
      4,
      "/images/web-bootcamp.jpg",
      30,
    ],
    [
      "Digital Art Masterclass",
      "Learn digital art techniques from professionals",
      34.99,
      4,
      "/images/art-course.jpg",
      40,
    ],

    // Music
    [
      "Royalty-Free Music Pack",
      "Collection of 50 high-quality background tracks",
      9.99,
      5,
      "/images/music-pack.jpg",
      1000,
    ],
    [
      "Sound Effects Library",
      "Professional sound effects for video and games",
      19.99,
      5,
      "/images/sound-effects.jpg",
      500,
    ],
    [
      "Meditation Music Album",
      "Relaxing music for meditation and sleep",
      7.99,
      5,
      "/images/meditation-music.jpg",
      800,
    ],

    // Graphics
    [
      "Logo Design Bundle",
      "Collection of 100 professional logo templates",
      12.99,
      6,
      "/images/logo-bundle.jpg",
      200,
    ],
    [
      "Social Media Graphics",
      "Instagram and Facebook post templates",
      6.99,
      6,
      "/images/social-graphics.jpg",
      300,
    ],
    [
      "Icon Pack Premium",
      "Set of 500 premium icons in multiple formats",
      8.99,
      6,
      "/images/icon-pack.jpg",
      150,
    ],
  ];

  products.forEach(
    ([name, description, price, categoryId, imageUrl, stock]) => {
      insertProduct.run(name, description, price, categoryId, imageUrl, stock);
    }
  );

  console.log("✅ Database seeded successfully!");
  console.log(`✅ Inserted ${categories.length} categories`);
  console.log(`✅ Inserted ${products.length} products`);

  // Show summary
  const categoryCount = db
    .prepare("SELECT COUNT(*) as count FROM categories")
    .get();
  const productCount = db
    .prepare("SELECT COUNT(*) as count FROM products")
    .get();

  console.log(`\n📊 Database Summary:`);
  console.log(`   Categories: ${categoryCount.count}`);
  console.log(`   Products: ${productCount.count}`);
} catch (error) {
  console.error("❌ Error seeding database:", error);
}
