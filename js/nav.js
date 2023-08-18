"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  evt.preventDefault();
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  evt.preventDefault();
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);


/** After log in, open form to submit a new story
 *
 */
function navNewStoryClick(){
  hidePageComponents();
  $newStoryForm.show();
  putStoriesOnPage();
}
$navNewStory.on("click", navNewStoryClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  hidePageComponents();
  putStoriesOnPage();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

function updateNavOnLogout() {
  console.debug("updateNavOnLogout");
  $(".main-nav-links").hide();
  $navLogin.show();
  $navLogOut.hide();
}

/**
 * on clicking favorites link, hide rest of page body,
 * put current user's favorites on page, and then
 * show list (with a default message if there are no favorites).
 */
function navFavoritesClick(){
  hidePageComponents();
  putFavoritesOnPage();
  $favoritesContainer.show(); //previously favoritesList.show()
}

$navFavorites.on('click', navFavoritesClick);