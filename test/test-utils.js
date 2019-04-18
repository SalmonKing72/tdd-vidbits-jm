const {jsdom} = require('jsdom');
const Video = require('../models/video');

// Create and return a sample Video object
const buildItemObject = (options = {}) => {
  const title = options.title || 'My favorite video';
  const description = options.description || 'Just the best video';
  const videoUrl = options.videoUrl || 'https://www.youtube.com/embed/6f1AmbR2pzM';
  return {title, description, videoUrl};
};

// Add a sample Item object to mongodb
const seedItemToDatabase = async (options = {}) => {
  const video = await Video.create(buildItemObject(options));
  return video;
};

// find video player by source
findIframeElementBySource = (htmlAsString, src) => {
  const iframe = jsdom(htmlAsString).querySelector(`iframe[src="${src}"]`);
  if (iframe !== null) {
    return iframe;
  } else {
    throw new Error(`Iframe with src "${src}" not found in HTML string`);
  }
};

// extract text from an Element by selector.
const parseTextFromHTML = (htmlAsString, selector) => {
  const selectedElement = jsdom(htmlAsString).querySelector(selector);
  if (selectedElement !== null) {
    return selectedElement.textContent;
  } else {
    throw new Error(`No element with selector ${selector} found in HTML string`);
  }
};

// extract text from an Element by selector.
const parseValueFromHTMLInput = (htmlAsString, selector) => {
  const selectedElement = jsdom(htmlAsString).querySelector(selector);
  if (selectedElement !== null) {
    return selectedElement.value;
  } else {
    throw new Error(`No element with selector ${selector} found in HTML string`);
  }
};

module.exports = {
  buildItemObject,
  parseTextFromHTML,
  parseValueFromHTMLInput,
  seedItemToDatabase,
  findIframeElementBySource
};