import { generateSamplePeople } from "./sample-data";
import { validateNRIC } from "../schemas";

// Generate 10 sample FINs and validate them
const samplePeople = generateSamplePeople(10);

// Print and validate each FIN
console.log("Generated FINs and validation results:");
samplePeople.forEach((person, index) => {
  const isValid = validateNRIC(person.fin);
  console.log(`${index + 1}. ${person.fin} (${person.fullName}) - ${isValid ? "✓" : "✗"}`);
});

// Print summary
const validCount = samplePeople.filter(p => validateNRIC(p.fin)).length;
console.log(`\nValidation Summary: ${validCount}/${samplePeople.length} FINs are valid`);
