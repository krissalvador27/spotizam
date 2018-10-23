import sanitizeHtml from "sanitize-html";

interface Song {
  artist: string;
  title: string;
  lyricMatch: string;
}

export function makeSong(searchResult: any): Song {
  // Parse song from search result
  const searchTitle = searchResult.title;
  let artist = "";
  let title = "";

  try {
    if (searchTitle.indexOf("|") > -1) {
      [artist, title] = searchTitle.split("|")[0].split("–");
    } else if (searchTitle.indexOf("by") > -1) {
      [title, artist] = searchTitle.split("by")[0].split("–");
    } else {
      [artist, title] = searchTitle.split("...")[0].split("–");
    }

    artist = artist.replace(" and ", " ");
    artist = artist.replace(" & ", " ");
    title = title.trim();

    if (title.indexOf(" Lyrics")) {
      title = title.substring(0, title.trim().lastIndexOf(" "));
    }
  } catch (err) {
    console.warn("Invalid search result", searchResult.title);
  }

  const cleanSnippet = sanitizeHtml(searchResult.htmlSnippet, {
    allowedTags: ["b"]
  });

  return {
    artist,
    title,
    lyricMatch: cleanSnippet
  };
}
