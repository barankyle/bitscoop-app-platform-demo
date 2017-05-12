require.config({
	paths: {
		site: window.staticUrl + 'js/site.min',
		templates: window.staticUrl + 'js/templates.min',

		// Util
		'moment-fix': window.staticUrl + 'js/util/moment-fix.min',

		//Filters
		'relative-time': window.staticUrl + 'js/filters/relative-time.min',

		//
		'nunjucks-env': window.staticUrl + 'lib/nunjucks/environments/default.min'
	}
});

requirejs.config({
	paths: {
		bluebird: 'https://cdn.jsdelivr.net/bluebird/latest/bluebird.min', // http://bluebirdjs.com/docs/getting-started.html
		chart: 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.5.0/Chart', // https://github.com/chartjs/Chart.js
		datetimepicker: 'https://cdn.rawgit.com/Eonasdan/bootstrap-datetimepicker/master/src/js/bootstrap-datetimepicker', //
		jquery: 'https://code.jquery.com/jquery-3.2.1.min',  // https://github.com/jquery/jquery
		'jquery-deparam': 'https://cdn.bitscoop.com/jquery-deparam/0.4.2/jquery-deparam-0.4.2.min',  // https://github.com/AceMetrix/jquery-deparam
		'jquery-deserialize': 'https://cdn.bitscoop.com/jquery-deserialize/1.3.2/jquery.deserialize-1.3.2.min',  // https://github.com/kflorence/jquery-deserialize
		lodash: 'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/3.10.1/lodash.min',  // https://github.com/lodash/lodash
		moment: 'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.10.6/moment.min',  // http://momentjs.com/
		nunjucks: 'https://cdn.bitscoop.com/nunjucks/2.4.1/nunjucks-2.4.1.min',  // https://github.com/mozilla/nunjucks
	},

	map: {
		'*': {
			'promises-ap': 'bluebird',
			'nunjucks': 'nunjucks-env'
		},

		'nunjucks-env': {
			'nunjucks': 'nunjucks'
		}
	},

	shim: {
		chart: {
			deps: ['moment-fix']
		},

		datetimepicker: {
			deps: ['bootstrap-collapse', 'bootstrap-transition']
		},

		'jquery-deserialize': {
			deps: ['jquery']
		},

		nunjucks: {
			exports: 'nunjucks'
		},

		'relative-time': {
			deps: ['moment']
		}
	}
});
