import { db } from "@/config/firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

/**
 * One-time migration script to add is_deduct field to existing categories
 * Run this once after deploying the is_deduct feature
 */
export async function migrateExistingCategories() {
  try {
    console.log("Starting category migration...");
    
    const categoriesRef = collection(db, "categories");
    const snapshot = await getDocs(categoriesRef);
    
    let migratedCount = 0;
    let skippedCount = 0;
    
    for (const docSnapshot of snapshot.docs) {
      const data = docSnapshot.data();
      
      // Check if is_deduct already exists
      if (data.is_deduct !== undefined) {
        console.log(`Skipping ${docSnapshot.id} - already has is_deduct field`);
        skippedCount++;
        continue;
      }
      
      // Add is_deduct field with default value true (expense category)
      await updateDoc(doc(db, "categories", docSnapshot.id), {
        is_deduct: true,
      });
      
      console.log(`Migrated category: ${data.category_name} (${docSnapshot.id})`);
      migratedCount++;
    }
    
    console.log(`\nMigration complete!`);
    console.log(`  Migrated: ${migratedCount} categories`);
    console.log(`  Skipped: ${skippedCount} categories`);
    
    return {
      success: true,
      migrated: migratedCount,
      skipped: skippedCount,
    };
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  }
}
