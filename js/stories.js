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

/** Get list of favorites, generate HTML, and put on page. */
function putFavoritesOnPage(){
  $favoritesList.empty();

  for (let favorite of currentUser.favorites){
    const $favorite = generateStoryMarkup(favorite);
    $favoritesList.append($favorite);
  }
  $favoritesList.show();
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



 async function handleStarClick(evt){
  let $closest = $(evt.target).closest('li');

  let $id = $closest.attr("id");
  const currentStory = await Story.retrieveStory($id);

  //still need to check if currentStory is in user.favorites

  //TODO: check if this logic works!
  let alreadyFav = currentUser.favorites.includes(favoriteStory => {
    let favId = favoriteStory.id;
    return (currentStory.id === favId);
  });
  //we should expect false?
  console.log(alreadyFav);
  if (alreadyFav){
    currentUser.addFavorite(currentStory);
  } else {
    currentUser.removeFavorite(currentStory);
  }
  console.log(currentUser.favorites);

/*   let story = storyList.stories[0];   // grab first story on list
  currentUser.addFavorite(story);
  console.log(currentUser.favorites); */

 }
 //Add event listener to parent element of star
$favoritesList.on('click', '.favorite-star', handleStarClick);
$allStoriesList.on('click', '.favorite-star', handleStarClick);