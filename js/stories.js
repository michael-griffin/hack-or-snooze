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
  //console.log("hostname, ", hostName)
  return $(`
      <li id="${story.storyId}">
        <i class="favorite-star bi bi-star"></i>
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

/** submitNewStory:
 * takes information from new story form, updates API with a new story,
 * and puts story on page.
 */

async function submitNewStory(e){
  e.preventDefault();
  let author = $("#author-input").val("");
  let title = $("#title-input").val("");
  let url = $("#url-input").val("");

  const formInputs = {author, title, url};
  let storyToAdd = await storyList.addStory(currentUser, formInputs);

  let $story = generateStoryMarkup(storyToAdd);
  console.log($story, "$story");
  $allStoriesList.prepend($story);
  $newStoryForm.hide();
}
 $("#new-story-submit").on("click", submitNewStory);



 function handleStarClick(evt){
  console.log('got here');
  console.log(evt.target);
  let $closest = $(evt.target).closest('li');
  console.log($closest, 'closest');

  let storyToTarget = storyList.getStory(id);
  //what is the jQuery for targeting

  //check if star is already clicked?
    //If clicked, user.unfavorite()
    //otherwise, user.favorite()

  //target storyID from star?

  //If already favorited, unfavorit
 }
 //Add event listener to parent element of star
$favoritesList.on('click', '.favorite-star', handleStarClick);
$allStoriesList.on('click', '.favorite-star', handleStarClick);