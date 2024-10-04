function validateEmail(emailField) {
	var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
	console.log(emailField)
	console.log(reg.test(emailField))
	if (reg.test(emailField) == false) {
		return false;
	}
	return true;
}

const CommunityChatController = {

    inviteFriend: async (req, res) => {
		try {
			const { friendMail } = req.body
			console.log(req.user)
		} catch (err) {
			console.log(err)
			return res.status(400).send('Error. Try again')
		}
    },

    acceptInvitation: async (req, res) => {
        
    },

    rejectInvitation: async (req, res) => {
        
    }
}

module.exports = CommunityChatController;