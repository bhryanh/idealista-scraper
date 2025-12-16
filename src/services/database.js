const { MongoClient } = require("mongodb");

/**
 * Database service for MongoDB
 * Handles connection and CRUD operations for apartments
 */
class DatabaseService {
  constructor() {
    this.client = null;
    this.db = null;
    this.collection = null;
  }

  /**
   * Connect to MongoDB
   */
  async connect() {
    try {
      const uri = process.env.MONGODB_URI;
      if (!uri) {
        throw new Error("MONGODB_URI is not defined in environment variables");
      }

      this.client = new MongoClient(uri);
      await this.client.connect();

      const dbName = process.env.MONGODB_DATABASE || "idealista_scraper";
      this.db = this.client.db(dbName);
      this.collection = this.db.collection("apartments");

      // Create index on URL to ensure uniqueness
      await this.collection.createIndex({ url: 1 }, { unique: true });

      console.log("✅ Connected to MongoDB");
    } catch (error) {
      console.error("❌ Error connecting to MongoDB:", error.message);
      throw error;
    }
  }

  /**
   * Check if an apartment already exists in the database
   * @param {string} url - Apartment URL
   * @returns {Promise<boolean>} True if exists, false otherwise
   */
  async apartmentExists(url) {
    try {
      const count = await this.collection.countDocuments({ url });
      return count > 0;
    } catch (error) {
      console.error("Error checking apartment existence:", error.message);
      return false;
    }
  }

  /**
   * Save a new apartment to the database
   * @param {Object} apartment - Apartment data
   * @returns {Promise<boolean>} True if saved successfully
   */
  async saveApartment(apartment) {
    try {
      const apartmentWithTimestamp = {
        ...apartment,
        foundAt: new Date(),
        notified: false,
      };

      await this.collection.insertOne(apartmentWithTimestamp);
      return true;
    } catch (error) {
      // Ignore duplicate key errors (apartment already exists)
      if (error.code === 11000) {
        return false;
      }
      console.error("Error saving apartment:", error.message);
      return false;
    }
  }

  /**
   * Get all apartments from the database
   * @returns {Promise<Array>} Array of apartments
   */
  async getAllApartments() {
    try {
      return await this.collection.find({}).toArray();
    } catch (error) {
      console.error("Error getting apartments:", error.message);
      return [];
    }
  }

  /**
   * Mark an apartment as notified
   * @param {string} url - Apartment URL
   */
  async markAsNotified(url) {
    try {
      await this.collection.updateOne({ url }, { $set: { notified: true } });
    } catch (error) {
      console.error("Error marking apartment as notified:", error.message);
    }
  }

  /**
   * Get statistics about stored apartments
   * @returns {Promise<Object>} Statistics object
   */
  async getStats() {
    try {
      const total = await this.collection.countDocuments({});
      const notified = await this.collection.countDocuments({ notified: true });
      const notNotified = await this.collection.countDocuments({
        notified: false,
      });

      return {
        total,
        notified,
        notNotified,
      };
    } catch (error) {
      console.error("Error getting stats:", error.message);
      return { total: 0, notified: 0, notNotified: 0 };
    }
  }

  /**
   * Close the database connection
   */
  async close() {
    if (this.client) {
      await this.client.close();
      console.log("🔒 MongoDB connection closed");
    }
  }
}

module.exports = DatabaseService;
