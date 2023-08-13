"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

//conductor function
//get data from story form, add this to story metho, append to UI page

async function submitNewStory(e){
  e.preventDefault();
  let author = $("#author-input").val();
  let title = $("#title-input").val();
  let url = $("#url-input").val();

  const formInputs = {author, title, url};
  let storyToAdd = await storyList.addStory(currentUser, formInputs);
  console.log('storytoadd is: ', storyToAdd);

  //It looked originally like having too many fields from the new Story
  //was causing the POST request to
  let simplifiedStory = {
    author: storyToAdd["author"],
    title: storyToAdd["title"],
    url: storyToAdd["url"]
  };

  console.log('simplified story is: ', simplifiedStory);
  console.log('simplified story stringified', JSON.stringify(simplifiedStory));
  console.log('loginToken type', typeof(currentUser.loginToken));

  //Below works in Insomnia, but not here.
  //
  const response = await fetch(`${BASE_URL}/stories`, {
    method: "POST",
    body: JSON.stringify({
      token: currentUser.loginToken,
      story: simplifiedStory
    }),
    headers: { //have to specify if we are sending plain text or (stringified) json
        "Content-Type": "application/json"
    }
  });
  console.log(response);
  putStoriesOnPage();
}
 $("#new-story-submit").on("click", submitNewStory)
