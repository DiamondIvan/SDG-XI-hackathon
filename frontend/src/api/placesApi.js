export async function fetchAutocomplete(input) {
  const response = await fetch(
    `https://sdghackathon-1-173683223586.asia-southeast1.run.app/api/places/autocomplete?input=${encodeURIComponent(input)}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch autocomplete");
  }

  return response.json();
}
