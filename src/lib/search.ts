export function searchGoogle(query: string): Promise<any> {
  return fetch(
    `https://www.googleapis.com/customsearch/v1/siterestrict?q=${query}&cx=${encodeURIComponent(<string>process.env.REACT_APP_GOOGLE_CX_ID)}&key=${process.env.REACT_APP_GOOGLE_API_KEY}`
  ).then(res => {
    return res.json();
  });
}