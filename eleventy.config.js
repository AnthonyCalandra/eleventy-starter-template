const { DateTime } = require('luxon');
const markdownItAnchor = require('markdown-it-anchor');
const markdownItAttrs = require('markdown-it-attrs');
const prism = require('markdown-it-prism');
const pluginMathJax = require('eleventy-plugin-mathjax');
const pluginRss = require('@11ty/eleventy-plugin-rss');
const pluginBundle = require('@11ty/eleventy-plugin-bundle');
const pluginNavigation = require('@11ty/eleventy-navigation');
const { EleventyHtmlBasePlugin } = require('@11ty/eleventy');

const CONTENT_DIRECTORY_NAME = 'content';

/** @param {import('@11ty/eleventy').UserConfig} eleventyConfig */
module.exports = function(eleventyConfig) {
	// Copy build artifacts to a target directory.
	// e.g. Copy the contents of the `public` folder to the output folder.
	// For example, `./public/css/` ends up in `_site/css/`.
	eleventyConfig.addPassthroughCopy({
		'./public/': '/',
		'./node_modules/boxicons/css/boxicons.min.css': '/css/boxicons.min.css',
		'./node_modules/boxicons/fonts/boxicons.woff2': '/fonts/boxicons.woff2',
	});

	// Watch content images for the image pipeline.
	eleventyConfig.addWatchTarget('content/**/*.{svg,webp,png,jpeg}');

	eleventyConfig.addPlugin(pluginRss, {
		type: 'atom',
		outputPath: '/feed.xml',
		collection: {
			name: 'posts', // iterate over `collections.posts`
			limit: 10,     // 0 means no limit
		},
	});
	// This is expensive to do in development; on the order of a few seconds each reload.
	if (process.env.NODE_ENV === 'production') {
		eleventyConfig.addPlugin(pluginMathJax, {
			output: 'svg',
			tex: {
				// start,end delimiters
				inlineMath: [
					['$', '$'],
				],
				displayMath: [
					['$$', '$$'],
					['```math', '```'],
				],
			},
		});
	}

	eleventyConfig.addPlugin(pluginNavigation);
	eleventyConfig.addPlugin(EleventyHtmlBasePlugin);
	eleventyConfig.addPlugin(pluginBundle);

	eleventyConfig.addFilter('readableDate', dateObj => {
		// Formatting tokens for Luxon: https://moment.github.io/luxon/#/formatting?id=table-of-tokens
		return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat('d LLLL yyyy');
	});

	eleventyConfig.addFilter('isoDate', dateObj => {
		// Formatting tokens for Luxon: https://moment.github.io/luxon/#/formatting?id=table-of-tokens
		return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toISODate();
	});

	eleventyConfig.addFilter('orDefaultTitle', postTitle => {
		return postTitle || 'No title';
	});

	eleventyConfig.addFilter('toHashtags', tags => {
		return (tags || []).map(tag => `#${tag}`).join(' ');
	});

	// Customize Markdown library settings:
	eleventyConfig.amendLibrary('md', md => {
		md.use(markdownItAttrs);
		md.use(markdownItAnchor, {
			permalink: markdownItAnchor.permalink.ariaHidden({
				placement: 'before',
				class: 'header-anchor',
				symbol: '#',
				ariaHidden: false,
			}),
			level: [1,2,3,4],
			slugify: eleventyConfig.getFilter('slugify'),
		});
		md.use(prism);
	});

	eleventyConfig.addShortcode('currentBuildDate', () => {
		return (new Date()).toISOString();
	});

	eleventyConfig.addShortcode('postedOn', function() {
		const isoDate = eleventyConfig.getFilter('isoDate')(this.page.date);
		const readableDate = eleventyConfig.getFilter('readableDate')(this.page.date);
		return `<time class="posted-on" datetime="${isoDate}">Posted on ${readableDate}</time>`;
	});

	eleventyConfig.addCollection('posts', collectionApi => {
		return collectionApi.getFilteredByGlob(`${CONTENT_DIRECTORY_NAME}/b/*.md`);
	});

	eleventyConfig.addCollection('privatePosts', collectionApi => {
		return collectionApi.getFilteredByGlob(['*.md', 'books/*.md']
			.map(glob => `${CONTENT_DIRECTORY_NAME}/b/_private/${glob}`));
	});

	eleventyConfig.setServerOptions({
		// Whether the live reload snippet is used.
		liveReload: true,
		// Whether DOM diffing updates are applied where possible instead of page reloads.
		domDiff: true,
		https: {
			key: '/etc/ssl/private/key.pem',
			cert: '/etc/ssl/certs/chain.pem',
		},
		// Change the default file encoding for reading/serving files.
		encoding: 'utf-8',
		// Show the dev server version number on the command line.
		showVersion: true,
	});

	return {
		templateFormats: ['md', 'njk', 'html'],
		// Pre-process *.md files with njk.
		markdownTemplateEngine: 'njk',
		// Pre-process *.html files with njk.
		htmlTemplateEngine: 'njk',
		// These are all optional:
		dir: {
			input: CONTENT_DIRECTORY_NAME,
			// Paths are relative to the `input` path:
			includes: '_includes',
			layouts: '_includes/layouts',
			data: '_data',
			// =======================================
			output: '_site',
		},
		pathPrefix: '/',
	};
};
