'use strict';

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */
// console.log(myStories);

async function getAndShowStoriesOnStart() {
	storyList = await StoryList.getStories();
	$storiesLoadingMsg.remove();
	// console.log(storyList);
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
	  <i class="fa fa-star star"></i>
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
	console.debug('putStoriesOnPage');

	$allStoriesList.empty();

	// loop through all of our stories and generate HTML for them         somewhere add getHostName()?
	// console.log(storyList.stories);
	for (let story of storyList.stories) {
		// console.log(storyList);
		const $story = generateStoryMarkup(story);
		$allStoriesList.append($story);
	}

	$allStoriesList.show();

	let $stars = $('.star');
	// console.log($stars);
	for (let star of $stars) {
		star.addEventListener('click', (e) => {
			// console.log(e);
			// console.log(e.path[1].id);
			e.path[0].classList.toggle('checked');
			if (e.path[0].classList.contains('checked')) {
				addFav(e.path[1].id);
			} else {
				removeFav(e.path[1].id);
			}
		});
	}
}

// this function is a click event that takes information and makes a new story. it also adds it to the main page
async function makeUserStory(e) {
	e.preventDefault();
	// document.body.style.backgroundColor = 'red';

	let author = $('#author-input').val();
	let title = $('#title-input').val();
	let url = $('#url-input').val();
	const username = currentUser.username;
	const storyData = { author, title, url };
	console.log(storyData);
	// this creates the story in the API, but doesnt show up until you refresh the page
	let myStory = await storyList.addStory(currentUser, storyData);
	console.log(myStory);

	const builtStory = generateStoryMarkup(myStory);
	$allStoriesList.prepend(builtStory);
	// $myStoryList.prepend(builtStory);

	$createStoryForm.slideUp('slow');
	$createStoryForm.trigger('reset');
}

$newStorySubmitBtn.on('click', makeUserStory);

function generateMyStoryMarkup(story) {
	// console.debug("generateStoryMarkup", story);
	const hostName = story.getHostName();
	return $(`
      <li id="${story.storyId}">
	  <i class="fa fa-trash-o trash"></i>
	  <i class="fa fa-star star"></i>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

async function populateMyStories() {
	console.log(currentUser);

	let text = document.querySelector('#my-stories-list');
	let elementH5 = document.createElement('H5');

	if (currentUser.ownStories.length < 1) {
		console.log(text);
		elementH5.innerText = 'No stories have been added yet';
		text.append(elementH5);
		// text.innerHTML = 'No Stories Added Yet';
	}

	currentUser.ownStories.forEach((story) => {
		const newStroy = generateMyStoryMarkup(story);
		$myStoryList.prepend(newStroy);
	});

	let trashBins = document.getElementsByClassName('trash');

	for (let trash of trashBins) {
		trash.addEventListener('click', (e) => {
			console.log(e.path.id);
			console.log(e.path[1].id);
			removeStory(e.path[1].id);
		});
	}
}

async function removeStory(storyId) {
	const remove = await axios({
		url: `${BASE_URL}/stories/${storyId}`,
		method: 'DELETE',
		data: { token: currentUser.loginToken }
	});
}

function generateMyFavMarkup(story) {
	// console.debug("generateStoryMarkup", story);
	const hostName = story.getHostName();
	return $(`
      <li id="${story.storyId}">
	  <i class="fa fa-star star"></i>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

async function populateMyFavorites() {
	console.log(currentUser);

	let text = document.querySelector('#fav-stories-list');
	let elementH5 = document.createElement('H5');
	// let currentLength = currentUser.favorites.length;

	if (currentUser.favorites.length < 1) {
		console.log(text);
		elementH5.innerText = 'No favorites have been added yet';
		text.append(elementH5);
		// text.innerHTML = 'No Stories Added Yet';
	}
	currentUser.favorites.forEach((story) => {
		const newStory = generateMyFavMarkup(story);
		newStory[0].children[0].classList.add('checked');
		// console.log(newStory[0].children[0]);
		// console.log(newStory[0].children[0].classList);

		newStory[0].children[0].addEventListener('click', (e) => {
			removeFav(newStory[0].id);
			newStory[0].children[0].classList.remove('checked');
		});
		$favStoryList.prepend(newStory);
	});
}

async function addFav(storyId) {
	const fav = await axios({
		url: `${BASE_URL}/users/${currentUser.username}/favorites/${storyId}`,
		method: 'POST',
		data: { token: currentUser.loginToken }
	});
}
async function removeFav(storyId) {
	const fav = await axios({
		url: `${BASE_URL}/users/${currentUser.username}/favorites/${storyId}`,
		method: 'DELETE',
		data: { token: currentUser.loginToken }
	});
}

// function addFavs(params) {
// 	let stars = document.getElementsByClassName('star');
// 	console.log(stars);
// 	for (let star of stars) {
// 		console.log(star);
// 		star.addEventListener('click', (e) => {
// 			e.target.classList.toggle('checked');
// 		});
// 	}
// }
// addFavs();

// window.addEventListener('load', populateMyStories);
