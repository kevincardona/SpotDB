import React from 'react';
import '../layouts/Twitter.css';

const TwitterTimeline = ({ user }) => {
	return (
		<a 	className="twitter-timeline" 
				data-theme="dark" 
				data-link-color="#2ECDB7" 
				data-tweet-limit="2"
				href={"https://twitter.com/" + user}>
			Tweets by {user}
		</a>
	);
};

export default TwitterTimeline;

// <a class="twitter-timeline" data-theme="dark" data-link-color="#2ECDB7" href="https://twitter.com/spotdb?ref_src=twsrc%5Etfw">Tweets by spotdb</a> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>