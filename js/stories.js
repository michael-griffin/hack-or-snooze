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
  let loginExtra = "";

  if (currentUser){
    const unfilledStar = '<i class="favorite-star bi bi-star"></i>';
    const filledStar = '<i class="favorite-star bi bi-star-fill"></i>';

    let favIds = currentUser.favorites.map(favorite => favorite.storyId);
    let isFav = favIds.includes(story.storyId);
    loginExtra = isFav ? filledStar : unfilledStar;
  }

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        ${loginExtra}
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
function putFavoritesOnPage() {
  console.debug("putFavoritesOnPage");
  $favoritesList.empty();

  if (currentUser.favorites.length === 0) {
    $('#favorites-default-message').show();
  } else {
    $('#favorites-default-message').hide();
    for (let favorite of currentUser.favorites) {
      //console.log(favorite, " favorite in loop");
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
  let storyToAdd = await storyList.addStory(currentUser, formInputs);

  //clear form fields
  $("#author-input").val("");
  $("#title-input").val("");
  $("#url-input").val("");

  let $story = generateStoryMarkup(storyToAdd);
  console.log($story, "$story");
  $allStoriesList.prepend($story);
  $newStoryForm.hide();
}
$("#new-story-submit").on("click", submitNewStory);



/**
 * On click, gets closest story and closest star,
 * for closest story, toggles favorite status
 * for closest star, toggles css class to make it appear selected/not
 * @param {*} evt
 */
async function handleStarClick(evt) {
  let $closestStar = $(evt.target).closest('i');
  let $closestLi = $(evt.target).closest('li');
  let id = $closestLi.attr("id");

  const story = await Story.retrieveStory(id);

  let favIds = currentUser.favorites.map(favorite => favorite.storyId);
  let isFav = favIds.includes(story.storyId);

  if (!isFav) {
    await currentUser.addFavorite(story);
  } else {
    await currentUser.removeFavorite(story);
  }

  const starFilled = "bi-star-fill bi-star";
  $closestStar.toggleClass(starFilled);
}




// let story = storyList.stories[0];   // grab first story on list
// currentUser.addFavorite(story);
// console.log(currentUser.favorites);
//Add event listener to parent element of star
$favoritesList.on('click', '.favorite-star', handleStarClick);
$allStoriesList.on('click', '.favorite-star', handleStarClick);