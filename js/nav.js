'use strict';

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
	console.debug('navAllStories', evt);
	hidePageComponents();
	putStoriesOnPage();
}

$body.on('click', '#nav-all', navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
	console.debug('navLoginClick', evt);
	hidePageComponents();
	$loginForm.show();
	$signupForm.show();
}

$navLogin.on('click', navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
	console.debug('updateNavOnLogin');
	$('.main-nav-links').show();
	$navLogin.hide();
	$navLogOut.show();
	$navUserProfile.text(`${currentUser.username}`).show();
}
// there are the three click options that are found in the nav bar
$navAll.on('click', function(e) {
	hidePageComponents();
});

$navSubmit.on('click', function(e) {
	hidePageComponents();
	$createStoryForm.show();
	$allStoriesList.show();
});

async function showMyStories(e) {
	hidePageComponents();
	$myStoryList.show();
	$myStoryList.empty();
	populateMyStories();
}
$navStories.on('click', showMyStories);

$navFav.on('click', function(e) {
	hidePageComponents();
	// $favStoryList.empty();
	$favStoryList.show();
	populateMyFavorites();
});
