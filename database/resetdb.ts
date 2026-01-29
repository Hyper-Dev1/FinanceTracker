// resetdb.js
import * as FileSystem from 'expo-file-system/legacy';

export const resetDatabase = async () => {
  try {
    const dbPath = `${FileSystem.documentDirectory}SQLite/financeApp.db`;

    const fileInfo = await FileSystem.getInfoAsync(dbPath);
    if (fileInfo.exists) {
      await FileSystem.deleteAsync(dbPath, { idempotent: true });
      console.log('Database file deleted.');
    } else {
      console.log('No database file found to delete.');
    }
  } catch (error) {
    console.error('❌ Error resetting database:', error);
  }
};
