/**
 * Check if an email is in the allowed admins list
 * @param email The email to check
 * @returns true if the email is allowed as admin
 */
export const isAllowedAdmin = (email: string): boolean => {
  if (!email) return false;
  
  // Get allowed admin emails from environment variable
  const allowedEmails = process.env.NEXT_PUBLIC_ALLOWED_ADMIN_EMAILS || '';
  
  // Split by comma and trim each email
  const emailList = allowedEmails
    .split(',')
    .map(e => e.trim().toLowerCase());
  
  // Check if email is in the list
  return emailList.includes(email.toLowerCase());
}; 