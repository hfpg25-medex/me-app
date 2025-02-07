type Nationality = "Chinese" | "Indian" | "Thai" | "Malaysian";

const chineseNames = [
  { first: "Wei", last: "Zhang" },
  { first: "Xiao", last: "Li" },
  { first: "Ming", last: "Chen" },
  { first: "Hui", last: "Wang" },
  { first: "Jing", last: "Liu" },
  { first: "Yu", last: "Yang" },
];

const indianNames = [
  { first: "Raj", last: "Patel" },
  { first: "Priya", last: "Singh" },
  { first: "Arun", last: "Kumar" },
  { first: "Deepa", last: "Sharma" },
  { first: "Amit", last: "Gupta" },
  { first: "Anita", last: "Reddy" },
];

const thaiNames = [
  { first: "Somchai", last: "Srimuang" },
  { first: "Ratana", last: "Chai" },
  { first: "Sompong", last: "Thongchai" },
  { first: "Malai", last: "Sakda" },
  { first: "Apinya", last: "Saetang" },
  { first: "Thana", last: "Panya" },
];

const malaysianNames = [
  { first: "Ahmad", last: "bin Abdullah" },
  { first: "Siti", last: "binti Ibrahim" },
  { first: "Raj", last: "Kumar" },
  { first: "Lee", last: "Ming Hui" },
  { first: "Nurul", last: "binti Hassan" },
  { first: "Tan", last: "Wei Ling" },
];

// Generate a valid FIN number with proper checksum
function generateFIN(): string {
  // Use G or F prefix for foreigners
  const prefix = ["G", "F"][Math.floor(Math.random() * 2)];
  
  // Generate 7 random digits
  const digits = Array.from({ length: 7 }, () => 
    Math.floor(Math.random() * 10)
  );
  
  // Calculate checksum
  const weights = [2, 7, 6, 5, 4, 3, 2];
  let sum = 0;
  for (let i = 0; i < 7; i++) {
    sum += digits[i] * weights[i];
  }
  
  // Add offset for G prefix
  const offset = prefix === "G" ? 4 : 0;
  const temp = (offset + sum) % 11;
  
  // Get the correct checksum letter
  const fg = ["X", "W", "U", "T", "R", "Q", "P", "N", "M", "L", "K"];
  const checksum = fg[temp];
  
  return `${prefix}${digits.join("")}${checksum}`;
}

// Get a random name based on nationality
function getRandomName(nationality: Nationality): {
  first: string;
  last: string;
} {
  const namesList = {
    Chinese: chineseNames,
    Indian: indianNames,
    Thai: thaiNames,
    Malaysian: malaysianNames,
  }[nationality];

  return namesList[Math.floor(Math.random() * namesList.length)];
}

// Generate a sample person with FIN and name
export function generateSamplePerson(nationality: Nationality) {
  const name = getRandomName(nationality);
  return {
    fin: generateFIN(),
    // Format name with asterisks for privacy
    name: `${name.first[0]}** ${name.last[0]}**${name.last.slice(-1)}`,
    fullName: `${name.first} ${name.last}`, // For reference
  };
}

// Generate multiple sample people
export function generateSamplePeople(count: number = 10): Array<{
  fin: string;
  name: string;
  nationality: Nationality;
  fullName: string;
}> {
  const nationalities: Nationality[] = [
    "Chinese",
    "Indian",
    "Thai",
    "Malaysian",
  ];

  return Array.from({ length: count }, () => {
    const nationality =
      nationalities[Math.floor(Math.random() * nationalities.length)];
    const person = generateSamplePerson(nationality);
    return {
      ...person,
      nationality,
    };
  });
}

// Example usage:
// const samplePerson = generateSamplePerson("Chinese");
// console.log(samplePerson); // { fin: "G1234567A", name: "W** Z**g" }
//
// const samplePeople = generateSamplePeople(5);
// console.log(samplePeople); // Array of 5 sample people with different nationalities
