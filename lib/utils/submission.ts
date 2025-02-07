export function generateSubmissionId(examType: string): string {
  // Get current date components
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const day = now.getDate().toString().padStart(2, "0");

  // Generate a random 6-digit number
  const random = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, "0");

  // Format: YYMMDD-TYPE-XXXXXX
  return `${year}${month}${day}-${examType}-${random}`;
}
