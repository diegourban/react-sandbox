var React = require("react");

var SignIn = React.createClass({
	render: function() {
		return(
			<div>
				<label htmlFor="username">Username<input type="text" id="username"/></label>
			</div>
		);	
	}	
});

module.exports = SignIn;