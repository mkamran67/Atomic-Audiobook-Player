export function convertURI(uriToConvert: string) {

  const encodedUri = encodeURIComponent(uriToConvert);

  return `aap-img://${encodedUri}`;
}

export function convertURIForAudio(uriToConvert: string) {

  const encodedUri = encodeURIComponent(uriToConvert);

  return `get-audio://${encodedUri}`;
}

