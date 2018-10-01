interface Song {
  artist: string;
  title: string;
  lyricMatch: string;
}

export function makeSong(searchResult: any): Song {
  // Parse song from search result
  const searchTitle = searchResult.title;

  let [artist, title] = searchTitle.split("|")[0].split("-");
  title = title.trim();
  title = title.substring(0, title.trim().lastIndexOf(" "));

  return {
    artist,
    title,
    lyricMatch: searchResult.htmlSnippet
  }
}