angular.module('userControllers', ['userServices'])

// Controller: regCtrl is used for users to register an account
.controller('regCtrl', function($http, $location, $timeout, User, $scope) {

    var app = this;

    app.limit = 5; // Set a default limit to ng-repeat
    app.searchLimit = 0; // Set the default search page results limit to zero


    app.showAll = function() {
        app.limit = undefined; // Clear ng-repeat limit
        app.showMoreError = false; // Clear error message
    };

    app.showMore = function(number) {
        app.showMoreError = false; // Clear error message
        // Run functio only if a valid number above zero
        if (number > 0) {
            app.limit = number; // Change ng-repeat filter to number requested by user
        } else {
            app.showMoreError = 'Please enter a valid number'; // Return error if number not valid
        }
    };
    app.search = function(searchKeyword, number) {
        // Check if a search keyword was provided
        if (searchKeyword) {
            // Check if the search keyword actually exists
            if (searchKeyword.length > 0) {
                app.limit = 0; // Reset the limit number while processing
                $scope.searchFilter = searchKeyword; // Set the search filter to the word provided by the user
                app.limit = number; // Set the number displayed to the number entered by the user
            } else {
                $scope.searchFilter = undefined; // Remove any keywords from filter
                app.limit = 0; // Reset search limit
            }
        } else {
            $scope.searchFilter = undefined; // Reset search limit
            app.limit = 0; // Set search limit to zero
        }
    };

    // Function: Clear all fields
    app.clear = function() {
        $scope.number = 'Clear'; // Set the filter box to 'Clear'
        app.limit = 0; // Clear all results
        $scope.searchKeyword = undefined; // Clear the search word
        $scope.searchFilter = undefined; // Clear the search filter
        app.showMoreError = false; // Clear any errors
    };

    User.getOtherUser().then(function(data) {
          app.others = data.data.others;
          app.loading = false;
        });

    // Custom function that registers the user in the database
    this.regUser = function(regData, valid, confirmed) {
        app.disabled = true; // Disable the form when user submits to prevent multiple requests to server
        app.loading = true; // Activate bootstrap loading icon
        app.errorMsg = false; // Clear errorMsg each time user submits

        // If form is valid and passwords match, attempt to create user
        if (valid && confirmed) {
            app.regData.name = app.regData.firstName + " " + app.regData.lastName; // Combine first and last name before submitting to database
            // Runs custom function that registers the user in the database
            User.create(app.regData).then(function(data) {
                // Check if user was saved to database successfully
                if (data.data.success) {
                    app.loading = false; // Stop bootstrap loading icon
                    $scope.alert = 'alert alert-success'; // Set class for message
                    app.successMsg = data.data.message + '...Redirecting'; // If successful, grab message from JSON object and redirect to login page
                    // Redirect after 2000 milliseconds (2 seconds)
                    $timeout(function() {
                        $location.path('/login');
                    }, 2000);
                } else {
                    app.loading = false; // Stop bootstrap loading icon
                    app.disabled = false; // If error occurs, remove disable lock from form
                    $scope.alert = 'alert alert-danger'; // Set class for message
                    app.errorMsg = data.data.message; // If not successful, grab message from JSON object
                }
            });
        } else {
            app.disabled = false; // If error occurs, remove disable lock from form
            app.loading = false; // Stop bootstrap loading icon
            $scope.alert = 'alert alert-danger'; // Set class for message
            app.errorMsg = 'Please ensure form is filled our properly'; // Display error if valid returns false
        }
    };

    //  Custom function that checks if username is available for user to use
    this.checkUsername = function(regData) {
        app.checkingUsername = true; // Start bootstrap loading icon
        app.usernameMsg = false; // Clear usernameMsg each time user activates ngBlur
        app.usernameInvalid = false; // Clear usernameInvalid each time user activates ngBlur

        // Runs custom function that checks if username is available for user to use
        User.checkUsername(app.regData).then(function(data) {
            // Check if username is available for the user
            if (data.data.success) {
                app.checkingUsername = false; // Stop bootstrap loading icon
                app.usernameMsg = data.data.message; // If successful, grab message from JSON object
            } else {
                app.checkingUsername = false; // Stop bootstrap loading icon
                app.usernameInvalid = true; // User variable to let user know that the chosen username is taken already
                app.usernameMsg = data.data.message; // If not successful, grab message from JSON object
            }
        });
    };

    // Custom function that checks if e-mail is available for user to use
    this.checkEmail = function(regData) {
        app.checkingEmail = true; // Start bootstrap loading icon
        app.emailMsg = false; // Clear emailMsg each time user activates ngBlur
        app.emailInvalid = false; // Clear emailInvalid each time user activates ngBlur

        // Runs custom function that checks if e-mail is available for user to use
        User.checkEmail(app.regData).then(function(data) {
            // Check if e-mail is available for the user
            if (data.data.success) {
                app.checkingEmail = false; // Stop bootstrap loading icon
                app.emailMsg = data.data.message; // If successful, grab message from JSON object
            } else {
                app.checkingEmail = false; // Stop bootstrap loading icon
                app.emailInvalid = true; // User variable to let user know that the chosen e-mail is taken already
                app.emailMsg = data.data.message; // If not successful, grab message from JSON object
            }
        });
    };
})

// Custom directive to check matching passwords
.directive('match', function() {
    return {
        restrict: 'A', // Restrict to HTML Attribute
        controller: function($scope) {
            $scope.confirmed = false; // Set matching password to false by default

            // Custom function that checks both inputs against each other
            $scope.doConfirm = function(values) {
                // Run as a loop to continue check for each value each time key is pressed
                values.forEach(function(ele) {
                    // Check if inputs match and set variable in $scope
                    if ($scope.confirm == ele) {
                        $scope.confirmed = true; // If inputs match
                    } else {
                        $scope.confirmed = false; // If inputs do not match
                    }
                });
            };
        },

        link: function(scope, element, attrs) {

            // Grab the attribute and observe it
            attrs.$observe('match', function() {
                scope.matches = JSON.parse(attrs.match); // Parse to JSON
                scope.doConfirm(scope.matches); // Run custom function that checks both inputs against each other
            });

            // Grab confirm ng-model and watch it
            scope.$watch('confirm', function() {
                scope.matches = JSON.parse(attrs.match); // Parse to JSON
                scope.doConfirm(scope.matches); // Run custom function that checks both inputs against each other
            });
        }
    };
})
