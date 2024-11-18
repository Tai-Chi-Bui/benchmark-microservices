/**
 * Verifies if a date string is valid and converts it to the format `dd-mm.yyyy` in Vietnam local time.
 * @param dateString - The date string to validate and format.
 * @returns The formatted date string if valid, otherwise `null`.
 */
export function formatDateIfValid(dateString: string): string | null {
    try {
      // Create a Date object
      const date = new Date(dateString);
  
      // Check if the Date is valid
      if (isNaN(date.getTime())) {
        return null; // Invalid date
      }
  
      // Format the date in Vietnam local time
      const formatter = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Ho_Chi_Minh',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
  
      // Format as `dd-mm.yyyy`
      const formattedDate = formatter.formatToParts(date).map((part) => part.value);
      return `${formattedDate.join('')}`;
    } catch (error) {
      console.error('Error formatting date:', error);
      return null;
    }
  }
  