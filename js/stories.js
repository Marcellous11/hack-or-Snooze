'use strict';

// This is the global list of the stories, an instance of StoryList
let storyList;
let allFavList = [];

/** Get and show stories when site first loads. */
// console.log(myStories);

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

function generateStoryMarkup(story, showDeleteBtn = false) {
	// console.debug("generateStoryMarkup", story);

	const showStar = Boolean(currentUser);

	const hostName = story.getHostName();
	return $(`
      <li id="${story.storyId}">
	 ${showDeleteBtn ? getDeleteBtnHTML() : ''}
	  ${showStar ? getStarHTML(story, currentUser) : ''}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

function getDeleteBtnHTML() {
	return `
	<span class="trash-can">
		<i class= "fas fa-trash-alt"> <i/>
	</span>`;
}

function getStarHTML(story, user) {
	const isFavorite = user.isFavorite(story);
	const starType = isFavorite ? 'fas' : 'far';
	return `
		<span class="star">
			<i class= "${starType} fa-star"></i>
		</span>`;
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
	console.debug('putStoriesOnPage');
	$allStoriesList.empty();
	// loop through all of our stories and generate HTML for them

	for (let story of storyList.stories) {
		const $story = generateStoryMarkup(story);
		$allStoriesList.append($story);
	}
	$allStoriesList.show();
}

async function deleteStory(e) {
	const $closestLi = $(e.target).closest('li');
	const storyId = $closestLi.attr('id');

	await storyList.removeStory(currentUser, storyId);

	await populateMyStories();
}

$myStoryList.on('click', '.trash-can', deleteStory);

// this function is a click event that takes information and makes a new story. it also adds it to the main page
async function makeUserStory(e) {
	e.preventDefault();
	// document.body.style.backgroundColor = 'red';

	let author = $('#author-input').val();
	let title = $('#title-input').val();
	let url = $('#url-input').val();
	const username = currentUser.username;
	const storyData = { author, title, url };
	// this creates the story in the API, but doesnt show up until you refresh the page
	let myStory = await storyList.addStory(currentUser, storyData);
	console.log(myStory);

	const builtStory = generateStoryMarkup(myStory);
	$allStoriesList.prepend(builtStory);

	$createStoryForm.slideUp('slow');
	$createStoryForm.trigger('reset');
}

$newStorySubmitBtn.on('click', makeUserStory);

async function populateMyStories() {
	console.log(currentUser);

	let text = document.querySelector('#my-stories-list');
	let elementH5 = document.createElement('H5');

	if (currentUser.ownStories.length < 1) {
		console.log(text);
		elementH5.innerText = 'No stories have been added yet';
		text.append(elementH5);
		// text.innerHTML = 'No Stories Added Yet';
	} else {
		for (let story of currentUser.ownStories) {
			let $story = generateStoryMarkup(story, true);
			$myStoryList.append($story);
		}
	}
	// $myStoryList.show();
}

async function populateMyFavorites() {
	$favStoryList.empty();

	let text = document.querySelector('#fav-stories-list');
	let elementH5 = document.createElement('H5');

	if (currentUser.favorites.length < 1) {
		elementH5.innerText = 'No favorites have been added yet';
		text.append(elementH5);
	} else {
		for (let story of currentUser.favorites) {
			const $story = generateStoryMarkup(story);
			$favStoryList.append($story);
		}
	}
	$favStoryList.show();
}

async function toggleStoryFavorites(e) {
	const $target = $(e.target);
	const $closestLi = $target.closest('li');
	const storyId = $closestLi.attr('id');
	const story = storyList.stories.find((s) => s.storyId === storyId);

	if ($target.hasClass('fas')) {
		await currentUser.removeFav(story);
		$target.closest('i').toggleClass('fas far');
	} else {
		await currentUser.addFav(story);
		$target.closest('i').toggleClass('fas far');
	}
}
$storiesLists.on('click', '.star', toggleStoryFavorites);

// window.addEventListener('load', populateMyStories);
