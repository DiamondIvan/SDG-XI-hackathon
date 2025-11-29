const API_BASE_URL = "https://sdghackathon.onrender.com";

export async function fetchAutocomplete(input) {
  const response = await fetch(
    `${API_BASE_URL}/api/places/autocomplete?input=${encodeURIComponent(input)}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch autocomplete");
  }

  return response.json();
}
