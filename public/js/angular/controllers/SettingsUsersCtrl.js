app.controller('SettingsUsersCtrl', function($scope, $http, dialogs, http, toaster)
{
	$scope.loading = true;
	$scope.error = false;
	$scope.message = '';
	$scope.users = [];

	http.post(window.app_path + 'settings/users').
		success(function(data, status, headers, config)
		{
			$scope.users = data;
			$scope.loading = false;
			console.log(data);
		}).
		error(function(data, status, headers, config)
		{
			$scope.message = errorExceptionMessage(data, status, config);
			$scope.error = true;
			$scope.loading = false;
		});

	$scope.deleteUser = function(user)
	{
		var d = dialogs.confirm('Delete User - ' + user.community_id, 'Are you sure you want to delete the user "'+ user.nickname + '"?');

		d.result.then(function(c) {
			http.post(window.app_path + 'settings/users/delete', user.id).
				success(function(data)
				{
					if(! data.status)
					{
						toaster.pop('error', 'Deleting the user failed!', '', null, null, function()
						{
							dialogs.error('An error occured while deleting the user', errorMessage(data.code, data.message));
						});
					}
					else
					{
						$scope.users.splice(findWithAttr($scope.users, 'id', user.id), 1);
						toaster.pop('success', data.message);	
					}
				}).
				error(function(data, status, headers, config)
				{
					dialogs.error('A fatal error occured!', errorExceptionMessage(data, status, config));
				});
		});
	};

   	$scope.newUser = function()
   	{
   		var d = dialogs.create(window.template_path + 'dialogs/settings.new-user.html', 'newUserDialogControl',{});

   		d.result.then(function(name){
			console.log(name);
		},function(){
			console.log("here");
		});

   	}

})

.controller('newUserDialogControl', function($scope,$modalInstance,data)
{



	$scope.cancel = function(){
		$modalInstance.dismiss();
	};
});