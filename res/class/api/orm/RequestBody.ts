const RequestBody = {
	post: {
		create: {
			user: function (name: string, surname: string, email: string, password: string) {
				return {
					name: name,
					surname: name,
					email: email,
					password: password,
				}
			},
			collective: function (name: string, email: string) {
				return {
					name: name,
					email: email,
				}
			},
			chore: function(name: string, title: string, description: string, startDate: string, frequency: number) {
				return {
					name: name,
					title: title,
					description: description,
					startDate: startDate,
					frequency: frequency,
				}
			},
		},
	},
	put: {
		update: {
			user: function (oldPassword: string, name: string, surname: string, email: string, newPassword: string) {
				return {
					oldPassword: oldPassword,
					name: name,
					surname: name,
					newPassword: newPassword,
				}
			},
			collective: function (name: string, email: string) {
				return {
					name: name,
					email: email,
				}
			},
			chore: function(name: string, title: string, description: string, startDate: string, frequency: number) {
				return {
					name: name,
					title: title,
					description: description,
					startDate: startDate,
					frequency: frequency,
				}
			},
		}
	},
	delete: {}
};

module.exports = RequestBody;
