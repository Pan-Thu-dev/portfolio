// FirestoreData type for objects with string keys
export type FirestoreData = Record<string, unknown>;

// Interface for Timestamp-like objects
interface TimestampLike {
  toDate: () => Date;
}

/**
 * Convert Firestore Timestamps to ISO date strings
 * @param data Object containing potential Timestamp fields
 * @returns Object with Timestamps converted to ISO strings
 */
export function convertTimestampsToISO<T extends FirestoreData>(data: T): T {
  if (!data) return data;
  
  const result = { ...data };
  
  for (const key in result) {
    if (Object.prototype.hasOwnProperty.call(result, key)) {
      const value = result[key];
      
      // Check if value is a Timestamp-like object with toDate method
      if (
        value && 
        typeof value === 'object' &&
        value !== null &&
        'toDate' in value &&
        typeof (value as TimestampLike).toDate === 'function'
      ) {
        // Safe casting with proper type checks
        const timestamp = value as TimestampLike;
        result[key] = timestamp.toDate().toISOString() as unknown as T[Extract<keyof T, string>];
      }
    }
  }
  
  return result;
} 