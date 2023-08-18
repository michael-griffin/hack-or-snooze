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

  //check if story is in favorites, then add star
  const unfilledStar = '<i class="favorite-star bi bi-star"></i>';
  const filledStar = '<i class="favorite-star bi bi-star-fill"></i>';

  let favIds = currentUser.favorites.map(favorite => favorite.storyId);
  let isFav = favIds.includes(story.storyId);

  const hostName = story.getHostName();
  //console.log("hostname, ", hostName)
  //<i class="favorite-star bi bi-star"></i>
  return $(`
      <li id="${story.storyId}">
        ${isFav ? filledStar : unfilledStar}

        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

//refactor:
//get rid of generateFavoriteMarkup
/* function generateFavoriteMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  //console.log("hostname, ", hostName)
  return $(`
      <li id="${story.storyId}">
        <i class="favorite-star bi bi-star-fill"></i>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
} */

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
function putFavoritesOnPage() {
  console.debug("putFavoritesOnPage");
  $favoritesList.empty();

  if (currentUser.favorites.length === 0) {
    $('#favorites-default-message').show();
  } else {
    $('#favorites-default-message').hide();
    for (let favorite of currentUser.favorites) {
      const $favorite = generateStoryMarkup(favorite);
      $favoritesList.append($favorite);
    }
  }
  $favoritesList.show();
}

/** submitNewStory:
 * takes information from new story form, updates API with a new story,
 * and puts story on page.
 */

async function submitNewStory(e) {
  console.debug("submitNewStory");

  e.preventDefault();
  let author = $("#author-input").val();
  let title = $("#title-input").val();
  let url = $("#url-input").val();

  const formInputs = { author, title, url };
  //console.log(currentUser, " is currentUser", formInputs, " formInputs")
  let storyToAdd = await storyList.addStory(currentUser, formInputs);

  //clear form feilds
  $("#author-input").val("");
  $("#title-input").val("");
  $("#url-input").val("");

  let $story = generateStoryMarkup(storyToAdd);
  console.log($story, "$story");
  $allStoriesList.prepend($story);
  $newStoryForm.hide();
}
$("#new-story-submit").on("click", submitNewStory);



async function handleStarClick(evt) {
  let $closest = $(evt.target).closest('li');
  let $id = $closest.attr("id");
  console.log('clicked id is: ', $id);

  const currentStory = await Story.retrieveStory($id);
  console.log('currentStory', currentStory);

  toggleFavorites(currentStory);

  //TODO: we still need to update page on favoritesList
  //putFavoritesOnPage();
}

/**
 * receives a story Id, then checks user's favorites for a possible match
 * If already a favorite, removes favorite and updates database
 * Otherwise, adds favorite to currentUser
 * @param {*} id
 */
async function toggleFavorites(story){
  let favIds = currentUser.favorites.map(favorite => favorite.storyId);
  let isFav = favIds.includes(story.storyId);

  console.log('isFav is: ', isFav, 'toggling favorite');
  if (!isFav) {
    await currentUser.addFavorite(story);
  } else {
    await currentUser.removeFavorite(story);
  }
  console.log(currentUser.favorites);
}

// let story = storyList.stories[0];   // grab first story on list
// currentUser.addFavorite(story);
// console.log(currentUser.favorites);
//Add event listener to parent element of star
$favoritesList.on('click', '.favorite-star', handleStarClick);
$allStoriesList.on('click', '.favorite-star', handleStarClick);