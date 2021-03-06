angular.module('userServices', [])

.factory('User', function($http) {
    var userFactory = {}; // Create the userFactory object

    userFactory.pushWork = function(assign) {
			return $http.put('api/works', assign); // Return data from end point to controller
		};


    // Register users in database
    userFactory.create = function(regData) {
        return $http.post('/api/users', regData);
    };

    // Check if username is available at registration
    userFactory.checkUsername = function(regData) {
        return $http.post('/api/checkusername', regData);
    };

    // Check if e-mail is available at registration
    userFactory.checkEmail = function(regData) {
        return $http.post('/api/checkemail', regData);
    };

    // Activate user account with e-mail link
    userFactory.activateAccount = function(token) {
        return $http.put('/api/activate/' + token);
    };

    // Check credentials before re-sending activation link
    userFactory.checkCredentials = function(loginData) {
        return $http.post('/api/resend', loginData);
    };

    // Send new activation link to user
    userFactory.resendLink = function(username) {
        return $http.put('/api/resend', username);
    };

    // Send user's username to e-mail
    userFactory.sendUsername = function(userData) {
        return $http.get('/api/resetusername/' + userData);
    };

    userFactory.getOtherUser = function() {
			return $http.get('api/othersPortfolio/');
		};

    userFactory.getAllUser = function() {
			return $http.get('api/all/');
		};

    // Send password reset link to user's e-mail
    userFactory.sendPassword = function(resetData) {
        return $http.put('/api/resetpassword', resetData);
    };

    // Grab user's information from e-mail reset link
    userFactory.resetUser = function(token) {
        return $http.get('/api/resetpassword/' + token);
    };

    // Save user's new password
    userFactory.savePassword = function(regData) {
        return $http.put('/api/savepassword', regData);
    };

    // Provide the user with a new token
    userFactory.renewSession = function(username) {
        return $http.get('/api/renewToken/' + username);
    };

    // Get the current user's permission
    userFactory.getPermission = function() {
        return $http.get('/api/permission/');
    };

    // Get all the users from database
    userFactory.getUsers = function() {
        return $http.get('/api/management/');
    };


    // Delete a user
    userFactory.deleteUser = function(username) {
        return $http.delete('/api/management/' + username);
    };

    return userFactory; // Return userFactory object
});
